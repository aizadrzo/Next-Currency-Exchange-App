import { CurrencyDictionary } from "@/lib/frankfurter";
import { Currency } from "@/app/types";
import { TableCell } from "./ui/table";

import Image from "next/image";

export const CurrencyTableRow = ({ currency, dict }: { currency: Currency, dict: CurrencyDictionary }) => (
  <>
    <TableCell className="flex items-center gap-2">
      <div className="relative w-10">
        <Image
          className="relative z-10"
          src={dict[currency.baseCurrency]?.flag || "/placeholder-flag.svg"}
          width={24}
          height={24}
          alt={currency.baseCurrency}
        />
        <Image
          className="absolute top-0 left-[35%]"
          src={dict[currency.currency]?.flag || "/placeholder-flag.svg"}
          width={24}
          height={24}
          alt={currency.currency}
        />
      </div>
      <div>
        <span className="font-bold">
          {currency.baseCurrency}/{currency.currency}
        </span>{" "}
        <span className="text-neutral-500 hidden sm:block">
          {dict[currency.baseCurrency]?.name || currency.baseCurrency} /{" "}
          {dict[currency.currency]?.name || currency.currency}
        </span>
      </div>
    </TableCell>
    <TableCell className="text-right">{currency.formatRates}</TableCell>
    {currency.changePercentage === "N/A" ? (
      <TableCell className="text-right text-muted-foreground">0.00%</TableCell>
    ) : parseFloat(currency.changePercentage) < 0 ? (
      <TableCell className="text-right">
        <span className="text-red-400">{currency.changePercentage}%</span>
      </TableCell>
    ) : (
      <TableCell className="text-right">
        <span className="text-green-400">+{currency.changePercentage}%</span>
      </TableCell>
    )}
    <TableCell className="text-right">
      {parseFloat(currency.change.toString()).toFixed(4)}
    </TableCell>
  </>
);
