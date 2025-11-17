export const fetchUserProfile = async () => {
  const res = await userService.getUserDetails();
  return res.data.data; // just the actual user object
};

export const userProfileQueryOptions = () => ({
  queryKey: ["user-profile"],
  queryFn: fetchUserProfile,
});

import { useSuspenseQuery } from "@tanstack/react-query";
import { userService } from "../services/User.service";

export function useUserProfile() {
  const { data, isLoading, error } = useSuspenseQuery(
    userProfileQueryOptions()
  );

  return {
    user: data ?? null,
    isLoading,
    error,
  };
}
