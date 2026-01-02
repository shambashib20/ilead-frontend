import Footer from "@/components/Footer";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_appLayout")({
  beforeLoad: async ({ context }) => {},
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Outlet />
      <Footer />
    </div>
  );
}
