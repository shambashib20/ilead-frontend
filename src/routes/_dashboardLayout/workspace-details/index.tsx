import { createFileRoute } from "@tanstack/react-router";
import WorkspaceDetailsCard from "@/features/workspace/components/WorkspaceDetails/WorkspaceDetailsCard";
import { workspacePropertyQueryOptions } from "@/features/workspace/hooks/useWorkspaceProperty";
export const Route = createFileRoute("/_dashboardLayout/workspace-details/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(workspacePropertyQueryOptions());
  },
});
function RouteComponent() {
  return <WorkspaceDetailsCard />;
}
