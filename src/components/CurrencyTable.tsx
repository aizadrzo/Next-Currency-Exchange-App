import { Currency } from "@/app/types";
import { CurrencyDictionary } from "@/lib/frankfurter";
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

export const CurrencyTable = ({
  data,
  search = "",
  dict,
}: {
  data: Currency[];
  search?: string;
  dict: CurrencyDictionary;
}) => {
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
        {data.length < 1 && search !== "" ? (
          <TableRow className="text-center hover:bg-inherit">
            <TableCell colSpan={4} className="py-10 sm:py-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-2 bg-muted/50 rounded-full w-fit">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">
                  {search ? `No result for "${search}"` : `No results`}
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
              <CurrencyTableRow currency={curr} dict={dict} />
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
