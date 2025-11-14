// hooks/useFetchFacebookLeads.ts
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { facebookIntegrationService } from "../services/FacebookIntegration.service";

interface FetchLeadsPayload {
  formId: string;
  labelTitle: string;
}

export function useFetchFacebookLeads() {
  const mutation = useMutation<any, unknown, FetchLeadsPayload>({
    mutationFn: (payload: FetchLeadsPayload) =>
      facebookIntegrationService.fetchFacebookLeads(payload),

    // called immediately before mutation function is fired
    onMutate: () => {
      Swal.fire({
        title: "Processing Facebook leads",
        html: "Please wait while we import the leads...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
    },

    onSuccess: (_resp) => {
      // close the loading modal
      Swal.close();

      // nice success modal then redirect
      Swal.fire({
        icon: "success",
        title: "Leads imported",
        text: "Redirecting to dashboard...",
        timer: 1200,
        showConfirmButton: false,
        willClose: () => {
          // redirect after modal closes
          // using window.location to ensure navigation from inside the hook
          window.location.href = "/lead";
        },
      });

      toast.success("Facebook leads fetched successfully");
    },

    onError: (err: unknown) => {
      // ensure loading modal closed
      Swal.close();

      const message =
        (err as any)?.message ||
        (typeof err === "string" ? err : "Failed to fetch Facebook leads");

      Swal.fire({
        icon: "error",
        title: "Import failed",
        text: message,
      });

      console.error("Fetching Facebook leads failed:", err);
      toast.error("Failed to fetch Facebook leads");
    },
  });

  return mutation;
}
