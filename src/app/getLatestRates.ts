import { baseUrl } from "@/lib/constant";

type CurrencyRates = {
    [currency: string]: number;
  };

export const getLatestRates = async() => {
      const today = new Date();
      const copyOfToday = new Date(today);
      copyOfToday.setDate(today.getDate() - 60);
      const daysAgo = copyOfToday.toISOString().split("T")[0];
    
      const response = await fetch(`${baseUrl}/${daysAgo}..`);
      if (!response) throw new Error("Failed to fetch data");
      const ratesData = await response.json();
      const baseCurrency = ratesData.base;
      const dates = Object.keys(ratesData.rates);
      const yesterday = dates[dates.length - 2];
      const latestDate = dates[dates.length - 1];
    
      const yesterdayRate = ratesData.rates[yesterday] as CurrencyRates;
      const latestRates = ratesData.rates[latestDate] as CurrencyRates;
    
      const data = Object.entries(latestRates).map(([currency, rate]) => {
        const previousRate = yesterdayRate[currency];
        const change = previousRate ? rate - previousRate : 0;
        const changePercentage = previousRate
          ? ((change / previousRate) * 100).toFixed(2)
          : "N/A";
    
        return {
          baseCurrency,
          change,
          changePercentage,
          currency,
          rate,
        };
      });

      return data;
}