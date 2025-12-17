import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_masterLayout/masterpannel/client/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_masterLayout/masterpannel/client/"!</div>;
}

function ClientList() {}
