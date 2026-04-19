import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { templateService } from "../service/template.service";

export function useDeleteTemplate() {
  const qc = useQueryClient();

  return useMutation<any, unknown, string>({
    mutationFn: (id: string) => templateService.deleteTemplate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Template deleted successfully!");
    },
    onError: (err: unknown) => {
      console.error("Delete template failed:", err);
      toast.error("Failed to delete template");
    },
  });
}
