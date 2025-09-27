import { leadsServoceModule } from "@/features/leads/services/LeadsModule.service";
// import { getData } from "@/utils/localStorage";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

// const user = getData("user");

export const TodaysChatAgentsFollowupsQueryOptions = () =>
  queryOptions({
    queryKey: ["agents-followups"],
    queryFn: () => leadsServoceModule.todaysFollowupds(),
    // enabled: user?.role === "Chat Agent",
  });

export function useTodaysChatFollowUps() {
  const { data, isLoading } = useSuspenseQuery(
    TodaysChatAgentsFollowupsQueryOptions()
  );
  return { todaysFollowups: data.data, isLoading };
}
