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
  createdByIds: [],
  search: "",
  sortBy: "",
};

export function useLeads(filters: FilterPayload = DEFAULT_FILTERS) {
  console.log(filters);

  const query = useQuery<LeadsResponse, Error>({
    queryKey: ["leads", { ...filters }],
    queryFn: () => leadsService.searchLeads(filters),
    staleTime: 5 * 60 * 1000,
  });

  return {
    leads: query.data?.data.leads ?? [],
    statuses: query.data?.data.statuses ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
