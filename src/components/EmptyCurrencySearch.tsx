import React from "react";
import { TableRow, TableCell } from "./ui/table";
import { Search } from "lucide-react";

export const EmptyCurrencySearch = ({ search }: { search: string }) => (
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
);
