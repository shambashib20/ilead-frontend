import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_appLayout")({
  beforeLoad: async ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
