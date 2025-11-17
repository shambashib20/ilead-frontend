// useUpdateProfileImage.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  userService,
  type ProfileImageResponse,
} from "../services/User.service";
import { toast } from "sonner";

export function useUpdateProfileImage() {
  const qc = useQueryClient();

  return useMutation<ProfileImageResponse, unknown, string>({
    mutationFn: (fileUrl: string) => userService.profileImgUpdate({ fileUrl }),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Profile picture updated successfully");
    },

    onError: (err) => {
      console.error("Profile image update failed:", err);
      toast.error("Failed to update profile picture");
    },
  });
}
