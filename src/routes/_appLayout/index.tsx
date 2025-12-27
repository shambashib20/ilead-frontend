import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_appLayout/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <iframe
      src="/index.html"
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
      }}
    />
  );
}
