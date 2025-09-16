import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/utils/client";
import { labelService } from "../services/Label.service";

// 🔹 Update Label Hook
export function useUpdateLabel() {
  const mutation = useMutation({
    mutationFn: ({
      id,
      title,
      description,
      color,
    }: {
      id: string;
      title?: string;
      description?: string;
      color?: string;
    }) => {
      console.log(title);
      return labelService.editLabel(id, { title, description, color });
    },

    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Label updated successfully");
    },

    onError: (error: any) => {
      toast.error(error?.message || "Failed to update label");
    },
  });

  return { updateLabel: mutation.mutate };
}
