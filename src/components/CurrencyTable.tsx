import { Currency } from "@/app/types";
import { Table, TableHeader, TableHead, TableBody, TableRow } from "./ui/table";
import { CurrencyTableRow } from "./CurrencyTableRow";
import { EmptyCurrencySearch } from "./EmptyCurrencySearch";

export const CurrencyTable = ({
  data,
  search = "",
}: {
  data: Currency[];
  search?: string;
}) => {
  return (
    <div className="relative overflow-x-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 bg-background z-10 min-w-[180px]">
              Currency
            </TableHead>
            <TableHead className="text-right">Rates</TableHead>
            <TableHead className="text-right">Change %</TableHead>
            <TableHead className="text-right">Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length < 1 && search !== "" ? (
            <EmptyCurrencySearch search={search} />
          ) : (
            data?.map((curr) => (
              <TableRow
                key={curr.currency}
                className="group relative hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <CurrencyTableRow currency={curr} />
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
