import { createFileRoute } from "@tanstack/react-router";
import StatusCard from "@/features/status/components/StatusCard";
import { statusQueryOptions } from "@/features/status/hooks/useStatus";

export const Route = createFileRoute("/_dashboardLayout/status/")({
  component: RouteComponent,
  loader: (opts) => {
    opts.context.queryClient.ensureQueryData(statusQueryOptions());
  },
});

function RouteComponent() {
  return <StatusCard />;
}
