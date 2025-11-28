// useInfiniteLeads.ts
import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { leadsService, type FilterPayload } from "../services/Leads.service";

// types.ts (create this or put in your existing types file)
export interface Lead {
  _id: string;
  name?: string;
  phone_number?: string;
  email?: string;
  address?: string;
  company_name?: string;
  created_at?: string;
  createdAt?: string;
  labels?: Array<{ _id?: string; title?: string; meta?: any }>;
  assigned_to?: any;
  assigned_by?: any;
  status?: { _id?: string; title?: string };
  meta?: any;
  [k: string]: any;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  [k: string]: any;
}

export interface LeadsResponse {
  pages: any;
  leads: Lead[];
  pagination: Pagination;
  statuses: any[];
}

type PartialFilters = Partial<
  Omit<FilterPayload, "page" | "limit"> & { limit?: number }
>;

const DEFAULT_PAGE_LIMIT = 10;

export function useInfiniteLeads(baseFilters: PartialFilters = {}) {
  const effectiveLimit = baseFilters.limit ?? DEFAULT_PAGE_LIMIT;

  const filtersKey = JSON.stringify({
    ...baseFilters,
    startDate: baseFilters.startDate
      ? String(baseFilters.startDate)
      : undefined,
    endDate: baseFilters.endDate ? String(baseFilters.endDate) : undefined,
  });

  // NOTE generics: <TQueryFnData, TError, TQueryData, TQueryKey>
  // We set both TQueryFnData and TQueryData to LeadsResponse so React Query
  // knows each page has shape LeadsResponse
  const query = useInfiniteQuery<
    LeadsResponse,
    Error,
    LeadsResponse,
    [string, string, number]
  >({
    queryKey: ["leads:infinite", filtersKey, effectiveLimit],
    queryFn: async (context) => {
      const pageParam = (context.pageParam as number | undefined) ?? 1;
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
        startDate: (baseFilters.startDate as any) ?? undefined,
        endDate: (baseFilters.endDate as any) ?? undefined,
      };

      const raw = await leadsService.searchLeads(payload);

      // normalize: prefer raw.data if present, else raw
      const maybeData = raw && (raw as any).data ? (raw as any).data : raw;

      // final robust fallback
      const page: LeadsResponse = {
        leads: Array.isArray((maybeData as any)?.leads)
          ? (maybeData as any).leads
          : [],
        pagination: (maybeData as any)?.pagination ?? {
          page: pageParam,
          limit: effectiveLimit,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
        statuses: Array.isArray((maybeData as any)?.statuses)
          ? (maybeData as any).statuses
          : [],
        pages: undefined,
      };

      return page;
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination;
      if (!pagination) return undefined;
      return pagination.page < pagination.totalPages
        ? pagination.page + 1
        : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  return {
    // IMPORTANT: keep full react-query response object shape
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
