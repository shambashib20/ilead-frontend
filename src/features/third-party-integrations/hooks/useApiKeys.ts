import { useQuery } from "@tanstack/react-query";
import { propertyApiKeyService } from "../services/PropertyApiKey.service";

export function useApiKeys() {
  const query = useQuery({
    queryKey: ["api-keys"],
    queryFn: () => propertyApiKeyService.fetchApiKeys(),
    staleTime: 2 * 60 * 1000,
  });

  return {
    apiKeys: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
