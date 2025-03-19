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

  const filteredData = data.filter(
    (curr) =>
      curr.currency.toLowerCase().includes(search.toLowerCase()) ||
      Currencies[curr.currency].name
        .toLowerCase()
        .includes(search.toLowerCase())
  );
  return (
    <div>
      <div className="sticky top-0 z-20 bg-background">
        <Input
          className="w-full"
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </div>
      <Table>
        <TableHeader className="sticky top-[36px] z-20 bg-background">
          <TableRow>
            <TableHead>Currency</TableHead>
            <TableHead>Rates</TableHead>
            <TableHead>Change %</TableHead>
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
              <TableCell>{curr.formatRates}</TableCell>
              {parseFloat(curr.changePercentage) < 0 ? (
                <TableCell>
                  <span className="text-red-600">{curr.changePercentage}%</span>
                </TableCell>
              ) : (
                <TableCell>
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
    </div>
  );
}
