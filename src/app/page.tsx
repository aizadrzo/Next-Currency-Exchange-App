import { CurrencyTable } from "@/components/CurrencyTable";
import { CurrencyTableSkeleton } from "@/components/CurrencyTableSkeleton";
import { getLatestRates } from "./getLatestRates";
import { Suspense } from "react";
import { Hero } from "@/components/Hero";

export default async function Home() {
  const data = await getLatestRates();
  return (
    <div>
      <Hero />
      <Suspense fallback={<CurrencyTableSkeleton />}>
        <CurrencyTable data={data} />
      </Suspense>
    </div>
  );
}
