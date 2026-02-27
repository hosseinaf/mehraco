import React from "react";
import ProductClient from "./ProductClient";
import productApi from "@/queries/product/request";

interface PageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  // Extract parameters from URL
  const page = Number(params?.page ?? 1);
  const normalizedPage = Number.isNaN(page) || page < 1 ? 1 : page;
  const q = typeof params?.q === "string" ? params.q : "";
  const sort = typeof params?.sort === "string" ? params?.sort : "newest";
  const category = typeof params?.category === "string" ? params.category : "";
  const brand = typeof params?.brand === "string" ? params.brand : "";
  const price = typeof params?.price === "string" ? params.price : "";
  const inStock = params?.inStock === "true";

  const limit = 16;

  // Server-side data fetching for initial render (SSR)
  let initialData = null;
  let error = null;

  try {
    initialData = await productApi.list({
      page: normalizedPage,
      limit,
      q: q || undefined,
      sort,
      category: category || undefined,
      brand: brand || undefined,
      price: price || undefined,
      inStock: inStock || undefined,
    });
  } catch (err) {
    error = String(err);
    console.error("Failed to fetch products:", err);
  }

  return (
    <React.Suspense fallback={<div>Loading products...</div>}>
      <ProductClient initialData={initialData} initialError={error} />
    </React.Suspense>
  );
}
