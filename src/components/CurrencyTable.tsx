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
import { getLatestRates } from "@/app/getLatestRates";

export async function CurrencyTable() {
  const data = await getLatestRates();

  return (
    <div className="h-[63vh] relative overflow-auto hide-scrollbar">
      <Table>
        <TableHeader className="sticky top-0 z-20 bg-background">
          <TableRow>
            <TableHead>Currency</TableHead>
            <TableHead>Rates</TableHead>
            <TableHead>Change %</TableHead>
            <TableHead className="text-right">Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((curr) => (
            <TableRow key={curr.currency}>
              <TableCell className="flex items-center gap-2">
                <div className="relative w-10">
                  <Image
                    className="relative z-10"
                    src={imageUrl(
                      Currencies[
                        curr.currency as keyof typeof Currencies
                      ].code.toLowerCase()
                    )}
                    width={24}
                    height={24}
                    alt={curr.currency}
                  />
                  <Image
                    className="absolute top-0 left-[35%]"
                    src={imageUrl(
                      Currencies[
                        curr.baseCurrency as keyof typeof Currencies
                      ].code.toLowerCase()
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
                    {Currencies[curr.currency as keyof typeof Currencies].name}{" "}
                    /{" "}
                    {
                      Currencies[curr.baseCurrency as keyof typeof Currencies]
                        .name
                    }
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {new Intl.NumberFormat(
                  Currencies[curr.currency as keyof typeof Currencies].locale,
                  {
                    style: "currency",
                    currency: curr.currency,
                  }
                ).format(curr.rate)}
              </TableCell>
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
