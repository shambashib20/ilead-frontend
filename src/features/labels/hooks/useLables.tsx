import {
  queryOptions,
  // useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { labelService } from "../services/Label.service";

export const fetchLabels = async (page: number, limit: number) => {
  const data = await labelService.getPaginatedLables(page, limit);
  return data;
};

export const labelsQueryOptions = (page: number = 1, limit: number = 10) =>
  queryOptions({
    queryKey: page === 1 && limit === 10 ? ["labels"] : ["labels", page, limit],
    queryFn: () => fetchLabels(page, limit),
  });

export function useLabels(page: number = 1, limit: number = 10) {
  const { data, isLoading } = useSuspenseQuery(labelsQueryOptions(page, limit));
  return { labels: data.data?.data, isLoading };
}
