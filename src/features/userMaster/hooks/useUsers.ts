import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { userService, type Workspace } from "../services/User.service";

/* ---------- fetcher ---------- */

export const fetchUsers = async (page: number, limit: number) => {
  const res = await userService.getAllUsersWithRoles(page, limit);
  return res;
};

/* ---------- query options ---------- */

export const usersQueryOptions = (page: number = 1, limit: number = 12) =>
  queryOptions({
    queryKey:
      page === 1 && limit === 12
        ? ["usersmaster"]
        : ["usersmaster", page, limit],
    queryFn: () => fetchUsers(page, limit),
  });

/* ---------- hook ---------- */

export function useUsers(page: number = 1, limit: number = 12) {
  const { data, isLoading } = useSuspenseQuery(usersQueryOptions(page, limit));

  console.log("Hook data:", data.data.data);

  return {
    workspaces: data.data.data.workspaces as Workspace[],
    pagination: data.data.data.pagination,
    isLoading,
  };
}
