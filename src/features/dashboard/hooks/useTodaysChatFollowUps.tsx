import { useUser } from "@/features/auth/hooks/useUser";
import {
  leadsServoceModule,
  type Lead,
} from "@/features/leads/services/LeadsModule.service";
import { getData } from "@/utils/localStorage";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

type UnifiedFollowUpData = {
  leads: Lead[];
  total_upcoming_followups: number;
  agentWiseCount: Array<{
    agent_id: string;
    agent_name: string;
    lead_count: number;
  }>;
};

// Agent query options - unwrap the AxiosResponse
export const AgentFollowupsQueryOptions = () =>
  queryOptions({
    queryKey: ["agents-followups", "agent"] as const,
    queryFn: async () => {
      const response = await leadsServoceModule.todaysFollowupds();
      return response.data; // Return just the data, not the full AxiosResponse
    },
  });

// SuperAdmin query options - unwrap the AxiosResponse
export const SuperAdminFollowupsQueryOptions = () =>
  queryOptions({
    queryKey: ["agents-followups", "superadmin"] as const,
    queryFn: async () => {
      const response = await leadsServoceModule.todaysFollowupdsSuperAdmin();
      return response.data; // Return just the data, not the full AxiosResponse
    },
  });

export const TodaysFollowupsQueryOptions = () => {
  const user = getData("user");
  const isSuperAdmin =
    user?.role === "SuperAdmin" || user?.role === "Superadmin";

  return queryOptions({
    queryKey: [
      "agents-followups",
      isSuperAdmin ? "superadmin" : "agent",
    ] as const,
    queryFn: async (): Promise<UnifiedFollowUpData> => {
      if (isSuperAdmin) {
        const response = await leadsServoceModule.todaysFollowupdsSuperAdmin();
        return response.data.data; // Already in the correct format
      } else {
        const response = await leadsServoceModule.todaysFollowupds();
        // Transform to unified format
        return {
          leads: response.data.data,
          total_upcoming_followups: response.data.data.length,
          agentWiseCount: [],
        };
      }
    },
  });
};
// Hook with clean typing
export function useTodaysChatFollowUps() {
  const { data: user } = useUser();
  const isSuperAdmin =
    user?.role === "SuperAdmin" || user?.role === "Superadmin";

  const { data, isLoading } = useSuspenseQuery(TodaysFollowupsQueryOptions());

  return {
    todaysFollowups: data.leads,
    totalUpcomingFollowups: data.total_upcoming_followups,
    agentWiseCount: data.agentWiseCount,
    isSuperAdmin,
    isLoading,
  };
}
