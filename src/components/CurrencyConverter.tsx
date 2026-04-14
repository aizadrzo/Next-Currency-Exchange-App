"use client";

import React from "react";
import { ArrowLeftRight, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CurrencySelector } from "./CurrencySelector";
import { CurrencyDictionary } from "@/lib/frankfurter";
import { CurrencyChart } from "./CurrencyChart";

type HistoryPoint = {
  date: string;
  rate: number;
};

export default function CurrencyConverter() {
  const [amount, setAmount] = React.useState<number | "">(1);
  const [fromCurrency, setFromCurrency] = React.useState<string>("USD");
  const [toCurrency, setToCurrency] = React.useState<string>("EUR");
  const [currenciesDict, setCurrenciesDict] =
    React.useState<CurrencyDictionary>({});
  const [convertedAmount, setConvertedAmount] = React.useState<number | null>(
    null,
  );
  const [rate, setRate] = React.useState<number | null>(null);
  const [history, setHistory] = React.useState<HistoryPoint[]>([]);
  const [days, setDays] = React.useState<number>(30);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = React.useState(false);

  // Fetch currency dictionary
  React.useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await fetch("/api/currencies");
        if (!res.ok) throw new Error("Failed to fetch currencies");
        const dict: CurrencyDictionary = await res.json();
        setCurrenciesDict(dict);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCurrencies();
  }, []);

  // Fetch latest rate and history
  React.useEffect(() => {
    if (!fromCurrency || !toCurrency) return;

    const fetchConversion = async () => {
      setIsLoading(true);
      try {
        // We use the Frankfurter API v2 single rate endpoint logic
        // But for simplicity in the app, we can fetch from our v2 single rate or just use /rates
        const res = await fetch(
          `https://api.frankfurter.dev/v2/rate/${fromCurrency}/${toCurrency}`,
        );
        if (!res.ok) throw new Error("Failed to fetch rate");
        const data = await res.json();
        setRate(data.rate);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchHistory = async () => {
      setIsHistoryLoading(true);
      try {
        const res = await fetch(
          `/api/history?base=${fromCurrency}&quote=${toCurrency}&days=${days}`,
        );
        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setHistory(data.history);
      } catch (err) {
        console.error(err);
      } finally {
        setIsHistoryLoading(false);
      }
    };

    fetchConversion();
    fetchHistory();
  }, [fromCurrency, toCurrency, days]);

  // Update converted amount when amount or rate changes
  React.useEffect(() => {
    if (rate !== null) {
      const calculationAmount = !amount || amount < 1 ? 1 : amount;
      setConvertedAmount(calculationAmount * rate);
    }
  }, [amount, rate]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden border-none shadow-2xl bg-background/50 backdrop-blur-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Currency Converter
        </CardTitle>
        <CardDescription>
          Real-time exchange rates and historical trends.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-3 space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">
              Amount
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => {
                const val = e.target.value;
                setAmount(val === "" ? "" : Number(val));
              }}
              className="h-12 text-lg font-semibold"
              placeholder="1.00"
            />
          </div>

          <div className="md:col-span-4 space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">
              From
            </label>
            <CurrencySelector
              currencies={currenciesDict}
              value={fromCurrency}
              onValueChange={setFromCurrency as any}
            />
          </div>

          <div className="md:col-span-1 flex justify-center pb-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSwap}
              className="size-10 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              <ArrowLeftRight className="size-5" />
            </Button>
          </div>

          <div className="md:col-span-4 space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">
              To
            </label>
            <CurrencySelector
              currencies={currenciesDict}
              value={toCurrency}
              onValueChange={setToCurrency as any}
            />
          </div>
        </div>

        {/* Result Area */}
        <div className="p-6 rounded-2xl bg-secondary/30 border border-secondary/50 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-baseline md:items-center gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {!amount || amount < 1 ? 1 : amount} {fromCurrency} =
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-primary">
                {isLoading ? (
                  <Loader2 className="animate-spin size-8" />
                ) : (
                  `${convertedAmount?.toFixed(2) || "0.00"} ${toCurrency}`
                )}
              </h2>
              {rate && (
                <p className="text-sm text-muted-foreground font-medium italic">
                  1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
                </p>
              )}
            </div>

            <div className="flex bg-background/50 p-1 rounded-lg border border-border shadow-sm">
              {[30, 60, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                    days === d
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider ml-1">
            Exchange Rate Trend ({fromCurrency} / {toCurrency})
          </h3>
          <CurrencyChart data={history} isLoading={isHistoryLoading} />
        </div>
      </CardContent>
    </Card>
  );
}
