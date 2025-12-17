import { getData } from "@/utils/localStorage";
import { useSuspenseQuery } from "@tanstack/react-query";

export const adminQueryOptions = {
  queryKey: ["admin"],
  queryFn: () => {
    return getData("admin");
  },
  initialData: () => {
    return getData("admin");
  },
};

export function useAdmin() {
  return useSuspenseQuery(adminQueryOptions);
}
