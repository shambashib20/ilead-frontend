import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { statusService } from "../services/Status.service";

export const StatusQueryOptions = () =>
  queryOptions({
    queryKey: ["status"],
    queryFn: () => statusService.status(),
  });

export function useStatus() {
  const { data, isLoading } = useSuspenseQuery(StatusQueryOptions());
  return { status: data.data, isLoading };
}
