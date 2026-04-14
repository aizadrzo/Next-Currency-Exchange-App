"use client";
import React from "react";
import { CurrencyDictionary } from "@/lib/frankfurter";
import { Input } from "./ui/input";
import { CurrencySelector } from "./CurrencySelector";
import { CurrencyTable } from "./CurrencyTable";
import { Currency } from "@/app/types";

export function CurrencyList() {
  const [search, setSearch] = React.useState("");
  const [data, setData] = React.useState<Currency[]>([]);
  const [currenciesDict, setCurrenciesDict] = React.useState<CurrencyDictionary>({});
  const [, startTransition] = React.useTransition();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [value, setValue] = React.useState<string | "">("");
  const lastFetchedValue = React.useRef<string | null>(null);

  React.useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await fetch("/api/currencies");
        if (!res.ok) throw new Error("Failed to fetch currencies");
        const dict: CurrencyDictionary = await res.json();
        setCurrenciesDict(dict);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCurrencies();
  }, []);

  React.useEffect(() => {
    if (Object.keys(currenciesDict).length === 0) return;
    
    // Skip if we already have data for this value (prevents double call on init)
    if (lastFetchedValue.current === value) return;

    const fetchRates = async () => {
      setIsLoading(true);
      try {
        const queryParam = value ? `?base=${value}` : "";
        const res = await fetch(`/api/rates${queryParam}`);

        if (!res.ok) throw new Error("Network error fetching rates");
        
        const rates: Currency[] = await res.json();
        if ("error" in rates) throw new Error((rates as any).error);

        lastFetchedValue.current = value;

        startTransition(() => {
          setData(rates);
          if (!value && rates[0]?.baseCurrency) {
            const detectedBase = rates[0].baseCurrency;
            lastFetchedValue.current = detectedBase; // Sync ref before state update to skip re-fetch
            setValue(detectedBase);
          }
        });
      } catch (err) {
        console.error(err);
        setError("Failed to fetch rates. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
  }, [value, currenciesDict]);

  if (error) return <div className="text-red-500">{error}</div>;

  const sanitizeSearch = (input: string) => {
    return input
      .replace(/[^a-zA-Z0-9]/g, "")
      .replace(/\s+/g, "")
      .toLowerCase();
  };

  const filteredData = data.filter((curr) => {
    const sanitizedSearch = sanitizeSearch(search);
    const currencyName = currenciesDict[curr.currency]?.name || "";

    return (
      sanitizeSearch(curr.currency).includes(sanitizedSearch) ||
      sanitizeSearch(currencyName).includes(sanitizedSearch)
    );
  });

  return (
    <div className="relative">
      <div className="sticky top-0 z-20 bg-background py-2 w-full">
        <div className="flex flex-col md:flex-row gap-1 w-full bg-background">
          <Input
            className="w-full flex-1"
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <CurrencySelector currencies={currenciesDict} value={value || "MYR"} onValueChange={setValue} />
        </div>
      </div>
      {Object.keys(currenciesDict).length > 0 && (
        <CurrencyTable data={filteredData} search={search} dict={currenciesDict} isLoading={isLoading} />
      )}
    </div>
  );
}
