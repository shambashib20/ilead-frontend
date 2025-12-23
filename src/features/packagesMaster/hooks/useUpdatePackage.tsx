import { useMutation } from "@tanstack/react-query";
import {
  packageService,
  type UpdatePackagePayload,
} from "../services/packages.service";
import { queryClient } from "@/utils/client";

export const useUpdatePackage = () => {
  const { mutate, isPending, error, isError, isSuccess, data } = useMutation({
    mutationFn: async (packageData: UpdatePackagePayload) => {
      const response = await packageService.updatePackage(packageData);
      return response.data;
    },

    onSuccess: (data) => {
      console.log("Package updated successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },

    onError: (error) => {
      console.error("Error updating package:", error);
    },
  });

  return {
    mutate,
    isPending,
    isSuccess,
    error,
    isError,
    data,
  };
};
