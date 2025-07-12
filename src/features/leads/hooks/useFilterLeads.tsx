// hooks/useFilteredLeads.ts
import { useMutation } from "@tanstack/react-query";
import {
  leadsService,
  type FilterPayload,
  type LeadsResponse,
} from "../services/Leads.service";

export function useFilteredLeads() {
  return useMutation<LeadsResponse, Error, FilterPayload>({
    mutationFn: (filters) => leadsService.searchLeads(filters),
    onMutate: () => {
      console.log("🚀 Filtering leads…");
    },
    onSuccess: (response) => {
      console.log("✅ Got filtered leads:", response.data.leads.length);
    },
    onError: (err) => {
      console.error("❌ Filter failed:", err.message);
    },
  });
}
