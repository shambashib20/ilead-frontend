import { Card, CardContent } from "@/components/ui/card";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboardLayout/lead")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Card>
        <CardContent>hello</CardContent>
      </Card>
      <Outlet />
    </div>
  );
}
