// useInfiniteLeads.ts - Improved version
import { useInfiniteQuery } from "@tanstack/react-query";
import { leadsService, type FilterPayload } from "../services/Leads.service";

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

  const query = useInfiniteQuery<
    LeadsResponse,
    Error,
    { pages: LeadsResponse[]; pageParams: number[] },
    [string, string, number],
    number
  >({
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
        startDate: (baseFilters.startDate as any) ?? undefined,
        endDate: (baseFilters.endDate as any) ?? undefined,
      };

      const raw = await leadsService.searchLeads(payload);
      const maybeData = raw && (raw as any).data ? (raw as any).data : raw;

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
      };

      return page;
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination;
      if (!pagination || !pagination.hasNextPage) return undefined;
      return pagination.page + 1;
    },
    initialPageParam: 1,
    staleTime: 0, // CHANGED: Set to 0 so data refetches immediately on invalidation
    gcTime: 5 * 60 * 1000, // Cache for 5 minutes (formerly cacheTime)
    refetchOnMount: true, // Refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

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
