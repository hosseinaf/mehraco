import { ProductCard } from "./ProductCard";

export type Product = {
  id: number;
  name: string;
  storage: string;
  color: string;
  camera: string;
  shipping: string;
  price: string;

  // extras used by ProductCard
  imageUrl?: string;
  discount?: string;
  oldPrice?: string;

  // fields for modal
  images?: string[];
  category?: string;
  inStock?: boolean;
  rating?: number;
  reviewCount?: number;
  description?: string;
  warranty?: string;
  returnPolicy?: string;
};

type ProductGridProps = {
  products: Product[];
  loading?: boolean;
  skeletonCount?: number;
  onItemClick?: (product: Product) => void;
};

function SkeletonProductCard() {
  return (
    <article className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-neutral-100 animate-pulse">
      <div className="flex flex-1 items-center justify-center">
        <div className="aspect-3/5 w-full max-w-35 rounded-2xl bg-neutral-100 shadow-inner" />
      </div>

      <div className="space-y-1">
        <div className="h-4 w-3/4 rounded bg-neutral-200" />
        <div className="h-3 w-1/2 rounded bg-neutral-200" />
      </div>

      <div className="mt-1 flex items-center justify-between">
        <div className="space-y-0.5 text-xs text-neutral-500">
          <div className="h-3 w-24 rounded bg-neutral-200" />
          <div className="h-3 w-20 rounded bg-neutral-200" />
        </div>
        <div className="h-5 w-16 rounded bg-neutral-200" />
      </div>
    </article>
  );
}

export function ProductGrid({
  products,
  loading = false,
  skeletonCount = 8,
  onItemClick,
}: ProductGridProps) {
  if (loading) {
    return (
      <section className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonProductCard key={i} />
        ))}
      </section>
    );
  }

  return (
    <section className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="cursor-pointer"
          onClick={() => onItemClick?.(product)}
        >
          <ProductCard {...product} />
        </div>
      ))}
    </section>
  );
}
