// hooks/useAllLeads.ts
import { useQuery } from "@tanstack/react-query";
import {
  leadsService,
  type FilterPayload,
  type LeadsResponse,
} from "../services/Leads.service";

const EMPTY_FILTERS: FilterPayload = {
  labelIds: [],
  assignedTo: [],
  sourceNames: [],
  createdByIds: [],
  search: "",
  sortBy: "",
};

export function useLeads() {
  const query = useQuery<LeadsResponse, Error>({
    queryKey: ["leads", "all"], // static key for bootstrap data
    queryFn: () => leadsService.searchLeads(EMPTY_FILTERS),
    staleTime: 5 * 60 * 1000, // cache 5 min
  });

  return {
    leads: query.data?.data.leads ?? [],
    statuses: query.data?.data.statuses ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
