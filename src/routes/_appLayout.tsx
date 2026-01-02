import Footer from "@/components/Footer";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_appLayout")({
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
