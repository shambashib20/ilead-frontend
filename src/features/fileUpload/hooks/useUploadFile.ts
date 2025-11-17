import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fileUploadService } from "../service/fileupload.service";
import { toast } from "sonner";

export function useUploadFile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => fileUploadService.uploadFile(file),
    onSuccess: (_data) => {
      toast.success("Profile photo updated successfully!");

      // Refresh anything that depends on user profile image
      qc.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (err) => {
      console.error("❌ File upload failed:", err);
      toast.error("Failed to upload file. Try again.");
    },
  });
}
