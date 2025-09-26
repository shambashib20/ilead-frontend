import {
  queryOptions,
  useIsFetching,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  leadsServoceModule,
  type ArchivedLeadResponse,
} from "../services/LeadsModule.service";
import { useCallback, useEffect, useState } from "react";
import { queryClient } from "@/utils/client";

export const archivedLeadsQueryptions = (
  page: number = 1,
  limit: number = 10
) =>
  queryOptions({
    queryKey:
      page === 1 && limit === 10
        ? ["archived-leads"]
        : ["archived-leads", page, limit],
    queryFn: async () => {
      // NOTE: using your module name and method name as-is
      const res = await leadsServoceModule.achivedLeads({ page, limit });
      // backend returns: { message, status, data: { leads, pagination } }
      const body: ArchivedLeadResponse = res.data ?? res;
      return body;
    },
    retry: 1,
  });

export function useArchivedLeads(initialPage = 1, initialLimit = 10) {
  const [page, setPage] = useState<number>(initialPage);
  const [limit, setLimit] = useState<number>(initialLimit);

  const { data, isLoading } = useSuspenseQuery(
    archivedLeadsQueryptions(page, limit)
  );

  // react-query hook to check if fetch for this key is running
  const isFetchingCount = useIsFetching({
    queryKey:
      page === 1 && limit === 10
        ? ["archived-leads"]
        : ["archived-leads", page, limit],
  });
  const isFetching = isFetchingCount > 0;

  // normalize values (since useSuspenseQuery returns whole response)
  const response: ArchivedLeadResponse | undefined = data;
  const archivedLeads = response?.data?.leads ?? [];
  const pagination = response?.data?.pagination ?? {
    totalItems: 0,
    totalPages: 0,
    currentPage: page,
    limit,
    hasNextPage: false,
    hasPrevPage: page > 1,
  };

  // if backend reduces totalPages and current page becomes out-of-range => correct it
  useEffect(() => {
    const totalPages = pagination?.totalPages ?? 0;
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [pagination?.totalPages, page]);

  const nextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      setPage((p) => p + 1);
    }
  }, [pagination.hasNextPage]);

  const prevPage = useCallback(() => {
    if (page > 1) setPage((p) => p - 1);
  }, [page]);

  const goToPage = useCallback(
    (p: number) => {
      if (!Number.isFinite(p) || p < 1) p = 1;
      const total = pagination.totalPages || Infinity;
      if (p > total) p = total;
      setPage(p);
    },
    [pagination.totalPages]
  );

  const prefetchNext = useCallback(async () => {
    const next = page + 1;
    // prefetch direct using queryClient
    await queryClient.prefetchQuery({
      queryKey:
        next === 1 && limit === 10
          ? ["archived-leads"]
          : ["archived-leads", next, limit],
      queryFn: () =>
        leadsServoceModule
          .achivedLeads({ page: next, limit })
          .then((res: any) => res.data ?? res),
    });
  }, [page, limit]);

  const refetch = useCallback(() => {
    // simple refetch: invalidate key for archived-leads so suspense boundary will re-run
    return queryClient.invalidateQueries({
      queryKey: ["archived-leads"],
      exact: false,
    });
  }, []);

  return {
    archivedLeads,
    pagination,
    page,
    limit,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    goToPage,
    prefetchNext,
    refetch,
    // loading states
    isLoading,
    isFetching,
  } as const;
}
