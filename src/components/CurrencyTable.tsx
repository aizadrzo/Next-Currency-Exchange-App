import { Currency } from "@/app/types";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "./ui/table";
import { Search } from "lucide-react";
import { CurrencyTableRow } from "./CurrencyTableRow";

export const CurrencyTable = ({ data }: { data: Currency[] }) => {
  return (
    <Table>
      <TableHeader className="sticky top-[85px] md:top-[52px] z-20 bg-background">
        <TableRow>
          <TableHead>Currency</TableHead>
          <TableHead className="text-right">Rates</TableHead>
          <TableHead className="text-right">Change %</TableHead>
          <TableHead className="text-right">Change</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length < 1 ? (
          <TableRow className="text-center hover:bg-inherit">
            <TableCell colSpan={4} className="py-10 sm:py-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-2 bg-muted/50 rounded-full w-fit">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">
                  Invalid Currency
                </h3>
                <p className="mt-1 text-sm sm:text-base max-w-md w-fit">
                  We couldn’t find a currency with that name.
                </p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          data?.map((curr) => (
            <TableRow key={curr.currency}>
              <CurrencyTableRow currency={curr} />
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
