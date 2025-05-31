import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getCurrentLeads } from "../__mock_api__/getCurrentLeads";

export const currentLeadsQueryOptions = () =>
  queryOptions({
    queryKey: ["current-lead"],
    queryFn: () => getCurrentLeads(),
  });

export function useGetCurrentLeads() {
  const { data } = useSuspenseQuery(currentLeadsQueryOptions());
  return { data };
}
