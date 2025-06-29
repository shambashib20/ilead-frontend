import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { leadService } from "../services/Lable.service";

export const currentLabelsQueryOptions = () =>
  queryOptions({
    queryKey: ["label"],
    queryFn: () => leadService.labels(),
  });

export function useGetCurrentLeads() {
  const { data, isLoading } = useSuspenseQuery(currentLabelsQueryOptions());
  return { lables: data.data, isLoading };
}
