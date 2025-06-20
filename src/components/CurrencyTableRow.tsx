import Image from "next/image";
import { Currencies, imageUrl } from "@/lib/constant";
import { Currency } from "@/app/types";
import { TableCell } from "./ui/table";

export const CurrencyTableRow = ({ currency }: { currency: Currency }) => (
  <>
    <TableCell className="flex items-center gap-2 sticky left-0 bg-background z-10 min-w-[180px] group-hover:bg-muted/1 transition-colors">
      <div className="relative w-10">
        <Image
          className="relative z-10"
          src={imageUrl(Currencies[currency.currency].code.toLowerCase())}
          width={24}
          height={24}
          alt={currency.currency}
        />
        <Image
          className="absolute top-0 left-[35%]"
          src={imageUrl(Currencies[currency.baseCurrency].code.toLowerCase())}
          width={24}
          height={24}
          alt={currency.currency}
        />
      </div>
      <div>
        <span className="font-bold">
          {currency.currency}/{currency.baseCurrency}
        </span>{" "}
        <span className="text-neutral-500 hidden sm:block">
          {Currencies[currency.currency].name} /{" "}
          {Currencies[currency.baseCurrency].name}
        </span>
      </div>
    </TableCell>
    <TableCell className="text-right">{currency.formatRates}</TableCell>
    {parseFloat(currency.changePercentage) < 0 ? (
      <TableCell className="text-right">
        <span className="text-red-400">{currency.changePercentage}%</span>
      </TableCell>
    ) : (
      <TableCell className="text-right">
        <span className="text-green-400">{currency.changePercentage}%</span>
      </TableCell>
    )}
    <TableCell className="text-right">
      {parseFloat(currency.change.toString()).toFixed(4)}
    </TableCell>
  </>
);
