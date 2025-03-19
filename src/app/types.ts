import { Currencies } from "@/lib/constant";

export type Currency = {
  baseCurrency: keyof typeof Currencies;
  change: number;
  changePercentage: string;
  currency: keyof typeof Currencies;
  rate: number;
  formatRates: string;
};