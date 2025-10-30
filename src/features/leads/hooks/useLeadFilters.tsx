import { useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import type { FilterPayload } from "@/features/leads/services/Leads.service";

interface SearchParams {
  labelIds?: string;
  assignedTo?: string;
  sourceNames?: string;
  assignedBy?: string;
  search?: string;
  sortBy?: string;
  startDate?: Date;
  endDate?: Date;
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
      assignedBy: searchParams?.assignedBy?.split(",") ?? [],
      search: searchParams?.search ?? "",
      sortBy: searchParams?.sortBy ?? "",
      startDate: searchParams?.startDate ?? "",
      endDate: searchParams?.endDate ?? "",
    }),
    [searchParams]
  );

  return filters;
}
