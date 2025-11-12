import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  templateService,
  type Campaign,
  type CreateCampaignPayload,
} from "../service/template.service";
import { toast } from "sonner";

export function useCreateCampaign() {
  const qc = useQueryClient();

  const mutation = useMutation<Campaign, unknown, CreateCampaignPayload>({
    mutationFn: (payload: CreateCampaignPayload) =>
      templateService.createCampaign(payload),
    onSuccess: (created) => {
      qc.invalidateQueries();
      toast.success("Status Created SucessFully");
      // Invalidate list queries so they refetch fresh data
      //   qc.invalidateQueries("campaigns");
      // Optional: if you want to append the created campaign to a cached list,
      // you could update the cache here (optimistic-ish):
      /*
      qc.setQueryData(["campaigns", 1, 10], (old: any) => {
        if (!old) return old;
        // old is CampaignData shape: { campaigns: Campaign[], pagination: ... }
        return {
          ...old,
          campaigns: [created, ...old.campaigns],
          pagination: {
            ...old.pagination,
            totalItems: old.pagination.totalItems + 1,
          }
        };
      });
      */
    },
    onError: (err) => {
      // optional: central error handling / toast
      console.error("Create campaign failed:", err);
    },
  });

  return mutation;
}
