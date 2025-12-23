import { useMutation } from "@tanstack/react-query";
import {
  packageService,
  type CreatePackagePayload,
} from "../services/packages.service";
import { queryClient } from "@/utils/client";

export const useCreatePackage = () => {
  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: async (packageData: CreatePackagePayload) => {
      const response = await packageService.createPackage(packageData);
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
    onError: () => {},
  });

  return {
    mutate,
    isPending,
    error,
    isError,
  };
};
