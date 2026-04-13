import { NextResponse } from "next/server";
import { getCurrencies } from "@/lib/frankfurter";

export async function GET() {
  try {
    const currencies = await getCurrencies();
    return NextResponse.json(currencies);
  } catch (error) {
    console.error("Error fetching dynamic currencies", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
