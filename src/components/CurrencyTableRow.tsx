import Image from "next/image";
import { Currencies, imageUrl } from "@/lib/constant";
import { Currency } from "@/app/types";
import { TableCell } from "./ui/table";

export const CurrencyTableRow = ({ currency }: { currency: Currency }) => (
  <>
    <TableCell className="flex items-center gap-2">
      <div className="relative w-10">
        <Image
          className="relative z-10"
          src={imageUrl(Currencies[currency.baseCurrency].code.toLowerCase())}
          width={24}
          height={24}
          alt={currency.baseCurrency}
        />
        <Image
          className="absolute top-0 left-[35%]"
          src={imageUrl(Currencies[currency.currency].code.toLowerCase())}
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
          {Currencies[currency.baseCurrency].name} /{" "}
          {Currencies[currency.currency].name}
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
