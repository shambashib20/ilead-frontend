import AdminLogin from "@/features/masterAdmin/components/AdminLogin";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authLayout/admin/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AdminLogin />;
}
