"use client";
import React from "react";
import { Currencies } from "@/lib/constant";
import { Input } from "./ui/input";
import { CurrencySelector } from "./CurrencySelector";
import { CurrencyTable } from "./CurrencyTable";
import { Currency } from "@/app/types";
import { useLatestRates } from "@/hooks/useLatestRates";
import { CurrencyTableSkeleton } from "./CurrencyTableSkeleton";

export function CurrencyList() {
  const [search, setSearch] = React.useState("");
  const [value, setValue] = React.useState<Currency["baseCurrency"]>("EUR");
  const { data, loading } = useLatestRates(value);

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
          <CurrencySelector value={value} onValueChange={setValue} />
        </div>
      </div>
      {loading ? (
        <CurrencyTableSkeleton />
      ) : (
        <CurrencyTable data={filteredData} search={search} />
      )}
    </div>
  );
}
