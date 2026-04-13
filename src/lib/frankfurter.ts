export type CurrencyDictionary = Record<string, {
  name: string;
  code: string;
  symbol: string;
}>;

export async function getCurrencies(): Promise<CurrencyDictionary> {
  const response = await fetch("https://api.frankfurter.dev/v2/currencies", {
    headers: { "Accept": "application/json" },
    next: { revalidate: 86400 } // Cache for 24 hours locally via Next.js
  });

  if (!response.ok) {
    throw new Error("Failed to fetch currencies from Frankfurter API");
  }

  const data: Array<{
    iso_code: string;
    iso_numeric: string;
    name: string;
    symbol: string;
    start_date: string;
    end_date: string;
  }> = await response.json();

  const dict: CurrencyDictionary = {};

  data.forEach((currency) => {
    // The CDN strictly requires alpha-2 country codes. The simplest robust mapping 
    // for standard fiat currency ISO-4217 is taking the first two letters.
    // Explicit manual overrides can be safely grouped here if needed.
    let countryCode = currency.iso_code.substring(0, 2);
    
    // Some minor edge cases where currency prefix doesn't match country
    if (currency.iso_code === "ANG") countryCode = "NL"; // Netherlands Antilles
    if (currency.iso_code === "XAF" || currency.iso_code === "XOF" || currency.iso_code === "XCD" || currency.iso_code === "XPF") {
       countryCode = "EU"; // Regional Central Africa / etc mapped to generic flag visually
    }

    dict[currency.iso_code] = {
      name: currency.name,
      code: countryCode, 
      symbol: currency.symbol || currency.iso_code
    };
  });

  return dict;
}
