// hooks/useCreateAutomation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  automationService,
  type CreateAutomationPayload,
} from "../services/automation.service";

/**
 * Mutation returns the API response (whatever your service returns).
 * You said response data isn't required now so we keep the return type flexible.
 */
export function useCreateAutomation() {
  const qc = useQueryClient();

  const mutation = useMutation<any, unknown, CreateAutomationPayload>({
    mutationFn: (payload: CreateAutomationPayload) =>
      automationService.createAutomation(payload),
    onSuccess: (resp) => {
      // Invalidate relevant queries so UI refreshes
      qc.invalidateQueries(); // broad; change to specific keys if you have them, e.g. ["automations"]
      toast.success("Automation created successfully!");

      // Optional: if you want to optimistically append the new automation into a cached list:
      // const created = resp?.data;
      // if (created) {
      //   qc.setQueryData(["automations", { page: 1, limit: 10 }], (old: any) => {
      //     if (!old) return old;
      //     return { ...old, data: [created, ...old.data] };
      //   });
      // }
    },
    onError: (err: unknown) => {
      console.error("Create automation failed:", err);
      toast.error("Failed to create automation");
    },
  });

  return mutation;
}
