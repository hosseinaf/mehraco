"use client";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  ProductGrid,
  type Product as GridProduct,
} from "@/app/product/components/ProductGrid";
import { Pagination } from "@/app/product/components/Pagination";
import { ProductsToolbar } from "@/app/product/components/ProductsToolbar";
import { ProductModal } from "@/app/product/components/ProductModal";
import { useGetProducts } from "@/queries/product";

const ProductClient: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [page, setPage] = React.useState(() => {
    const p = Number(searchParams?.get("page") ?? 1);
    return Number.isNaN(p) || p < 1 ? 1 : p;
  });

  React.useEffect(() => {
    const p = Number(searchParams?.get("page") ?? 1);
    const normalized = Number.isNaN(p) || p < 1 ? 1 : p;
    if (normalized !== page) setPage(normalized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.toString()]);
  const limit = 16;

  const [search, setSearch] = React.useState(
    () => searchParams?.get("q") ?? "",
  );
  const [debouncedQ, setDebouncedQ] = React.useState(
    () => searchParams?.get("q") ?? "",
  );
  const debounceRef = React.useRef<number | null>(null);

  // additional filters pulled from url
  const [sort, setSort] = React.useState(
    () => searchParams?.get("sort") ?? "newest",
  );
  const [category, setCategory] = React.useState(
    () => searchParams?.get("category") ?? "",
  );
  const [brand, setBrand] = React.useState(
    () => searchParams?.get("brand") ?? "",
  );
  const [price, setPrice] = React.useState(
    () => searchParams?.get("price") ?? "",
  );
  const [inStock, setInStock] = React.useState(() => {
    const v = searchParams?.get("inStock");
    return v === "true";
  });

  React.useEffect(() => {
    const q = searchParams?.get("q") ?? "";
    if (q !== search) setSearch(q);
    if (q !== debouncedQ) setDebouncedQ(q);

    const s = searchParams?.get("sort") ?? "newest";
    if (s !== sort) setSort(s);

    const cat = searchParams?.get("category") ?? "";
    if (cat !== category) setCategory(cat);

    const br = searchParams?.get("brand") ?? "";
    if (br !== brand) setBrand(br);

    const pr = searchParams?.get("price") ?? "";
    if (pr !== price) setPrice(pr);

    const stock = searchParams?.get("inStock");
    const stockBool = stock === "true";
    if (stockBool !== inStock) setInStock(stockBool);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.toString()]);

  const { data, isLoading, isFetching } = useGetProducts({
    page,
    limit,
    q: debouncedQ || undefined,
    // note: backend doesn't yet support the other filters, but we
    // add them to the key so react-query will refetch when they
    // change (even if the result is the same)
    sort,
    category,
    brand,
    price,
    inStock,
  });

  const products: GridProduct[] =
    data?.products.map((item) => {
      // compute old price from discount if available
      const priceNum = Number(item.price);
      const discountPct = Number(item.discountPercentage);
      let oldPrice: string | undefined;
      let discountLabel: string | undefined;
      if (discountPct && !Number.isNaN(priceNum)) {
        discountLabel = `${discountPct}%`;
        const orig = (priceNum * 100) / (100 - discountPct);
        oldPrice = `$ ${orig.toFixed(1)}`;
      }

      return {
        id: item.id,
        name: item.title,
        storage: "",
        color: "",
        camera: "",
        shipping: item.shippingInformation ?? "",
        price: `$ ${item.price}`,
        imageUrl: item.thumbnail,
        discount: discountLabel,
        oldPrice,
        // modal extras
        images: item.images,
        category: item.category ?? undefined,
        inStock: item.stock > 0,
        rating: Number(item.rating),
        reviewCount: item.reviews?.length ?? 0,
        description: item.description,
        warranty: item.warrantyInformation,
        returnPolicy: item.returnPolicy,
      };
    }) ?? [];

  const total = data?.total ?? 0;
  const totalPages = total ? Math.ceil(total / limit) : 1;

  const [selectedProduct, setSelectedProduct] =
    React.useState<GridProduct | null>(null);

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 text-neutral-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <ProductsToolbar
          total={total}
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            if (debounceRef.current) window.clearTimeout(debounceRef.current);
            // debounce updating query and url
            debounceRef.current = window.setTimeout(() => {
              setDebouncedQ(value);
              setPage(1);
              const params = new URLSearchParams(
                searchParams?.toString() ?? "",
              );
              if (value) params.set("q", value);
              else params.delete("q");
              // keep other filters
              params.set("sort", sort);
              if (category) params.set("category", category);
              else params.delete("category");
              if (brand) params.set("brand", brand);
              else params.delete("brand");
              if (price) params.set("price", price);
              else params.delete("price");
              if (inStock) params.set("inStock", "true");
              else params.delete("inStock");
              params.set("page", "1");
              router.push(`${pathname}?${params.toString()}`);
            }, 300);
          }}
          sort={sort}
          onSortChange={(value) => {
            setSort(value);
            setPage(1);
            const params = new URLSearchParams(searchParams?.toString() ?? "");
            params.set("sort", value);
            params.set("page", "1");
            router.push(`${pathname}?${params.toString()}`);
          }}
          category={category}
          categories={["Electronics", "Clothing", "Home"]}
          onCategoryChange={(value) => {
            setCategory(value);
            setPage(1);
            const params = new URLSearchParams(searchParams?.toString() ?? "");
            if (value) params.set("category", value);
            else params.delete("category");
            params.set("page", "1");
            router.push(`${pathname}?${params.toString()}`);
          }}
          brand={brand}
          brands={["Brand A", "Brand B", "Brand C"]}
          onBrandChange={(value) => {
            setBrand(value);
            setPage(1);
            const params = new URLSearchParams(searchParams?.toString() ?? "");
            if (value) params.set("brand", value);
            else params.delete("brand");
            params.set("page", "1");
            router.push(`${pathname}?${params.toString()}`);
          }}
          price={price}
          onPriceChange={(value) => {
            setPrice(value);
            setPage(1);
            const params = new URLSearchParams(searchParams?.toString() ?? "");
            if (value) params.set("price", value);
            else params.delete("price");
            params.set("page", "1");
            router.push(`${pathname}?${params.toString()}`);
          }}
          inStock={inStock}
          onInStockChange={(value) => {
            setInStock(value);
            setPage(1);
            const params = new URLSearchParams(searchParams?.toString() ?? "");
            if (value) params.set("inStock", "true");
            else params.delete("inStock");
            params.set("page", "1");
            router.push(`${pathname}?${params.toString()}`);
          }}
        />
        <ProductGrid
          products={products}
          loading={isLoading || isFetching}
          skeletonCount={limit}
          onItemClick={(p) => setSelectedProduct(p)}
        />
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => {
            setPage(p);
            const params = new URLSearchParams(searchParams?.toString() ?? "");
            params.set("page", String(p));
            // ensure filters are retained
            params.set("sort", sort);
            if (category) params.set("category", category);
            else params.delete("category");
            if (brand) params.set("brand", brand);
            else params.delete("brand");
            if (price) params.set("price", price);
            else params.delete("price");
            if (inStock) params.set("inStock", "true");
            else params.delete("inStock");
            router.push(`${pathname}?${params.toString()}`);
          }}
        />
      </div>
    </main>
  );
};

export default ProductClient;
