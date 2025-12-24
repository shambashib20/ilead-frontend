// useAssignLeadToChatAgent.ts - Fixed version
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leadsServoceModule } from "../services/LeadsModule.service";

type AssignPayload = { leadId: string; chatAgentId: string };

export function useAssignLeadToChatAgent() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ leadId, chatAgentId }: AssignPayload) =>
      leadsServoceModule.assignLeadTo({ leadId, chatAgentId }),

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async (variables) => {
      const { leadId, chatAgentId } = variables;

      // Cancel outgoing refetches to avoid overwriting optimistic update
      await qc.cancelQueries({ queryKey: ["leads"] });
      await qc.cancelQueries({ queryKey: ["leads:infinite"] });

      // Snapshot previous values for rollback
      const prevLeads = qc.getQueryData(["leads"]);
      const prevInfinite = qc.getQueryData(["leads:infinite"]);

      // Update table view - using setQueriesData to update ALL matching queries
      qc.setQueriesData({ queryKey: ["leads"] }, (old: any) => {
        if (!old?.data?.leads) return old;

        return {
          ...old,
          data: {
            ...old.data,
            leads: old.data.leads.map((lead: any) =>
              lead._id === leadId
                ? {
                    ...lead,
                    chatAgent: {
                      ...(lead.chatAgent || {}),
                      _id: chatAgentId,
                    },
                  }
                : lead
            ),
          },
        };
      });

      // Update board/infinite view - using setQueriesData to update ALL matching queries
      qc.setQueriesData({ queryKey: ["leads:infinite"] }, (old: any) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            leads:
              page.leads?.map((lead: any) =>
                lead._id === leadId
                  ? {
                      ...lead,
                      chatAgent: {
                        ...(lead.chatAgent || {}),
                        _id: chatAgentId,
                      },
                    }
                  : lead
              ) || [],
          })),
        };
      });

      return { prevLeads, prevInfinite };
    },

    // ✅ SUCCESS - Keep optimistic update, just invalidate for fresh data
    onSuccess: async (_data, variables) => {
      // Invalidate to get fresh data from server with refetchType
      await qc.invalidateQueries({
        queryKey: ["leads"],
        refetchType: "active",
      });

      await qc.invalidateQueries({
        queryKey: ["leads:infinite"],
        refetchType: "active",
      });

      // Also invalidate the specific lead detail if it exists
      await qc.invalidateQueries({
        queryKey: ["lead", variables.leadId],
        refetchType: "active",
      });
    },

    // 🧯 ROLLBACK on error
    onError: (err, _vars, ctx) => {
      console.error("Assign to agent failed", err);

      // Rollback to previous state
      if (ctx?.prevLeads) {
        qc.setQueryData(["leads"], ctx.prevLeads);
      }
      if (ctx?.prevInfinite) {
        qc.setQueryData(["leads:infinite"], ctx.prevInfinite);
      }

      // Force refetch to ensure we have correct server state
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["leads:infinite"] });
    },
  });

  return {
    assignToAgentAsync: mutation.mutateAsync,
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    status: mutation.status,
  } as const;
}
