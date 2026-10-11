import Link from "next/link";

import ProductCard from "./components/ProductCard";
import Hero from "./components/Hero";

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

const HomePage = async () => {
  const res = await fetch(
    "https://api.abcz.workers.dev/api/bazardor/products",
    {
      next: {
        revalidate: 3600,
      },
    },
  );

  if (!res.ok) {
    throw new Error("পণ্যের তথ্য লোড করা যায়নি");
  }

  const products: IProduct[] = await res.json();

  const increasedProducts = [...products]
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  const decreasedProducts = [...products]
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, 6);

  return (
    <div className="bg-[#f3f7f3]">
      <Hero />

      <main className="mx-auto max-w-6xl px-4 pb-12">
        {/* Increased */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
              <span className="text-red-500">▲</span>
              আজ দাম বেড়েছে
            </h2>
          </div>

          {increasedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {increasedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
              আজ দাম বাড়ার কোনো তথ্য পাওয়া যায়নি।
            </div>
          )}
        </section>

        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
              <span className="text-green-600">▼</span>
              আজ দাম কমেছে
            </h2>
          </div>

          {decreasedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {decreasedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
              আজ দাম কমার কোনো তথ্য পাওয়া যায়নি।
            </div>
          )}
        </section>

        {/* All products */}
        <section id="সব-পণ্য">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">সব পণ্য</h2>

              <p className="mt-1 text-xs text-gray-500">
                মোট {products.length}টি পণ্য
              </p>
            </div>

            <Link
              href="/category/chal"
              className="text-sm font-medium text-green-600 hover:text-green-700"
            >
              ক্যাটাগরি দেখুন →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
