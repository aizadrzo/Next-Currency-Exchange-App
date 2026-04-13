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
  const [error, setError] = React.useState<string | null>(null);
  const [value, setValue] = React.useState<string | "">("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParam = value ? `?base=${value}` : "";
        const [ratesRes, dictRes] = await Promise.all([
          fetch(`/api/rates${queryParam}`),
          fetch(`/api/currencies`)
        ]);

        if (!ratesRes.ok || !dictRes.ok) throw new Error("Network error fetching API");
        
        const rates: Currency[] = await ratesRes.json();
        const dict: CurrencyDictionary = await dictRes.json();

        if ("error" in rates) throw new Error((rates as any).error);

        startTransition(() => {
          setCurrenciesDict(dict);
          setData(rates);
          if (!value && rates[0]?.baseCurrency) {
            setValue(rates[0].baseCurrency);
          }
        });
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchData();
  }, [value]);

  if (error) <div className="text-red-500">{error}</div>;

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
        <CurrencyTable data={filteredData} search={search} dict={currenciesDict} />
      )}
    </div>
  );
}
