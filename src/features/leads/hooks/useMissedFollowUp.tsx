import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { leadsServoceModule } from "../services/LeadsModule.service";

export const missedFollowUpsQueryOptions = () =>
  queryOptions({
    queryKey: ["missedFollowUps"],
    queryFn: () => leadsServoceModule.missedFollowups(),
  });

export function useMissedFollowUps() {
  const { data, isLoading } = useSuspenseQuery(missedFollowUpsQueryOptions());
  return { missedFollowUps: data.data, isLoading };
}
