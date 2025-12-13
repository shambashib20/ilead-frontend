import { leadsServoceModule } from "@/features/leads/services/LeadsModule.service";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

export const fetchSourceReports = async () => {
  const response = await leadsServoceModule.getSourceReports();
  return response.data;
};

export const sourceReportsQueryOptions = ({ enabled }: { enabled: boolean }) =>
  queryOptions({
    queryKey: ["lead-report", "statistics-by-source-agent"],
    queryFn: fetchSourceReports,
    enabled,
  });

export function useGetReports(enabled: boolean) {
  const { data, isLoading } = useSuspenseQuery(
    sourceReportsQueryOptions({ enabled })
  );
  return {
    reports: data?.data,
    isLoading,
  };
}
