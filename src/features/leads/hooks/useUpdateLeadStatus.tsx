// useUpdateLeadStatus.ts - Complete fix for invalidation
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leadsServoceModule } from "../services/LeadsModule.service";

type UpdatePayload = { leadId: string; statusId: string };

export function useUpdateLeadStatus() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ leadId, statusId }: UpdatePayload) =>
      leadsServoceModule.updateLeadStatus({ leadId, statusId }),

    onSuccess: async (_data, variables) => {
      // Invalidate infinite leads queries (for board view)
      await qc.invalidateQueries({
        queryKey: ["leads:infinite"],
        refetchType: "active",
      });

      // Invalidate regular leads queries (for table view)
      await qc.invalidateQueries({
        queryKey: ["leads"],
        refetchType: "active",
      });

      // Optional: Optimistic update for instant UI feedback
      // This updates the cache immediately before refetch completes
      qc.setQueriesData({ queryKey: ["leads:infinite"] }, (oldData: any) => {
        if (!oldData?.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            leads:
              page.leads?.map((lead: any) =>
                lead._id === variables.leadId
                  ? {
                      ...lead,
                      status: {
                        ...lead.status,
                        _id: variables.statusId,
                      },
                    }
                  : lead
              ) || [],
          })),
        };
      });

      // Optimistic update for regular leads query
      qc.setQueriesData({ queryKey: ["leads"] }, (oldData: any) => {
        if (!oldData?.data?.leads) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            leads: oldData.data.leads.map((lead: any) =>
              lead._id === variables.leadId
                ? {
                    ...lead,
                    status: {
                      ...lead.status,
                      _id: variables.statusId,
                    },
                  }
                : lead
            ),
          },
        };
      });
    },

    onError: (err) => {
      console.error("updateLeadStatus failed", err);

      // Rollback optimistic updates on error
      qc.invalidateQueries({ queryKey: ["leads:infinite"] });
      qc.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  return {
    updateStatusAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    status: mutation.status,
  } as const;
}
