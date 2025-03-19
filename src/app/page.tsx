import { CurrencyTable } from "@/components/CurrencyTable";
import { getLatestRates } from "./getLatestRates";

export default async function Home() {
  const data = await getLatestRates();
  return (
    <div>
      <CurrencyTable data={data} />
    </div>
  );
}
