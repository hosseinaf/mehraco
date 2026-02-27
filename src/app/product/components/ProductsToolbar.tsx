// basic toolbar used on product list; supports search, sorting and filters

type ProductsToolbarProps = {
  total: number;
  search?: string;
  onSearchChange?: (value: string) => void;

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
};

export function ProductsToolbar({
  total,
  search = "",
  onSearchChange,
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
}: ProductsToolbarProps) {
  const totalLabel = new Intl.NumberFormat("en-US").format(total);

  return (
    <section className="p-4">
      {/* top row: count + search */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center">
          <span className="text-sm tracking-tight">{totalLabel} Products</span>
        </div>
        <label className="relative w-full bg-white">
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
            className="w-full rounded-full border border-neutral-200 bg-white pl-10 pr-4 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-300 focus:ring-4 focus:ring-neutral-200"
          />
        </label>
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

        {/* in stock toggle */}
        <label className="flex items-center gap-2 col-span-1 sm:col-auto sm:ml-auto mt-2 sm:mt-0">
          <span className="text-xs sm:text-sm text-neutral-600">In stock</span>
          <div
            className={`relative inline-block h-5 w-10 rounded-full transition-colors duration-200 ${
              inStock ? "bg-black" : "bg-neutral-200"
            }`}
          >
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => onInStockChange?.(e.target.checked)}
              className="peer sr-only"
            />
            <span
              className={`absolute left-0 top-0 h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
                inStock ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </label>
      </div>
    </section>
  );
}
