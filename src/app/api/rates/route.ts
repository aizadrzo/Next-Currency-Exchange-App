import { NextRequest, NextResponse } from "next/server";
import { Currencies } from "@/lib/constant";
import { Currency } from "@/app/types";

type CurrencyRates = {
  [currency in keyof typeof Currencies]: number;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let base = searchParams.get("base") as keyof typeof Currencies | null;

    // Location detection if base is not explicitly provided
    if (!base) {
      const countryCode = request.headers.get("x-vercel-ip-country");
      let detectedCurrency: keyof typeof Currencies | null = null;
      
      if (countryCode) {
        for (const [key, details] of Object.entries(Currencies)) {
          if (details.code === countryCode) {
            detectedCurrency = key as keyof typeof Currencies;
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

    // Use v1 endpoint of Frankfurter API because the V2 endpoint returns a flat array of objects (or NDJSON) 
    // which breaks our date grouped parsing logic. V1 natively groups by date.
    const frankfurterApiUrl = `https://api.frankfurter.dev/v1/${daysAgo}..?base=${base}`;
    
    // Cached fetch targeting 1 hour revalidation
    const response = await fetch(frankfurterApiUrl, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from Frankfurter API: ${response.statusText}`);
    }

    const ratesData = await response.json();
    const baseCurrency = ratesData.base as keyof typeof Currencies;
    const dates = Object.keys(ratesData.rates);

    if (dates.length < 2) {
      return NextResponse.json({ error: "Not enough historical data available" }, { status: 400 });
    }

    const yesterday = dates[dates.length - 2];
    const latestDate = dates[dates.length - 1];

    const yesterdayRate = ratesData.rates[yesterday] as CurrencyRates;
    const latestRates = ratesData.rates[latestDate] as CurrencyRates;

    const data: Currency[] = Object.entries(latestRates).map(([currency, rate]) => {
      const prev = yesterdayRate[currency as keyof typeof Currencies];
      const previousRate = prev ?? null;
      const change = previousRate !== null ? rate - previousRate : 0;
      const changePercentage = previousRate !== null
        ? ((change / previousRate) * 100).toFixed(2)
        : "N/A";
      
      const currencyMetadata = Currencies[currency as keyof typeof Currencies];
      const locale = currencyMetadata?.locale || "en-US";

      const formatRates = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
      }).format(rate);

      return {
        baseCurrency: baseCurrency,
        currency: currency as keyof typeof Currencies,
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
