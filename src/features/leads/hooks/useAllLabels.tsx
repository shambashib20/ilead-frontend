import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { labelService } from "../services/Lable.service";

export const allLabelsQueryOptions = () =>
  queryOptions({
    queryKey: ["AllLabel"],
    queryFn: () => labelService.labels(),
  });

export function useAllLabels() {
  const { data, isLoading } = useSuspenseQuery(allLabelsQueryOptions());
  return { allLables: data.data, allLablesLoading: isLoading };
}
