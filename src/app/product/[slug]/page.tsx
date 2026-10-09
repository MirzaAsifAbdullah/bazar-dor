import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const instant = false;

interface IProduct {
id: number;
slug: string;
nameBn: string;
category: string;
categoryNameBn: string;
categoryIcon: string;
unit: string;
image: string;
today: number;
yesterday: number;
lastWeek: number;
lastMonth: number;
change: {
dir: "up" | "down" | "flat";
pct: number;
};
markets: {
market: string;
division: string;
min: number;
max: number;
}[];
}

interface IProductPageProps {
params: Promise<{
slug: string;
}>;
}

const formatPrice = (price: number) =>
price.toLocaleString("bn-BD", {
maximumFractionDigits: 2,
});

const ProductPage = async ({ params }: IProductPageProps) => {
const session = await auth.api.getSession({
headers: await headers(),
});

if (!session?.user) {
redirect("/signin");
}

const { slug } = await params;

const res = await fetch(
"https://api.abcz.workers.dev/api/bazardor/products",
{
next: {
revalidate: 3600,
},
}
);

if (!res.ok) {
throw new Error("পণ্যের তথ্য লোড করা যায়নি");
}

const products: IProduct[] = await res.json();

const product = products.find((item) => item.slug === slug);

if (!product) {
return ( <main className="min-h-[calc(100vh-150px)] bg-[#f3f7f3] px-4 py-10"> <div className="mx-auto max-w-6xl"> <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center"> <div className="mb-4 text-5xl">🔎</div>


        <h1 className="text-xl font-bold text-gray-800">
          পণ্য পাওয়া যায়নি
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          আপনি যে পণ্যটি খুঁজছেন সেটি পাওয়া যায়নি।
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          হোমে ফিরে যান
        </Link>
      </div>
    </div>
  </main>
);


}

const allMinPrices = product.markets.map((market) => market.min);
const allMaxPrices = product.markets.map((market) => market.max);

const minPrice =
allMinPrices.length > 0
? Math.min(...allMinPrices)
: product.today;

const maxPrice =
allMaxPrices.length > 0
? Math.max(...allMaxPrices)
: product.today;

const marketAverages = product.markets.map(
(market) => (market.min + market.max) / 2
);

const averagePrice =
marketAverages.length > 0
? marketAverages.reduce((sum, price) => sum + price, 0) /
marketAverages.length
: product.today;

// Product unit labels
const unitNames: Record<string, string> = {
kg: "কেজি",
liter: "লিটার",
dozen: "ডজন",
piece: "পিস",
};

const formattedUnit = unitNames[product.unit] || product.unit;

// Dynamic comparison with yesterday's price
const priceDifference = product.today - product.yesterday;

const priceMessage =
priceDifference > 0
? `গতকালের তুলনায় আজ দাম বেড়েছে ${formatPrice(priceDifference)} টাকা`
: priceDifference < 0
? `গতকালের তুলনায় আজ দাম কমেছে ${formatPrice(Math.abs(priceDifference))} টাকা`
: "গতকালের তুলনায় আজ দাম অপরিবর্তিত";

const priceMessageColor =
priceDifference > 0
? "text-red-600"
: priceDifference < 0
? "text-green-600"
: "text-gray-500";

const changeText =
product.change.pct > 0
? `▲ ${formatPrice(Math.abs(product.change.pct))}%`
: product.change.pct < 0
? `▼ ${formatPrice(Math.abs(product.change.pct))}%`
: "— ০%";

return ( <main className="min-h-[calc(100vh-150px)] bg-[#f3f7f3] px-4 py-8"> <div className="mx-auto max-w-6xl">
<div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-gray-500"> <Link href="/" className="hover:text-green-600">
হোম </Link>

      <span>›</span>

      <Link
        href={`/category/${product.category}`}
        className="hover:text-green-600"
      >
        {product.categoryNameBn}
      </Link>

      <span>›</span>

      <span className="text-gray-700">{product.nameBn}</span>
    </div>

    {/* Product summary */}
    <section className="mb-5 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f3f7f3] text-3xl">
            {product.image || product.categoryIcon}
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
              {product.nameBn}
            </h1>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500">
                {product.categoryNameBn}
              </span>

              <span className="text-gray-300">·</span>

              <span className="text-xs text-gray-500">
                প্রতি {formattedUnit}
              </span>
            </div>

            {/* Dynamic price-change message */}
            <p
              className={`mt-2 text-xs font-medium ${priceMessageColor}`}
              aria-live="polite"
            >
              {priceMessage}
            </p>
          </div>
        </div>

        {/* Today's price */}
        <div className="shrink-0 rounded-xl bg-[#f3f7f3] px-5 py-3 text-center sm:min-w-28">
          <p className="text-xs text-gray-500">আজকের দাম</p>

          <p className="mt-1 text-2xl font-bold text-gray-800">
            {formatPrice(product.today)}
          </p>

          <p className="text-xs text-gray-500">
            টাকা / {formattedUnit}
          </p>

          <p
            className={`mt-1 text-xs font-semibold ${
              product.change.dir === "up"
                ? "text-red-600"
                : product.change.dir === "down"
                  ? "text-green-600"
                  : "text-gray-500"
            }`}
          >
            {changeText}
          </p>
        </div>
      </div>
    </section>

    {/* Price summary */}
    <section className="mb-5 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <h2 className="mb-4 text-base font-bold text-gray-800">
        দামের সারসংক্ষেপ
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500">সর্বনিম্ন দাম</p>

          <p className="mt-2 text-lg font-bold text-green-600">
            {formatPrice(minPrice)} টাকা
          </p>

          <p className="mt-1 text-[11px] text-gray-500">
            সর্বনিম্ন দামের বাজার
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500">সর্বোচ্চ দাম</p>

          <p className="mt-2 text-lg font-bold text-red-600">
            {formatPrice(maxPrice)} টাকা
          </p>

          <p className="mt-1 text-[11px] text-gray-500">
            সর্বোচ্চ দামের বাজার
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500">গড় দাম</p>

          <p className="mt-2 text-lg font-bold text-green-600">
            {formatPrice(Math.round(averagePrice))} টাকা
          </p>

          <p className="mt-1 text-[11px] text-gray-500">
            প্রতি {formattedUnit}-এর হিসাবে
          </p>
        </div>
      </div>
    </section>

    {/* Market-wise prices */}
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="text-base font-bold text-gray-800">
          বাজারভিত্তিক বাজারদর
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          বিভিন্ন বাজারের সর্বনিম্ন ও সর্বোচ্চ মূল্য
        </p>
      </div>

      {product.markets.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs text-gray-500">
                <th className="px-5 py-3 font-medium">বাজার</th>

                <th className="px-5 py-3 font-medium">বিভাগ</th>

                <th className="px-5 py-3 text-right font-medium">
                  সর্বনিম্ন
                </th>

                <th className="px-5 py-3 text-right font-medium">
                  সর্বোচ্চ
                </th>

                <th className="px-5 py-3 text-right font-medium">
                  গড়
                </th>
              </tr>
            </thead>

            <tbody>
              {product.markets.map((market, index) => {
                const average = (market.min + market.max) / 2;

                return (
                  <tr
                    key={`${market.market}-${index}`}
                    className="border-t border-gray-200"
                  >
                    <td className="px-5 py-3 font-medium text-gray-700">
                      {market.market}
                    </td>

                    <td className="px-5 py-3 text-gray-500">
                      {market.division}
                    </td>

                    <td className="px-5 py-3 text-right text-gray-700">
                      {formatPrice(market.min)} টাকা
                    </td>

                    <td className="px-5 py-3 text-right text-gray-700">
                      {formatPrice(market.max)} টাকা
                    </td>

                    <td className="px-5 py-3 text-right font-medium text-gray-700">
                      {formatPrice(Math.round(average))} টাকা
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-5 py-12 text-center text-sm text-gray-500">
          এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।
        </div>
      )}
    </section>
  </div>
</main>


);
};

export default ProductPage;
