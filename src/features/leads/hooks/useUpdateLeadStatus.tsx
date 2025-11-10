import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leadsServoceModule } from "../services/LeadsModule.service";

type UpdatePayload = { leadId: string; statusId: string };

export function useUpdateLeadStatus() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ leadId, statusId }: UpdatePayload) =>
      leadsServoceModule.updateLeadStatus({ leadId, statusId }),

    onSuccess: (_data, variables) => {
      // Invalidate all leads lists
      qc.invalidateQueries({ queryKey: ["leads"], exact: false });
      // Invalidate specific lead detail if exists
      qc.invalidateQueries({ queryKey: ["lead", variables.leadId] });
    },

    onError: (err) => {
      //console.error("updateLeadStatus failed", err);
    },
  });

  return {
    updateStatusAsync: mutation.mutateAsync, // async/await friendly
    isPending: mutation.isPending,
    error: mutation.error,
    status: mutation.status,
  } as const;
}
