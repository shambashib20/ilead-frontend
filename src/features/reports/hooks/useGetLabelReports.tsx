import { leadsServoceModule } from "@/features/leads/services/LeadsModule.service";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

export const fetchLabelReports = async () => {
  const response = await leadsServoceModule.getLabelReports();
  return response.data;
};

export const labelReportsQueryOptions = ({ enabled }: { enabled: boolean }) =>
  queryOptions({
    queryKey: ["lead-report", "statistics-by-label-agent"],
    queryFn: fetchLabelReports,
    enabled,
  });

export function useGetLabelReports(enabled: boolean) {
  const { data, isLoading } = useSuspenseQuery(
    labelReportsQueryOptions({ enabled })
  );
  return {
    reports: data?.data,
    isLoading,
  };
}
