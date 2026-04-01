import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  leadSubmissionService,
  type MarketingLeadPayload,
} from "../services/LeadSubmission.service";

export function useSubmitMarketingLead() {
  const mutation = useMutation({
    mutationFn: (payload: MarketingLeadPayload) =>
      leadSubmissionService.submitMarketingLead(payload),

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send your message. Please try again.";
      toast.error(message);
    },

    onSuccess: () => {
      toast.success("Message sent! We'll get back to you shortly.");
    },
  });

  return {
    submitLead: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}
