import {
  leadsServoceModule,
  type GetRepcortsResponse,
  type GetReports,
} from "@/features/leads/services/LeadsModule.service";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

export function useGetStatusReports(
  options?: UseMutationOptions<GetRepcortsResponse, unknown, GetReports>
) {
  return useMutation<GetRepcortsResponse, unknown, GetReports>({
    mutationKey: ["lead-report", "statistics-by-status-agent"],
    mutationFn: async (payload) => {
      const response = await leadsServoceModule.getStatusReports(payload);
      return response.data;
    },
    ...options,
  });
}
