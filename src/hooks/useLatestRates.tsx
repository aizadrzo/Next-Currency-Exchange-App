"use client";

import { useState, useEffect } from "react";
import { baseUrl, Currencies } from "@/lib/constant";
import { Currency } from "@/app/types";

type CurrencyRates = {
  [currency in keyof typeof Currencies]: number;
};

export const useLatestRates = (base: keyof typeof Currencies = "MYR") => {
  const [data, setData] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const today = new Date();
        const copyOfToday = new Date(today);
        copyOfToday.setDate(today.getDate() - 60);
        const daysAgo = copyOfToday.toISOString().split("T")[0];

        const response = await fetch(`${baseUrl}/${daysAgo}..?base=${base}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const ratesData = await response.json();

        const baseCurrency = ratesData.base as keyof typeof Currencies;
        const dates = Object.keys(ratesData.rates);

        const yesterday = dates[dates.length - 2];
        const latestDate = dates[dates.length - 1];

        const yesterdayRate = ratesData.rates[yesterday] as CurrencyRates;
        const latestRates = ratesData.rates[latestDate] as CurrencyRates;

        const result = Object.entries(latestRates).map(([currency, rate]) => {
          const previousRate =
            yesterdayRate[currency as keyof typeof Currencies];
          const change = previousRate ? rate - previousRate : 0;
          const changePercentage = previousRate
            ? ((change / previousRate) * 100).toFixed(2)
            : "N/A";
          const formatRates = new Intl.NumberFormat(
            Currencies[currency as keyof typeof Currencies].locale,
            {
              style: "currency",
              currency: currency,
            }
          ).format(rate);

          return {
            baseCurrency,
            currency: currency as keyof typeof Currencies,
            rate,
            change,
            changePercentage,
            formatRates,
          };
        });

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [base]);

  return { data, loading, error };
};
