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
      chatAgentIds,
    }: {
      id: string;
      title?: string;
      description?: string;
      color?: string;
      chatAgentIds?: { id: string }[];
    }) => {
      //console.log(id);
      return labelService.editLabel(id, {
        title,
        description,
        color_code: color,
        chatAgentIds,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Label updated successfully");
    },

    onError: (error: any) => {
      toast.error(error?.message || "Failed to update label");
    },
  });

  return { updateLabel: mutation.mutateAsync, isPending: mutation.isPending };
}
