"use client";
import React from "react";
import Image from "next/image";
import { Currencies, imageUrl } from "@/lib/constant";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "./ui/table";
import { Input } from "./ui/input";
import { Currency } from "@/app/types";

export function CurrencyTable({ data }: { data: Currency[] }) {
  const [search, setSearch] = React.useState("");

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
        <Input
          className="w-full"
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </div>
      <Table>
        <TableHeader className="sticky top-[52px] z-20 bg-background">
          <TableRow>
            <TableHead>Currency</TableHead>
            <TableHead className="text-right">Rates</TableHead>
            <TableHead className="text-right">Change %</TableHead>
            <TableHead className="text-right">Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData?.map((curr) => (
            <TableRow key={curr.currency}>
              <TableCell className="flex items-center gap-2">
                <div className="relative w-10">
                  <Image
                    className="relative z-10"
                    src={imageUrl(Currencies[curr.currency].code.toLowerCase())}
                    width={24}
                    height={24}
                    alt={curr.currency}
                  />
                  <Image
                    className="absolute top-0 left-[35%]"
                    src={imageUrl(
                      Currencies[curr.baseCurrency].code.toLowerCase()
                    )}
                    width={24}
                    height={24}
                    alt={curr.currency}
                  />
                </div>
                <div>
                  <span className="font-bold">
                    {curr.currency}/{curr.baseCurrency}
                  </span>{" "}
                  <span className="text-neutral-500 hidden sm:block">
                    {Currencies[curr.currency].name} /{" "}
                    {Currencies[curr.baseCurrency].name}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">{curr.formatRates}</TableCell>
              {parseFloat(curr.changePercentage) < 0 ? (
                <TableCell className="text-right">
                  <span className="text-red-600">{curr.changePercentage}%</span>
                </TableCell>
              ) : (
                <TableCell className="text-right">
                  <span className="text-green-600">
                    {curr.changePercentage}%
                  </span>
                </TableCell>
              )}
              <TableCell className="text-right">
                {parseFloat(curr.change.toString()).toFixed(4)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
