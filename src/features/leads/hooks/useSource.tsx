import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { sourceService } from "../services/Source.service";

export const sourceQueryOptions = () =>
  queryOptions({
    queryKey: ["source"],
    queryFn: () => sourceService.sources(),
  });

export function useSource() {
  const { data, isLoading } = useSuspenseQuery(sourceQueryOptions());
  return { sources: data.data.data.sources, isLoading };
}
