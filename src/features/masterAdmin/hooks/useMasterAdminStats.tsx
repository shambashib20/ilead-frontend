// src/hooks/useAdminLogin.ts
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard.service";

export function useMasterAdminStats() {
  const query = useQuery({
    queryKey: ["master-dashboard-stats"],
    queryFn: async () => {
      const res = await dashboardService.masterFetchStats();
      return res.data.data;
    },
    refetchInterval: 0,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 0,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
