"use client";
import React from "react";
import { Currencies } from "@/lib/constant";
import { Input } from "./ui/input";
import { Currency } from "@/app/types";
import { CurrencySelector } from "./CurrencySelector";
import { CurrencyTable } from "./CurrencyTable";

export function CurrencyList({ data }: { data: Currency[] }) {
  const [search, setSearch] = React.useState("");
  const [value, setValue] = React.useState(data[0].baseCurrency || "EUR");

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
      <CurrencyTable data={filteredData} />
    </>
  );
}
