import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { leadsServoceModule } from "../services/LeadsModule.service";

export const exportLeadsQueryOption = () =>
  queryOptions({
    queryKey: ["exportLeads"],
    queryFn: () => leadsServoceModule.exportLeads(),
  });

export function useExportLeads() {
  const { data, isLoading } = useSuspenseQuery(exportLeadsQueryOption());
  return { exportLead: data.data, isLoading };
}
