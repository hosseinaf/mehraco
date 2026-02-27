"use client";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  ProductGrid,
  type Product as GridProduct,
} from "@/app/product/components/ProductGrid";
import { EmptyProductState } from "@/app/product/components/EmptyProductState";
import { Pagination } from "@/app/product/components/Pagination";
import { ProductsToolbar } from "@/app/product/components/ProductsToolbar";
import { ProductModal } from "@/app/product/components/ProductModal";
import {
  filterAndSortProducts,
  isInStock,
} from "@/app/product/utils/filterProducts";
import { useGetProducts } from "@/queries/product";
import { GetProductsResponse } from "@/queries/product/type";

interface ProductClientProps {
  initialData?: GetProductsResponse | null;
  initialError?: string | null;
}

const ProductClient: React.FC<ProductClientProps> = ({
  initialData,
  initialError,
}) => {
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
    setPage((prev) => (prev !== normalized ? normalized : prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.toString()]);
  const limit = 16;

  const [search, setSearch] = React.useState(
    () => searchParams?.get("q") ?? "",
  );

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

  // Fetch once (large batch) for local filtering — no refetch on filter change
  const fetchLimit = 100;
  const { data, isLoading, isFetching } = useGetProducts({
    page: 1,
    limit: fetchLimit,
    options: {
      initialData,
    },
  });

  const rawProducts = data?.products ?? [];
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    rawProducts.forEach((p) => {
      if (p.category?.trim()) set.add(p.category.trim());
    });
    return Array.from(set).sort();
  }, [rawProducts]);
  const brands = React.useMemo(() => {
    const set = new Set<string>();
    rawProducts.forEach((p) => {
      if (p.brand?.trim()) set.add(p.brand.trim());
    });
    return Array.from(set).sort();
  }, [rawProducts]);

  const searchSuggestions = React.useMemo(() => {
    const titles = rawProducts
      .map((p) => p.title?.trim())
      .filter(Boolean) as string[];
    return [...new Set([...titles, ...categories, ...brands])];
  }, [rawProducts, categories, brands]);

  const filteredBeforeStock = React.useMemo(
    () =>
      filterAndSortProducts(rawProducts, {
        q: search.trim() || undefined,
        sort,
        category: category || undefined,
        brand: brand || undefined,
        price: price || undefined,
        inStock: false,
      }),
    [rawProducts, search, sort, category, brand, price]
  );

  const inStockCount = React.useMemo(
    () => filteredBeforeStock.filter(isInStock).length,
    [filteredBeforeStock]
  );

  const filtered = React.useMemo(
    () =>
      filterAndSortProducts(rawProducts, {
        q: search.trim() || undefined,
        sort,
        category: category || undefined,
        brand: brand || undefined,
        price: price || undefined,
        inStock: inStock || undefined,
      }),
    [rawProducts, search, sort, category, brand, price, inStock]
  );

  const totalFiltered = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / limit));
  const normalizedPage = Math.min(page, totalPages);

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const paginated = React.useMemo(
    () => filtered.slice((normalizedPage - 1) * limit, normalizedPage * limit),
    [filtered, normalizedPage, limit]
  );

  const products: GridProduct[] = paginated.map((item) => {
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
        inStock: isInStock(item),
        rating: Number(item.rating),
        reviewCount: item.reviews?.length ?? 0,
        description: item.description,
        warranty: item.warrantyInformation,
        returnPolicy: item.returnPolicy,
      };
    }) ?? [];

  const total = totalFiltered;

  const [selectedProduct, setSelectedProduct] =
    React.useState<GridProduct | null>(null);

  const [showScrollTop, setShowScrollTop] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <ProductsToolbar
          total={total}
          inStockCount={inStockCount}
          totalBeforeStockFilter={filteredBeforeStock.length}
          search={search}
          searchSuggestions={searchSuggestions}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
            const params = new URLSearchParams(
              searchParams?.toString() ?? "",
            );
            if (value) params.set("q", value);
            else params.delete("q");
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
          categories={categories}
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
          brands={brands}
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
          hasActiveFilters={
            search !== "" ||
            sort !== "newest" ||
            category !== "" ||
            brand !== "" ||
            price !== "" ||
            inStock
          }
          onClearFilters={() => {
            setSearch("");
            setSort("newest");
            setCategory("");
            setBrand("");
            setPrice("");
            setInStock(false);
            setPage(1);
            router.push(pathname);
          }}
        />
        {isLoading || isFetching ? (
          <ProductGrid
            products={[]}
            loading
            skeletonCount={limit}
            onItemClick={(p) => setSelectedProduct(p)}
          />
        ) : totalFiltered === 0 ? (
          <EmptyProductState />
        ) : (
          <ProductGrid
            products={products}
            loading={false}
            skeletonCount={limit}
            onItemClick={(p) => setSelectedProduct(p)}
          />
        )}
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
        {totalFiltered > 0 && totalPages > 1 && (
          <Pagination
            currentPage={normalizedPage}
            totalPages={totalPages}
            onPageChange={(p) => {
              setPage(Math.min(p, totalPages));
              const params = new URLSearchParams(searchParams?.toString() ?? "");
              params.set("page", String(p));
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
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-neutral-900 text-white p-4 rounded-full shadow-lg hover:bg-neutral-800 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:ring-offset-2 z-40 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 dark:focus:ring-neutral-400 dark:focus:ring-offset-neutral-900"
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </main>
  );
};

export default ProductClient;
