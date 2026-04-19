import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  automationService,
  type UpdateAutomationPayload,
} from "../services/automation.service";

export function useUpdateAutomation() {
  const qc = useQueryClient();

  return useMutation<any, unknown, { id: string; payload: UpdateAutomationPayload }>({
    mutationFn: ({ id, payload }) => automationService.updateAutomation(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["automations"] });
      toast.success("Automation updated successfully!");
    },
    onError: (err: unknown) => {
      console.error("Update automation failed:", err);
      toast.error("Failed to update automation");
    },
  });
}
