// useLeads.ts - Fixed with proper refetch behavior
import { useQuery } from "@tanstack/react-query";
import {
  leadsService,
  type FilterPayload,
  type LeadsResponse,
} from "../services/Leads.service";

const DEFAULT_FILTERS: FilterPayload = {
  labelIds: [],
  assignedTo: [],
  sourceNames: [],
  assignedBy: [],
  search: "",
  sortBy: "",
  is_table_view: false,
  page: 1,
  limit: 10,
};

export function useLeads(filters: FilterPayload = DEFAULT_FILTERS) {
  const query = useQuery<LeadsResponse, Error>({
    queryKey: ["leads", { ...filters }],
    queryFn: () => leadsService.searchLeads(filters),

    // KEY CHANGES for proper refetch on invalidation:
    staleTime: 0, // Data is immediately stale, will refetch on invalidation
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes (formerly cacheTime)
    refetchOnMount: "always", // Always refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: true, // Refetch when internet reconnects
  });

  return {
    leads: query.data?.data.leads ?? [],
    statuses: query.data?.data.statuses ?? [],
    pagination: query.data?.data.pagination ?? {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}
