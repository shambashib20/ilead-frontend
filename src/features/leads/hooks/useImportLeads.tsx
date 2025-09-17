import { useMutation } from "@tanstack/react-query";
import { leadsServoceModule } from "../services/LeadsModule.service";
import { toast } from "sonner";
import { queryClient } from "@/utils/client";

interface ImportLeadPayload {
  file: File | null;
  status_id: string;
  source_id: string;
  assigned_to: string;
  label_ids: string;
}

export function useImportLeads() {
  const mutation = useMutation({
    mutationFn: ({
      file,
      status_id,
      source_id,
      assigned_to,
      label_ids,
    }: ImportLeadPayload) => {
      return leadsServoceModule.importLead({
        file,
        status_id,
        source_id,
        assigned_to,
        label_ids,
      });
    },

    onError: (error: unknown) => {
      console.error("Import leads failed:", error);

      let message = "Something went wrong while importing leads.";

      if (error instanceof Error) {
        message = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        message = String((error as any).message);
      }

      toast.error(message);
    },

    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Leads imported successfully ✅");
    },
  });

  return {
    importLeads: mutation.mutate,
    importLeadsAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}
