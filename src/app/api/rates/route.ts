import { NextRequest, NextResponse } from "next/server";
import { getCurrencies } from "@/lib/frankfurter";
import { Currency } from "@/app/types";

type CurrencyRates = {
  [currency: string]: number;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let base = searchParams.get("base");
    const dynamicDict = await getCurrencies();

    // Location detection if base is not explicitly provided
    if (!base) {
      const countryCode = request.headers.get("x-vercel-ip-country");
      let detectedCurrency: string | null = null;
      
      if (countryCode) {
        for (const [isoCode, details] of Object.entries(dynamicDict)) {
          if (details.code === countryCode) {
            detectedCurrency = isoCode;
            break;
          }
        }
      }
      
      // Default fallback if neither base nor country is detected/matched
      base = detectedCurrency || "MYR"; 
    }

    const today = new Date();
    const copyOfToday = new Date(today);
    // Fetch 60 days of data to ensure we hit a "yesterday" value (in case of weekends/holidays)
    copyOfToday.setDate(today.getDate() - 60);
    const daysAgo = copyOfToday.toISOString().split("T")[0];

    // Use v2 endpoint of Frankfurter API
    const frankfurterApiUrl = `https://api.frankfurter.dev/v2/rates?from=${daysAgo}&base=${base}`;
    
    // Cached fetch targeting 1 hour revalidation
    const response = await fetch(frankfurterApiUrl, {
      headers: { "Accept": "application/json" },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from Frankfurter API: ${response.statusText}`);
    }

    const ratesData: Array<{date: string, base: string, quote: string, rate: number}> = await response.json();

    const datesSet = new Set<string>();
    ratesData.forEach((row) => datesSet.add(row.date));
    const dates = Array.from(datesSet).sort();

    if (dates.length < 2) {
      return NextResponse.json({ error: "Not enough historical data available" }, { status: 400 });
    }

    const yesterday = dates[dates.length - 2];
    const latestDate = dates[dates.length - 1];

    const yesterdayRate: Record<string, number> = {};
    const latestRates: Record<string, number> = {};

    ratesData.forEach((row) => {
      if (row.date === yesterday) yesterdayRate[row.quote] = row.rate;
      if (row.date === latestDate) latestRates[row.quote] = row.rate;
    });

    const baseCurrency = base;

    const data: Currency[] = Object.entries(latestRates)
      .map(([currency, rate]) => {
      const previousRate = yesterdayRate[currency] ?? null;
      const change = previousRate !== null ? rate - previousRate : 0;
      const changePercentage = previousRate !== null
        ? ((change / previousRate) * 100).toFixed(2)
        : "N/A";
      
      const currencyMetadata = dynamicDict[currency];
      const locale = "en-US";

      const formatRates = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
      }).format(rate);

      return {
        baseCurrency: baseCurrency,
        currency: currency,
        rate,
        change,
        changePercentage,
        formatRates
      };
    });

    // Return the payload
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in rates API: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
