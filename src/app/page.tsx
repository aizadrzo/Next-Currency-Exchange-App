import { CurrencyList } from "@/components/CurrencyList";
import { Hero } from "@/components/Hero";
import CurrencyConverter from "@/components/CurrencyConverter";

export default function Home() {
  return (
    <main className="container mx-auto px-4 space-y-12 pb-20">
      <Hero />
      <div className="-mt-20 md:-mt-32 relative z-30">
        <CurrencyConverter />
      </div>
      <section className="space-y-6">
        <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Market Overview</h2>
            <p className="text-muted-foreground">Top currency exchange rates worldwide.</p>
        </div>
        <CurrencyList />
      </section>
    </main>
  );
}
