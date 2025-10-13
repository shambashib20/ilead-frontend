import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboardLayout/report/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="reports">
      <div className="report-head ">
        <h3 className=" font-semibold">General Reports</h3>
      </div>
    </section>
  );
}
