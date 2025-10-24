import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { dashboardLeads } from "../service/HomePage.service";

export const todaysLeadQueryOptions = () =>
  queryOptions({
    queryKey: ["todaysLead"],
    queryFn: () => dashboardLeads.getTodayLeads(),
  });

export function useTodaysLead() {
  const { data, isLoading } = useSuspenseQuery(todaysLeadQueryOptions());
  return {
    newLeads: data.data.data.leads_in_new,
    progressLeads: data.data.data.leads_in_processing,
    isLoading,
  };
}
