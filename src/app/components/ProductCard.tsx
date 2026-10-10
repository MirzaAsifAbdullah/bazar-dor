import Link from "next/link";

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

interface IProductCardProps {
  product: IProduct;
}

const ProductCard = ({ product }: IProductCardProps) => {
  const unitName: Record<string, string> = {
    kg: "প্রতি কেজি",
    liter: "প্রতি লিটার",
    dozen: "প্রতি ডজন",
    piece: "প্রতি পিস",
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="block rounded-xl border border-gray-200 bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-2xl">
          {product.image}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            {product.nameBn}
          </h3>

          <p className="text-xs text-gray-500">
            {unitName[product.unit] || product.unit}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-[10px] text-gray-500">আজকের দাম</p>

          <p className="text-base font-bold text-gray-900">
            {product.today.toLocaleString("bn-BD")} টাকা
          </p>
        </div>

        {product.change.dir === "up" && (
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-medium text-red-600">
            ▲ {Math.abs(product.change.pct).toLocaleString("bn-BD")}%
          </span>
        )}

        {product.change.dir === "down" && (
          <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-medium text-green-600">
            ▼ {Math.abs(product.change.pct).toLocaleString("bn-BD")}%
          </span>
        )}

        {product.change.dir === "flat" && (
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-medium text-gray-600">
            {product.change.pct.toLocaleString("bn-BD")}%
          </span>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
