import { leadsServoceModule } from "@/features/leads/services/LeadsModule.service";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

export const fetchStatusReport = async () => {
  const data = await leadsServoceModule.getStatusReports();
  return data;
};

export const statusReportsQueryOptions = ({ enabled }: { enabled: boolean }) =>
  queryOptions({
    queryKey: ["statistics-by-status-agent"],
    queryFn: () => fetchStatusReport(),
    enabled,
  });

export function useGetStatusReports(enabled: boolean) {
  const { data, isLoading } = useSuspenseQuery(
    statusReportsQueryOptions({ enabled })
  );
  return { status: data.data, isLoading };
}

// export function useGetStatusReports(
//   options?: UseMutationOptions<GetRepcortsResponse, unknown, GetReports>
// ) {
//   return useMutation<GetRepcortsResponse, unknown, GetReports>({
//     mutationKey: ["lead-report", "statistics-by-status-agent"],
//     mutationFn: async () => {
//       const response = await leadsServoceModule.getStatusReports();
//       return response.data;
//     },
//     ...options,
//   });
// }
