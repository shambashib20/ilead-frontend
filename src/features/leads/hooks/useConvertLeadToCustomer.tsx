import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerService } from "../services/Customer.service";

type ConvertPayload = { leadId: string };

export function useConvertLeadToCustomer() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ leadId }: ConvertPayload) =>
      customerService.convertToCustomer({ leadId }),

    onSuccess: (_data, variables) => {
      // Invalidate leads list queries so UI updates
      qc.invalidateQueries({ queryKey: ["leads"], exact: false });

      // Invalidate single-lead detail cache if exists
      qc.invalidateQueries({ queryKey: ["lead", variables.leadId] });

      // Optionally invalidate other related caches (customers list, vendor stats...)
      // qc.invalidateQueries({ queryKey: ["customers"], exact: false });
    },

    onError: (err) => {
      // keep minimal logging here; UI handles toasts/alerts
      console.error("convertToCustomer failed", err);
    },
  });

  return {
    convertAsync: mutation.mutateAsync, // async/await friendly
    isPending: mutation.isPending,
    mutate: mutation.mutate, // callback style if needed
    error: mutation.error,
    status: mutation.status,
  } as const;
}
