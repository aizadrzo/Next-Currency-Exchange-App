import { CurrencyList } from "@/components/CurrencyList";
import { CurrencyTableSkeleton } from "@/components/CurrencyTableSkeleton";
import { Suspense } from "react";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <div>
      <Hero />
      <Suspense fallback={<CurrencyTableSkeleton />}>
        <CurrencyList />
      </Suspense>
    </div>
  );
}
