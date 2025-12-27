import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_appLayout/")({
  component: RouteComponent,
  beforeLoad: () => {
    location.href = "/home";
  },
});

function RouteComponent() {
  return <div>Hello "/_appLayout/"!</div>;
}
