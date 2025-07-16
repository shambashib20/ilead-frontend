import { useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import type { FilterPayload } from "@/features/leads/services/Leads.service";

interface SearchParams {
  labelIds?: string;
  assignedTo?: string;
  sourceNames?: string;
  createdByIds?: string;
  search?: string;
  sortBy?: string;
}

export function useLeadFilters() {
  const searchParams = useSearch({
    from: "/_dashboardLayout/lead",
  }) as SearchParams;

  const filters = useMemo(
    (): FilterPayload => ({
      labelIds: searchParams?.labelIds?.split(",") ?? [],
      assignedTo: searchParams?.assignedTo?.split(",") ?? [],
      sourceNames: searchParams?.sourceNames?.split(",") ?? [],
      createdByIds: searchParams?.createdByIds?.split(",") ?? [],
      search: searchParams?.search ?? "",
      sortBy: searchParams?.sortBy ?? "",
    }),
    [searchParams]
  );

  return filters;
}
