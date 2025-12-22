import { useMutation } from "@tanstack/react-query";
import {
  packageService,
  type CreatePackagePayload,
} from "../services/packages.service";

export const useCreatePackage = () => {
  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: async (packageData: CreatePackagePayload) => {
      const response = await packageService.createPackage(packageData);
      return response.data;
    },
  });

  return {
    mutate,
    isLoading: isPending,
    error,
    isError,
  };
};
