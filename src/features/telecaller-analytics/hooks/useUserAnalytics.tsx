import { useMutation } from "@tanstack/react-query";
import { leadsServoceModule } from "@/features/leads/services/LeadsModule.service";

interface TelecallerAnalyticsPayload {
  startDate?: string;
  endDate?: string;
}

export function useTelecallerAnalytics() {
  return useMutation({
    mutationKey: ["telecaller-analytics"],
    mutationFn: async (payload: TelecallerAnalyticsPayload) => {
      const response = await leadsServoceModule.getTelecallerAnayltics(payload);
      return response.data;
    },
  });
}
