import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboardLayout/report/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_dashboardLayout/report/"!</div>;
}
