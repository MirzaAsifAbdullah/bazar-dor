import Link from "next/link";
import ProductCard from "@/app/components/ProductCard";
import { Suspense } from "react";

interface ICategory {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

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

interface ICategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}

const API_BASE = "https://openapi.programming-hero.com/api/bazardor";


async function getCategory(slug: string): Promise<ICategory | null> {
  const response = await fetch(
    `${API_BASE}/categories/${encodeURIComponent(slug)}`,
    {
      cache: "force-cache",
    },
  );

  if (!response.ok) {
    throw new Error("ক্যাটাগরির তথ্য লোড করা যায়নি");
  }

  const category: ICategory = await response.json();

  if (!category || !category.slug) {
    return null;
  }

  return category;
}


async function getProducts(slug: string): Promise<IProduct[]> {
  const response = await fetch(
    `${API_BASE}/products?category=${encodeURIComponent(slug)}`,
    {
      cache: "force-cache",
    },
  );

  if (!response.ok) {
    throw new Error("এই ক্যাটাগরির পণ্য লোড করা যায়নি");
  }

  const products: IProduct[] = await response.json();

  return Array.isArray(products) ? products : [];
}


export default function CategoryPage(props: ICategoryPageProps) {
  return (
    <Suspense
      fallback={
        <main className="min-h-[calc(100vh-150px)] bg-[#f3f7f3] px-4 py-8">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
              <div className="mb-4 text-4xl">🛒</div>
              <p className="text-sm text-gray-500">ক্যাটাগরি লোড হচ্ছে...</p>
            </div>
          </div>
        </main>
      }
    >
      <CategoryPageContent {...props} />
    </Suspense>
  );
}


async function CategoryPageContent({
  params,
  searchParams,
}: ICategoryPageProps) {
  const { slug } = await params;
  const { sort } = await searchParams;

  const [category, products] = await Promise.all([
    getCategory(slug),
    getProducts(slug),
  ]);


  if (!category) {
    return (
      <main className="min-h-[calc(100vh-150px)] bg-[#f3f7f3] px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
            <div className="mb-4 text-5xl">🔎</div>

            <h1 className="text-xl font-bold text-gray-800">
              ক্যাটাগরি পাওয়া যায়নি
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              আপনি যে ক্যাটাগরিটি খুঁজছেন সেটি পাওয়া যায়নি।
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
            >
              হোমে ফিরে যান
            </Link>
          </div>
        </div>
      </main>
    );
  }


  const sortedProducts = [...products];

  if (sort === "low") {
    sortedProducts.sort((a, b) => a.today - b.today);
  } else if (sort === "high") {
    sortedProducts.sort((a, b) => b.today - a.today);
  }

  return (
    <main className="min-h-[calc(100vh-150px)] bg-[#f3f7f3] px-4 py-8">
      <div className="mx-auto max-w-6xl">
      
        <section className="mb-3 rounded-xl border border-gray-200 bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-2xl">
              {category.icon || "🛒"}
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {category.nameBn}
              </h1>

              <p className="mt-1 text-xs text-gray-500">
                এই ক্যাটাগরির সকল পণ্যের বর্তমান বাজারদর
              </p>
            </div>
          </div>
        </section>

       
        <section className="mb-3 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
          <p className="text-xs text-gray-500">
            মোট {sortedProducts.length.toLocaleString("bn-BD")}টি পণ্য
          </p>

          <form method="GET" className="flex items-center gap-2">
            <label htmlFor="sort" className="text-xs text-gray-500">
              সাজান
            </label>

            <select
              id="sort"
              name="sort"
              defaultValue={sort || "default"}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none focus:border-green-500"
            >
              <option value="default">ডিফল্ট</option>
              <option value="low">দাম কম থেকে বেশি</option>
              <option value="high">দাম বেশি থেকে কম</option>
            </select>

            <button
              type="submit"
              className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-700"
            >
              সাজান
            </button>
          </form>
        </section>

      
        {sortedProducts.length > 0 ? (
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        ) : (
          <section className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
            <div className="mb-4 text-5xl">{category.icon || "🛒"}</div>

            <h2 className="text-lg font-bold text-gray-800">
              এই ক্যাটাগরিতে কোনো পণ্য নেই
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              বর্তমানে এই ক্যাটাগরির কোনো পণ্যের তথ্য পাওয়া যায়নি।
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
            >
              হোমে ফিরে যান
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
