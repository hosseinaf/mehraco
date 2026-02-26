import React from "react";
import ProductClient from "./ProductClient";

// This page is a server component. we render the client-side
// <ProductClient> inside a Suspense boundary so that any
// `useSearchParams` calls it makes can suspend during the
// server-rendering phase.

export default function Page() {
  return (
    <React.Suspense fallback={<div>Loading products...</div>}>
      <ProductClient />
    </React.Suspense>
  );
}
