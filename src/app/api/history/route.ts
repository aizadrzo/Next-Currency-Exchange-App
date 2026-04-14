import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const base = searchParams.get("base") || "EUR";
    const quote = searchParams.get("quote") || "USD";
    const days = parseInt(searchParams.get("days") || "30");

    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days);
    const dateStr = startDate.toISOString().split("T")[0];

    // Fetch data from Frankfurter API v2
    const frankfurterApiUrl = `https://api.frankfurter.dev/v2/rates?from=${dateStr}&base=${base}&quotes=${quote}`;
    
    const response = await fetch(frankfurterApiUrl, {
      headers: { "Accept": "application/json" },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from Frankfurter API: ${response.statusText}`);
    }

    const ratesData: Array<{date: string, base: string, quote: string, rate: number}> = await response.json();

    // Map to a simpler format for the chart
    const history = ratesData.map(d => ({
      date: d.date,
      rate: d.rate
    }));

    return NextResponse.json({
      base,
      quote,
      days,
      history
    });
  } catch (error) {
    console.error("Error in history API: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
