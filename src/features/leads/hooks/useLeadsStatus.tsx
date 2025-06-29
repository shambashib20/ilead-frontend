import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { statusService } from "../services/Status.service";

export const LeadsStatusQueryOptions = () =>
  queryOptions({
    queryKey: ["status"],
    queryFn: () => statusService.status(),
  });

export function useLeadsStatus() {
  const { data, isLoading } = useSuspenseQuery(LeadsStatusQueryOptions());
  return { status: data.data, isLoading };
}
