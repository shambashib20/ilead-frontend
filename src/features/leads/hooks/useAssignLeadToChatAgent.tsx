import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leadsServoceModule } from "../services/LeadsModule.service";

type AssignPayload = { leadId: string; chatAgentId: string };

export function useAssignLeadToChatAgent() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ leadId, chatAgentId }: AssignPayload) =>
      leadsServoceModule.assignLeadTo({ leadId, chatAgentId }),

    onSuccess: (_data, variables) => {
      // Invalidate leads list(s) so UI refreshes.
      // Narrow the invalidation if you have filter-specific keys.
      qc.invalidateQueries({ queryKey: ["leads"], exact: false });

      // Also invalidate single-lead detail if you use that key
      qc.invalidateQueries({ queryKey: ["lead", variables.leadId] });
    },

    onError: (err) => {
      // Optional: logging or toast. Do not swallow errors here if you want caller to handle.
      //console.error("Assign to agent failed", err);
    },
  });

  return {
    assignToAgentAsync: mutation.mutateAsync, // async/await friendly
    isPending: mutation.isPending, // v5 boolean for pending
    mutate: mutation.mutate, // optional callback style
    error: mutation.error,
    status: mutation.status,
  } as const;
}
