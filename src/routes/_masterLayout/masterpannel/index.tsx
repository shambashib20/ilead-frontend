import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_masterLayout/masterpannel/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_masterLayout/admin/"!</div>;
}
