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
import { Search } from "lucide-react";

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
          {filteredData.length < 1 ? (
            <TableRow className="text-center hover:bg-inherit">
              <TableCell colSpan={4} className="py-10 sm:py-12">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="p-2 bg-muted/50 rounded-full w-fit">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold">
                    No result for "{search}"
                  </h3>
                  <p className="mt-1 text-sm sm:text-base max-w-md w-fit">
                    We couldn’t find a currency with that name.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredData?.map((curr) => (
              <TableRow key={curr.currency}>
                <TableCell className="flex items-center gap-2">
                  <div className="relative w-10">
                    <Image
                      className="relative z-10"
                      src={imageUrl(
                        Currencies[curr.currency].code.toLowerCase()
                      )}
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
                    <span className="text-red-600">
                      {curr.changePercentage}%
                    </span>
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
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}
