import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/utils/client";
import { labelService } from "../services/Label.service";

export function useDeleteLabel() {
  const mutation = useMutation({
    mutationFn: (id: string) => {
      return labelService.deleteLabel({ labelId: id });
    },

    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Label deleted successfully");
    },

    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete label");
    },
  });

  return { deleteLabel: mutation.mutate };
}
