import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/utils/client";
import { statusService } from "../services/Status.service";

type Status = {
  _id: string;
  title: string;
  description?: string;
  meta?: { color_code?: string; is_active?: boolean };
};

export function useDeleteStatus() {
  const mutation = useMutation<
    // success type
    unknown,
    // error type
    unknown,
    // variables (id)
    string,
    // context returned from onMutate
    { previous?: Status[]; toastId?: string }
  >({
    mutationFn: (id: string) => {
      // service call should return a promise
      return statusService.deleteStatus({ id });
    },

    // optimistic update: cancel ongoing fetches, snapshot old cache, remove item locally
    onMutate: async (id: string) => {
      // cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["statuses"] });

      // snapshot
      const previous = queryClient.getQueryData<Status[]>(["statuses"]);

      // optimistic remove
      queryClient.setQueryData<Status[] | undefined>(["statuses"], (old) =>
        old?.filter((s) => s._id !== id)
      );

      // show a persistent loading toast and keep its id so we can update it later
      const toastId = String(
        toast.loading("Deleting status...", {
          duration: Infinity,
        })
      );

      // return context for rollback
      return { previous, toastId };
    },

    onError: (err, id, context) => {
      // rollback optimistic update if something failed
      if (context?.previous) {
        queryClient.setQueryData(["statuses"], context.previous);
      }

      // update the same toast to error
      toast.error("Failed to delete status", { id: context?.toastId });
    },

    onSuccess: (_data, id, context) => {
      // update the same toast to success
      toast.success("Status deleted", { id: context?.toastId });
    },

    onSettled: () => {
      // finally, revalidate the statuses query
      // this will fetch the true source-of-truth from server
      queryClient.invalidateQueries({ queryKey: ["status"] });
    },
  });

  // expose mutateAsync so caller can await it if needed
  return { deleteStatus: mutation.mutateAsync, isDeleting: mutation.isPending };
}
