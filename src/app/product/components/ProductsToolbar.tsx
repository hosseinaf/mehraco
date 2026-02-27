"use client";
// basic toolbar used on product list; supports search, sorting and filters

import React from "react";

type ProductsToolbarProps = {
  total: number;
  /** How many products (in current filter set) are in stock. */
  inStockCount?: number;
  /** Total products in current filter set before applying in-stock filter. */
  totalBeforeStockFilter?: number;
  search?: string;
  onSearchChange?: (value: string) => void;
  /** Local suggestions shown when search is focused (e.g. product titles, categories, brands). */
  searchSuggestions?: string[];

  sort?: string;
  onSortChange?: (value: string) => void;

  category?: string;
  categories?: string[];
  onCategoryChange?: (value: string) => void;

  brand?: string;
  brands?: string[];
  onBrandChange?: (value: string) => void;

  price?: string;
  onPriceChange?: (value: string) => void;

  inStock?: boolean;
  onInStockChange?: (value: boolean) => void;

  /** When true, show the "Clear all filters" button. */
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
};

export function ProductsToolbar({
  total,
  inStockCount,
  totalBeforeStockFilter,
  search = "",
  onSearchChange,
  searchSuggestions = [],
  sort = "newest",
  onSortChange,
  category = "",
  categories = [],
  onCategoryChange,
  brand = "",
  brands = [],
  onBrandChange,
  price = "",
  onPriceChange,
  inStock = false,
  onInStockChange,
  hasActiveFilters = false,
  onClearFilters,
}: ProductsToolbarProps) {
  const [isSuggestionsOpen, setIsSuggestionsOpen] = React.useState(false);
  const searchContainerRef = React.useRef<HTMLDivElement>(null);

  const q = (search ?? "").trim().toLowerCase();
  const filteredSuggestions = React.useMemo(() => {
    const list = q
      ? searchSuggestions.filter((s) =>
          s.trim().toLowerCase().includes(q)
        )
      : searchSuggestions;
    return list.slice(0, 8);
  }, [searchSuggestions, q]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalLabel = new Intl.NumberFormat("en-US").format(total);
  const stockLabel =
    inStockCount != null && totalBeforeStockFilter != null
      ? inStock
        ? `Showing only in-stock (${totalLabel} products)`
        : `${new Intl.NumberFormat("en-US").format(inStockCount)} of ${new Intl.NumberFormat("en-US").format(totalBeforeStockFilter)} in stock`
      : null;

  return (
    <section className="p-4">
      {/* top row: count + clear filters + search */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-sm tracking-tight">{totalLabel} Products</span>
            {stockLabel != null && (
              <span className="text-xs text-neutral-500">{stockLabel}</span>
            )}
          </div>
          {hasActiveFilters && onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:ring-offset-2"
            >
              Clear all filters
            </button>
          )}
        </div>
        <div ref={searchContainerRef} className="relative w-full">
          <label className="relative block w-full bg-white">
            <span className="sr-only">Search products</span>

            {/* Search Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            <input
              type="search"
              placeholder="Search product"
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onFocus={() => setIsSuggestionsOpen(true)}
              onBlur={() => setIsSuggestionsOpen(false)}
              className="w-full rounded-full border border-neutral-200 bg-white pl-10 pr-4 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-300 focus:ring-4 focus:ring-neutral-200"
              autoComplete="off"
              aria-expanded={isSuggestionsOpen && filteredSuggestions.length > 0}
              aria-controls="search-suggestions-list"
              aria-autocomplete="list"
            />
          </label>

          {isSuggestionsOpen && filteredSuggestions.length > 0 && (
            <ul
              id="search-suggestions-list"
              role="listbox"
              className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-auto rounded-xl border border-neutral-200 bg-white py-1 shadow-lg"
            >
              {filteredSuggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  role="option"
                  className="cursor-pointer px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSearchChange?.(suggestion);
                    setIsSuggestionsOpen(false);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* filters section - responsive grid */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
        {/* sort */}
        <label className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 col-span-2 sm:col-auto">
          <span className="text-xs sm:text-sm text-neutral-600 hidden sm:inline">
            Sort by
          </span>
          <select
            value={sort}
            onChange={(e) => onSortChange?.(e.target.value)}
            className="w-full sm:w-auto h-9 rounded-full border border-neutral-200 bg-white px-3 text-sm text-neutral-900 shadow-sm outline-none transition hover:bg-neutral-50 focus:border-neutral-300 focus:ring-4 focus:ring-neutral-200"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to high</option>
            <option value="price-desc">Price: High to low</option>
            <option value="discount-desc">Biggest Discount</option>
          </select>
        </label>

        {/* category */}
        <label className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
          <span className="text-xs sm:text-sm text-neutral-600">Category</span>
          <select
            value={category}
            onChange={(e) => onCategoryChange?.(e.target.value)}
            className="w-full sm:w-auto h-9 rounded-full border border-neutral-200 bg-white px-3 text-sm text-neutral-900 shadow-sm outline-none transition hover:bg-neutral-50 focus:border-neutral-300 focus:ring-4 focus:ring-neutral-200"
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        {/* brands */}
        <label className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
          <span className="text-xs sm:text-sm text-neutral-600">Brands</span>
          <select
            value={brand}
            onChange={(e) => onBrandChange?.(e.target.value)}
            className="w-full sm:w-auto h-9 rounded-full border border-neutral-200 bg-white px-3 text-sm text-neutral-900 shadow-sm outline-none transition hover:bg-neutral-50 focus:border-neutral-300 focus:ring-4 focus:ring-neutral-200"
          >
            <option value="">All</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>

        {/* price */}
        <label className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
          <span className="text-xs sm:text-sm text-neutral-600">Price</span>
          <select
            value={price}
            onChange={(e) => onPriceChange?.(e.target.value)}
            className="w-full sm:w-auto h-9 rounded-full border border-neutral-200 bg-white px-3 text-sm text-neutral-900 shadow-sm outline-none transition hover:bg-neutral-50 focus:border-neutral-300 focus:ring-4 focus:ring-neutral-200"
          >
            <option value="">Any</option>
            <option value="0-50">$0 - $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100+">$100+</option>
          </select>
        </label>

        {/* in stock toggle - rightmost on sm+, beside Price on mobile */}
        <div className="flex items-center gap-2 ml-2 sm:ml-auto">
          <span className="text-xs sm:text-sm text-neutral-600">In stock only</span>
          <button
            type="button"
            role="switch"
            aria-checked={inStock}
            aria-label={inStock ? "Show only in-stock products" : "Show all products"}
            onClick={() => onInStockChange?.(!inStock)}
            className={`relative inline-block h-5 w-10 rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 ${
              inStock ? "bg-black" : "bg-neutral-200"
            }`}
          >
            <span
              className={`absolute left-0 top-0 h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
                inStock ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
