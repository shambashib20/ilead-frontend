import { getData } from "@/utils/localStorage";
import { useSuspenseQuery } from "@tanstack/react-query";

export const userQueryOptions = {
  queryKey: ["user"],
  queryFn: () => {
    return getData("user");
  },
  initialData: () => {
    return getData("user");
  },
};

export function useUser() {
  return useSuspenseQuery(userQueryOptions);
}
