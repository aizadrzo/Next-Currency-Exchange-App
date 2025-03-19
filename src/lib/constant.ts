export const baseUrl = "https://api.frankfurter.dev/v1";

export const imageUrl = (currency : string) => {
  return `https://hatscripts.github.io/circle-flags/flags/${currency}.svg`
};


export const Currencies = {
  AUD: { name: "Australian Dollar", code: "AU", symbol: "A$", locale: "en-AU" },
  BGN: { name: "Bulgarian Lev", code: "BG", symbol: "лв", locale: "bg-BG" },
  BRL: { name: "Brazilian Real", code: "BR", symbol: "R$", locale: "pt-BR" },
  CAD: { name: "Canadian Dollar", code: "CA", symbol: "CA$", locale: "en-CA" },
  CHF: { name: "Swiss Franc", code: "CH", symbol: "CHF", locale: "de-CH" },
  CNY: { name: "Chinese Renminbi Yuan", code: "CN", symbol: "¥", locale: "zh-CN" },
  CZK: { name: "Czech Koruna", code: "CZ", symbol: "Kč", locale: "cs-CZ" },
  DKK: { name: "Danish Krone", code: "DK", symbol: "kr", locale: "da-DK" },
  EUR: { name: "Euro", code: "EU", symbol: "€", locale: "de-DE" },
  GBP: { name: "British Pound", code: "GB", symbol: "£", locale: "en-GB" },
  HKD: { name: "Hong Kong Dollar", code: "HK", symbol: "HK$", locale: "zh-HK" },
  HUF: { name: "Hungarian Forint", code: "HU", symbol: "Ft", locale: "hu-HU" },
  IDR: { name: "Indonesian Rupiah", code: "ID", symbol: "Rp", locale: "id-ID" },
  ILS: { name: "Israeli New Sheqel", code: "IL", symbol: "₪", locale: "he-IL" },
  INR: { name: "Indian Rupee", code: "IN", symbol: "₹", locale: "en-IN" },
  ISK: { name: "Icelandic Króna", code: "IS", symbol: "kr", locale: "is-IS" },
  JPY: { name: "Japanese Yen", code: "JP", symbol: "¥", locale: "ja-JP" },
  KRW: { name: "South Korean Won", code: "KR", symbol: "₩", locale: "ko-KR" },
  MXN: { name: "Mexican Peso", code: "MX", symbol: "MX$", locale: "es-MX" },
  MYR: { name: "Malaysian Ringgit", code: "MY", symbol: "RM", locale: "ms-MY" },
  NOK: { name: "Norwegian Krone", code: "NO", symbol: "kr", locale: "nb-NO" },
  NZD: { name: "New Zealand Dollar", code: "NZ", symbol: "NZ$", locale: "en-NZ" },
  PHP: { name: "Philippine Peso", code: "PH", symbol: "₱", locale: "en-PH" },
  PLN: { name: "Polish Złoty", code: "PL", symbol: "zł", locale: "pl-PL" },
  RON: { name: "Romanian Leu", code: "RO", symbol: "lei", locale: "ro-RO" },
  SEK: { name: "Swedish Krona", code: "SE", symbol: "kr", locale: "sv-SE" },
  SGD: { name: "Singapore Dollar", code: "SG", symbol: "S$", locale: "en-SG" },
  THB: { name: "Thai Baht", code: "TH", symbol: "฿", locale: "th-TH" },
  TRY: { name: "Turkish Lira", code: "TR", symbol: "₺", locale: "tr-TR" },
  USD: { name: "United States Dollar", code: "US", symbol: "$", locale: "en-US" },
  ZAR: { name: "South African Rand", code: "ZA", symbol: "R", locale: "en-ZA" },
} as const;