import { createFileRoute } from "@tanstack/react-router";

import TelecallerAnalyticsScreen from "@/features/telecaller-analytics/components/TelecallerDataCard";
export const Route = createFileRoute("/_dashboardLayout/telecaller-analytics/")(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
      <TelecallerAnalyticsScreen />
    </div>
  );
}
