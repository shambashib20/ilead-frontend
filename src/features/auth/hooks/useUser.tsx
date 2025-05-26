import { getData } from "@/utils/localStorage";
import { useSuspenseQuery } from "@tanstack/react-query";

export const userQueryOptions = {
  queryKey: ["user"],
  queryFn: () => {
    return getData("user"); // Directly return the parsed user or null
  },
  initialData: () => {
    return getData("user"); // Directly return the parsed user or null
  },
};

export function useUser() {
  return useSuspenseQuery(userQueryOptions);
}
