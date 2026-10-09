import Link from "next/link";

import NavbarAuth from "./NavbarAuth";
import CurrentDate from "./CurrentDate";
import Image from "next/image";

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
}

interface ICategory {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

interface INavbarProps {
  products: IProduct[];
}

const Navbar = async ({
  products,
}: INavbarProps) => {
  const res = await fetch(
    "https://api.abcz.workers.dev/api/bazardor/categories",
    {
      next: {
        revalidate: 3600,
      },
    }
  );

  if (!res.ok) {
    throw new Error("ক্যাটাগরি লোড করা যায়নি");
  }

  const categories: ICategory[] = await res.json();

  const unitName: Record<string, string> = {
    kg: "কেজি",
    liter: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4">
      
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 text-lg text-white">
              <Image
                src="/logo-icon.png"
                alt="Logo"
                width={40}
                height={40}
              />
            </div>

            <div>
              <div className="text-base font-bold leading-tight text-gray-800">
                বাজার দর
              </div>

              <div className="text-[10px] text-gray-500">
                <CurrentDate />
              </div>
            </div>
          </Link>

        
          <NavbarAuth />
        </div>

        {/* categories */}
        <nav className="border-t border-gray-100">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-green-50 hover:text-green-700"
              >
                <span>{category.icon}</span>

                <span>{category.nameBn}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Price ticker */}
      <div className="overflow-hidden border-t border-gray-100 bg-gray-50">
        <div className="flex w-max animate-ticker">
          {[...products, ...products].map(
            (product, index) => {
              const unit =
                unitName[product.unit] ||
                product.unit;

              const isUp =
                product.change.dir === "up";

              const isDown =
                product.change.dir === "down";

              return (
                <div
                  key={`${product.id}-${index}`}
                  className="flex shrink-0 items-center gap-2 px-5 py-2 text-xs"
                >
                  <span>
                    {product.image ||
                      product.categoryIcon}
                  </span>

                  <span className="font-medium text-gray-700">
                    {product.nameBn}
                  </span>

                  <span className="text-gray-500">
                    {product.today.toLocaleString(
                      "bn-BD"
                    )}{" "}
                    টাকা/কেজি
                  </span>

                  <span
                    className={
                      isUp
                        ? "font-semibold text-red-500"
                        : isDown
                          ? "font-semibold text-green-600"
                          : "font-semibold text-gray-500"
                    }
                  >
                    {isUp
                      ? "▲"
                      : isDown
                        ? "▼"
                        : "—"}{" "}
                    {Math.abs(
                      product.change.pct
                    ).toLocaleString("bn-BD")}
                    %
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;