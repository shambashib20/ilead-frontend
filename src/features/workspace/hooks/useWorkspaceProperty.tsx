import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { workspaceService } from "@/features/workspace/services/Property.service";

export const workspacePropertyQueryOptions = () =>
  queryOptions({
    queryKey: ["workspaceProperty"],
    queryFn: () => workspaceService.getProperty(),
  });

export function useWorkspaceProperty() {
  const { data, isLoading, error, isError } = useSuspenseQuery(
    workspacePropertyQueryOptions()
  );
  return { properties: data.data.data, isLoading, error, isError };
}
