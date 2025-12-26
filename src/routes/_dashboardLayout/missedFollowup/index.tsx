import {
  missedFollowUpsQueryOptions,
  useMissedFollowUps,
} from "@/features/leads/hooks/useMissedFollowUp";
import MissedFollowupsTable from "@/features/missedFollowups/components/missedFollowupTable";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboardLayout/missedFollowup/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(missedFollowUpsQueryOptions());
  },
});

function RouteComponent() {
  const { missedFollowUps } = useMissedFollowUps();

  console.log(missedFollowUps);

  return (
    <div className="mt-6">
      {" "}
      <MissedFollowupsTable data={missedFollowUps.data} />{" "}
    </div>
  );
}
