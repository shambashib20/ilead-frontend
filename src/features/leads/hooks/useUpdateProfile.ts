import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  userService,
  type UpdateProfilePayload,
} from "../services/User.service";
import { toast } from "sonner";

export function useUpdateProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      userService.updateProfile(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Profile updated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update profile");
    },
  });
}
