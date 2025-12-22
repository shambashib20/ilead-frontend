import { useMutation } from "@tanstack/react-query";
import {
  featureService,
  type CreateFeaturePayload,
} from "../services/features.service";
import { queryClient } from "@/utils/client";

export const useCreateFeature = () => {
  const { mutate, isPending, error, isError, isSuccess, data } = useMutation({
    mutationFn: async (featureData: CreateFeaturePayload) => {
      const response = await featureService.createFeature(featureData);
      return response.data;
    },

    onSuccess: (data) => {
      console.log("Feature created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["features"] });
    },

    onError: (error) => {
      console.error("Error creating feature:", error);
    },
  });

  return {
    mutate,
    isLoading: isPending,
    isSuccess,
    error,
    isError,
    data,
  };
};
