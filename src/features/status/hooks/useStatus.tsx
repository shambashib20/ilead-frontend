import {
  queryOptions,
  // useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { statusService } from "../services/Status.service";

export const fetchStatus = async (page: number, limit: number) => {
  const data = await statusService.getPaginatedStatuses(page, limit);
  return data;
};

export const statusQueryOptions = (page: number = 1, limit: number = 10) =>
  queryOptions({
    queryKey: page === 1 && limit === 10 ? ["status"] : ["status", page, limit],
    queryFn: () => fetchStatus(page, limit),
  });

export function useStatus(page: number = 1, limit: number = 10) {
  const { data, isLoading } = useSuspenseQuery(statusQueryOptions(page, limit));
  return { status: data.data?.data, isLoading };
}
