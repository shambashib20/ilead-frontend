// useInfiniteLeads.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  leadsService,
  type FilterPayload,
  type LeadsResponse, // assume LeadsResponse = { leads: Lead[], pagination: { ... }, statuses: any[] }
} from "../services/Leads.service";

type PartialFilters = Partial<
  Omit<FilterPayload, "page" | "limit"> & { limit?: number }
>;

const DEFAULT_PAGE_LIMIT = 10;

export function useInfiniteLeads(baseFilters: PartialFilters = {}) {
  const effectiveLimit = baseFilters.limit ?? DEFAULT_PAGE_LIMIT;

  // stable key for filters (exclude page)
  const filtersKey = JSON.stringify({
    ...baseFilters,
    // normalize Date to string if present
    startDate: baseFilters.startDate
      ? String(baseFilters.startDate)
      : undefined,
    endDate: baseFilters.endDate ? String(baseFilters.endDate) : undefined,
  });

  const query = useInfiniteQuery<LeadsResponse, Error>({
    queryKey: ["leads:infinite", filtersKey, effectiveLimit],
    queryFn: async ({ pageParam = 1 }) => {
      const payload: FilterPayload = {
        labelIds: (baseFilters.labelIds as string[]) ?? [],
        assignedTo: (baseFilters.assignedTo as string[]) ?? [],
        sourceNames: (baseFilters.sourceNames as string[]) ?? [],
        assignedBy: (baseFilters.assignedBy as string[]) ?? [],
        search: (baseFilters.search as string) ?? "",
        sortBy: (baseFilters.sortBy as string) ?? "",
        is_table_view: (baseFilters.is_table_view as boolean) ?? false,
        page: pageParam,
        limit: effectiveLimit,
        // NOTE: your LeadsService uses snake_case start_date / end_date in earlier code.
        // If your service expects start_date / end_date keys, rename here accordingly.
        start_date: (baseFilters.startDate as any) ?? undefined,
        end_date: (baseFilters.endDate as any) ?? undefined,
      };

      // call the service
      const raw = await leadsService.searchLeads(payload);

      // raw might be:
      // 1) already { leads, pagination, statuses }
      // 2) { data: { leads, pagination, statuses } }
      // Normalize to `page` that always is { leads, pagination, statuses }
      const page =
        raw &&
        (raw as any).data &&
        (Array.isArray((raw as any).data.leads) || (raw as any).data.leads)
          ? (raw as any).data
          : Array.isArray((raw as any).leads)
            ? (raw as any)
            : {
                leads: [],
                pagination: {
                  page: pageParam,
                  limit: effectiveLimit,
                  total: 0,
                  totalPages: 0,
                  hasNextPage: false,
                  hasPrevPage: false,
                },
                statuses: [],
              };

      return page as LeadsResponse;
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.pagination;
      if (!pagination) return undefined;
      const { page, totalPages } = pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });
  console.log(query.data);

  return {
    data: query.data,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
