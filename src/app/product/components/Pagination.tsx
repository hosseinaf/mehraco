type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  // build a limited list of page labels with ellipses
  const getPageLabels = () => {
    const delta = 1; // number of pages to show around current
    const range: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }
    const pages: (number | string)[] = [];
    let last: number | null = null;
    for (const p of range) {
      if (typeof p === "number") {
        if (last !== null && p - last > 1) {
          pages.push("...");
        }
        pages.push(p);
        last = p;
      }
    }
    return pages;
  };

  const labels = getPageLabels();

  return (
    <footer className="flex items-center justify-center gap-1">
      <button
        type="button"
        disabled={!canPrev}
        onClick={() => canPrev && onPageChange?.(currentPage - 1)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-sm text-neutral-500 hover:bg-neutral-200/80 disabled:cursor-not-allowed disabled:text-neutral-300 disabled:hover:bg-transparent dark:text-neutral-400 dark:hover:bg-neutral-700 dark:disabled:text-neutral-600 dark:disabled:hover:bg-transparent"
      >
        ‹
      </button>
      {labels.map((label, idx) =>
        typeof label === "number" ? (
          <button
            key={label}
            type="button"
            onClick={() => onPageChange?.(label)}
            className={`flex items-center justify-center text-sm font-medium transition-transform ${
              label === currentPage
                ? "h-6 w-6 bg-neutral-900 text-white rounded scale-110 dark:bg-neutral-100 dark:text-neutral-900"
                : "h-10 w-10 text-neutral-600 hover:bg-neutral-200/80 hover:rounded-full dark:text-neutral-400 dark:hover:bg-neutral-700"
            }`}
          >
            {label}
          </button>
        ) : (
          <span
            key={`${label}-${idx}`}
            className="flex h-10 w-10 items-center justify-center text-sm text-neutral-500 dark:text-neutral-400"
          >
            {label}
          </span>
        ),
      )}
      <button
        type="button"
        disabled={!canNext}
        onClick={() => canNext && onPageChange?.(currentPage + 1)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-sm text-neutral-500 hover:bg-neutral-200/80 disabled:cursor-not-allowed disabled:text-neutral-300 disabled:hover:bg-transparent dark:text-neutral-400 dark:hover:bg-neutral-700 dark:disabled:text-neutral-600 dark:disabled:hover:bg-transparent"
      >
        ›
      </button>
    </footer>
  );
}
