import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type {
  Property,
  WorkspaceMasterListPayload,
} from "../services/workspaceMaster.service";
import { workspaceMasterService } from "../services/workspaceMaster.service";

/* ---------- fetcher ---------- */

export const fetchWorkspaces = async (payload: WorkspaceMasterListPayload) => {
  const res = await workspaceMasterService.getAllWorkspaces(payload);
  return res;
};

/* ---------- query options ---------- */

export const workspacesQueryOptions = (page: number = 1, limit: number = 10) =>
  queryOptions({
    queryKey:
      page === 1 && limit === 10 ? ["workspaces"] : ["workspaces", page, limit],
    queryFn: () => fetchWorkspaces({ page, limit }),
  });

/* ---------- hook ---------- */

export function useWorkspaces(page: number = 1, limit: number = 10) {
  const { data, isLoading } = useSuspenseQuery(
    workspacesQueryOptions(page, limit)
  );

  console.log("Hook data:", data);

  return {
    properties: data.data.data.properties as Property[],
    pagination: data.data.data.pagination,
    isLoading,
  };
}
