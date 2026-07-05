import { useMemo, useState } from "react";

export interface UsePaginationResult<T> {
  page: number;
  pageCount: number;
  pageItems: T[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Client-side pagination over an already-loaded array. For endpoints that
 * return everything in one response (which is how this app's list routes
 * currently work) rather than paginating server-side.
 */
export function usePagination<T>(items: T[], pageSize = 20): UsePaginationResult<T> {
  const [page, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const clampedPage = Math.min(page, pageCount);

  const pageItems = useMemo(() => {
    const start = (clampedPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, clampedPage, pageSize]);

  return {
    page: clampedPage,
    pageCount,
    pageItems,
    goToPage: (p) => setPage(Math.min(Math.max(1, p), pageCount)),
    nextPage: () => setPage((p) => Math.min(p + 1, pageCount)),
    previousPage: () => setPage((p) => Math.max(p - 1, 1)),
    hasNext: clampedPage < pageCount,
    hasPrevious: clampedPage > 1,
  };
}
