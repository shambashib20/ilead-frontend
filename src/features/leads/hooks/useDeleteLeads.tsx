import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leadsModuleService } from "../services/LeadModule.service";

export function useDeleteLead() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      rayId,
      deleteReason,
    }: {
      rayId: string;
      deleteReason: string;
    }) => leadsModuleService.deleteLeads({ rayId, deleteReason }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  return {
    deleteLead: mutation.mutate,
    isDeleting: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}
