import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "./ui/table";

export function CurrencyTableSkeleton() {
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
          {[...Array(6)].map((_, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-16 ml-auto" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-12 ml-auto" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-12 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Overlay effect */}
      <div className="absolute inset-0 bg-background/60 pointer-events-none" />
    </div>
  );
}
