import { queryClient } from "@/utils/client";
import { addonService } from "../services/addons.services";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateAddon = () => {
  const mutation = useMutation({
    mutationFn: (payload: {
      addOnId: string;
      title: string;
      description: string;
      value: string;
      status: string;
    }) => {
      return addonService.updateAddons(payload);
    },
    onSuccess: (data) => {
      // Invalidate and refetch addons list
      queryClient.invalidateQueries({ queryKey: ["addons"] });
      toast.success(data.data.message || "Addon updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update addon");
    },
  });

  return {
    updateAddon: mutation.mutate,
    updateAddonAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
};
