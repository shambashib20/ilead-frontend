import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { labelService } from "../services/Lable.service";

export const labelsQueryOptions = () =>
  queryOptions({
    queryKey: ["label"],
    queryFn: () => labelService.labels(),
  });

export function useLabels() {
  const { data, isLoading } = useSuspenseQuery(labelsQueryOptions());
  return { lables: data.data, isLoading };
}
