import { useMutation } from "@tanstack/react-query";
import { addonService } from "../services/addons.services";
import { queryClient } from "@/utils/client";
import { toast } from "sonner";

export const useCreateAddon = () => {
  const mutation = useMutation({
    mutationFn: ({
      title,
      description,
      value,
    }: {
      title: string;
      description: string;
      value: string;
    }) => {
      return addonService.createAddons({ title, description, value });
    },
    onSuccess: (data) => {
      // Invalidate and refetch addons list
      queryClient.invalidateQueries({ queryKey: ["addons"] });
      toast.success(data.data.message || "Addon created successfully!");
    },
    onError: (error: { status: number; data: { message: string } }) => {
      toast.error(error.data.message || "Failed to create addon");
    },
  });

  return {
    createAddon: mutation.mutate,
    createAddonAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
};
