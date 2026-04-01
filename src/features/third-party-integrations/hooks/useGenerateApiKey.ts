import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  propertyApiKeyService,
  type GenerateApiKeyPayload,
  type GenerateApiKeyResponse,
} from "../services/PropertyApiKey.service";

export function useGenerateApiKey() {
  const mutation = useMutation<GenerateApiKeyResponse, any, GenerateApiKeyPayload>(
    {
      mutationFn: (payload: GenerateApiKeyPayload) =>
        propertyApiKeyService.generateApiKey(payload),

      onError: (error: any) => {
        const message =
          error?.message || "Could not generate API key. Please try again.";
        toast.error(message);
      },

      onSuccess: () => {
        toast.success("API key generated successfully");
      },
    }
  );

  return {
    generateApiKey: mutation.mutateAsync,
    isPending: mutation.isPending,
    data: mutation.data,
  };
}
