import { CurrencyList } from "@/components/CurrencyList";
import { CurrencyTableSkeleton } from "@/components/CurrencyTableSkeleton";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      <CurrencyList />
    </>
  );
}
