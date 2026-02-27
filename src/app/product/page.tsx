import React from "react";
import ProductClient from "./ProductClient";
import productApi from "@/queries/product/request";

export default async function Page() {
  const limit = 16;
  const fetchLimit = 100; // single batch for client-side local filtering

  // Server-side data fetching for initial render (SSR) - single batch for local filter
  let initialData = null;
  let error = null;

  try {
    initialData = await productApi.list({
      page: 1,
      limit: fetchLimit,
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
