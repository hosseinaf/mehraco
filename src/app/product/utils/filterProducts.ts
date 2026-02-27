import { ProductItem } from "@/queries/product/type";

/** Normalize stock to number (API may return string). Also consider availabilityStatus. */
export function getStockNumber(p: ProductItem): number {
  const num = Number(p.stock);
  if (!Number.isNaN(num)) return num;
  const status = p.availabilityStatus?.toLowerCase();
  if (status === "in stock" || status === "available") return 1;
  if (status === "out of stock" || status === "unavailable") return 0;
  return 0;
}

export function isInStock(p: ProductItem): boolean {
  return getStockNumber(p) > 0;
}

export interface LocalFilterParams {
  q?: string;
  sort?: string;
  category?: string;
  brand?: string;
  price?: string;
  inStock?: boolean;
}

function parsePriceRange(priceStr: string): { min?: number; max?: number } | null {
  if (!priceStr) return null;
  if (priceStr === "100+") return { min: 100 };
  const match = priceStr.match(/^(\d+)-(\d+)$/);
  if (match) return { min: Number(match[1]), max: Number(match[2]) };
  return null;
}

function matchesPrice(value: number, range: { min?: number; max?: number }): boolean {
  if (range.min != null && value < range.min) return false;
  if (range.max != null && value > range.max) return false;
  return true;
}

export function filterAndSortProducts(
  products: ProductItem[],
  params: LocalFilterParams
): ProductItem[] {
  let result = [...products];

  const q = (params.q ?? "").trim().toLowerCase();
  if (q) {
    result = result.filter(
      (p) =>
        (p.title ?? "").toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q) ||
        (p.category ?? "").toLowerCase().includes(q) ||
        (p.brand ?? "").toLowerCase().includes(q)
    );
  }

  if (params.category) {
    result = result.filter(
      (p) => (p.category ?? "").toLowerCase() === params.category!.toLowerCase()
    );
  }

  if (params.brand) {
    result = result.filter(
      (p) => (p.brand ?? "").toLowerCase() === params.brand!.toLowerCase()
    );
  }

  const priceRange = parsePriceRange(params.price ?? "");
  if (priceRange) {
    result = result.filter((p) => {
      const num = Number(p.price);
      return !Number.isNaN(num) && matchesPrice(num, priceRange);
    });
  }

  if (params.inStock) {
    result = result.filter((p) => getStockNumber(p) > 0);
  }

  const sort = params.sort ?? "newest";
  result.sort((a, b) => {
    switch (sort) {
      case "price-asc": {
        const pa = Number(a.price);
        const pb = Number(b.price);
        return (Number.isNaN(pa) ? 0 : pa) - (Number.isNaN(pb) ? 0 : pb);
      }
      case "price-desc": {
        const pa = Number(a.price);
        const pb = Number(b.price);
        return (Number.isNaN(pb) ? 0 : pb) - (Number.isNaN(pa) ? 0 : pa);
      }
      case "discount-desc": {
        const da = Number(a.discountPercentage) || 0;
        const db = Number(b.discountPercentage) || 0;
        return db - da;
      }
      case "newest":
      default: {
        const ta = a.meta?.updatedAt ?? a.meta?.createdAt ?? "";
        const tb = b.meta?.updatedAt ?? b.meta?.createdAt ?? "";
        return tb.localeCompare(ta);
      }
    }
  });

  return result;
}
