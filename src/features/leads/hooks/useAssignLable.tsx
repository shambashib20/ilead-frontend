// src/features/leads/hooks/useAssignLabels.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leadsServoceModule } from "../services/LeadsModule.service"; // keep your name or fix to leadsServiceModule

type AssignPayload = { leadId: string; labelIds: string[] };

export function useAssignLabels() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ leadId, labelIds }: AssignPayload) =>
      leadsServoceModule.assignLabelToLead({ leadId, labelIds }),

    onSuccess: () => {
      // Invalidate leads queries so lists/details refresh.
      // Be as narrow as possible in real app: invalidate the list/query keys that matter.
      qc.invalidateQueries({ queryKey: ["leads"], exact: false });
      // If you also have a detail query like ['lead', leadId], invalidate it too.
    },

    onError: (err) => {
      console.error("Assign labels failed", err);
    },
  });

  // Expose what you asked for:
  // - asyncAssignLabelsMutate: an async wrapper around mutateAsync for try/await usage
  // - isPending: v5-friendly boolean for mutation pending state
  // - raw mutate/mutateAsync if caller needs callbacks
  const asyncAssignLabelsMutate = async (payload: AssignPayload) => {
    return mutation.mutateAsync(payload);
  };

  return {
    asyncAssignLabelsMutate,
    isPending: mutation.isPending,
    // optional extras you may want:
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    status: mutation.status,
    error: mutation.error,
  } as const;
}
