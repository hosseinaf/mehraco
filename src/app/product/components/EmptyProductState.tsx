export function EmptyProductState() {
  return (
    <section
      className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
      aria-label="No products found"
    >
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-700">
        <svg
          className="h-10 w-10 text-neutral-400 dark:text-neutral-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
          />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        No products found
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
        Try adjusting your filters or search to find what you&apos;re looking for.
      </p>
    </section>
  );
}
