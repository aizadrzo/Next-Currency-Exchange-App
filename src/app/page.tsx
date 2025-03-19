import { CurrencyTable } from "@/components/CurrencyTable";
import { getLatestRates } from "./getLatestRates";

export default async function Home() {
  const data = await getLatestRates();
  return (
    <div>
      <section>
        <div className="mx-auto px-4 py-16 sm:py-32 lg:flex lg:items-center">
          <div className="mx-auto max-w-xl text-center">
            <h1 className="text-3xl font-extrabold sm:text-5xl">
              Latest Rates
            </h1>
            <p className="mt-4 sm:text-xl/relaxed">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt
              illo tenetur fuga ducimus numquam ea!
            </p>
          </div>
        </div>
      </section>
      <CurrencyTable data={data} />
    </div>
  );
}
