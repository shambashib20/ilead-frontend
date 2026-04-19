import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { automationService } from "../services/automation.service";

export function useDeleteAutomation() {
  const qc = useQueryClient();

  return useMutation<any, unknown, string>({
    mutationFn: (id: string) => automationService.deleteAutomation(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["automations"] });
      toast.success("Automation deleted successfully!");
    },
    onError: (err: unknown) => {
      console.error("Delete automation failed:", err);
      toast.error("Failed to delete automation");
    },
  });
}
