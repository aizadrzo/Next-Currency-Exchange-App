"use client";
import React from "react";
import { Currencies } from "@/lib/constant";
import { Input } from "./ui/input";
import { CurrencySelector } from "./CurrencySelector";
import { CurrencyTable } from "./CurrencyTable";
import { getLatestRates } from "@/app/getLatestRates";
import { Currency } from "@/app/types";
import { CurrencyTableSkeleton } from "./CurrencyTableSkeleton";

export function CurrencyList() {
  const [search, setSearch] = React.useState("");
  const [data, setData] = React.useState<Currency[]>([]);
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [value, setValue] = React.useState<Currency["baseCurrency"]>("EUR");

  const fetchData = () => {
    startTransition(async () => {
      try {
        const rates = await getLatestRates(value);
        setData(rates);
        setValue(rates[0]?.baseCurrency);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
      }
    });
  };

  React.useEffect(() => {
    fetchData();
  }, [value]);

  if (isPending) <CurrencyTableSkeleton />;

  if (error) <div className="text-red-500">{error}</div>;

  const sanitizeSearch = (input: string) => {
    return input
      .replace(/[^a-zA-Z0-9]/g, "")
      .replace(/\s+/g, "")
      .toLowerCase();
  };

  const filteredData = data.filter((curr) => {
    const sanitizedSearch = sanitizeSearch(search);
    const currencyName =
      Currencies[curr.currency as keyof typeof Currencies].name;

    return (
      sanitizeSearch(curr.currency).includes(sanitizedSearch) ||
      sanitizeSearch(currencyName).includes(sanitizedSearch)
    );
  });

  return (
    <>
      <div className="sticky top-0 z-20 bg-background py-2">
        <div className="flex flex-col md:flex-row gap-1 w-full">
          <Input
            className="w-full flex-1"
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <CurrencySelector value={value} onValueChange={setValue} />
        </div>
      </div>
      <CurrencyTable data={filteredData} search={search} />
    </>
  );
}
