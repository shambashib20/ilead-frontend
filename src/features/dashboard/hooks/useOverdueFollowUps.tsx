import { leadsServoceModule } from "@/features/leads/services/LeadsModule.service";
// import { queryClient } from "@/utils/client";
// import { getData } from "@/utils/localStorage";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

// const user = getData("user");

// console.log(user);/

export const OverdueFollowupsQueryOptions = () =>
  queryOptions({
    queryKey: ["overdue-followups"],
    queryFn: () => leadsServoceModule.overdueFollowUps(),
    // enabled: user?.role === "Chat Agent",
    // enabled:queryClient.getQueryData(["user"])?.data?.role===""
  });

export function useOverdueFollowUps() {
  const { data, isLoading } = useSuspenseQuery(OverdueFollowupsQueryOptions());
  return { overdueFollowups: data.data, isLoading };
}
