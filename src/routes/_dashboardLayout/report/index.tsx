import { REPORTS } from "@/features/reports/components/ReportCard/data";
import { ReportCard } from "@/features/reports/components/ReportCard/ReportCard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboardLayout/report/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="reports">
      {/* Heading */}
      <div className="report-head mt-6 sm:mt-8 rounded-md bg-primary shadow p-4 sm:p-5 border border-white/10">
        <h3 className="text-lg sm:text-xl font-semibold">{REPORTS.heading}</h3>
      </div>

      {/* Grid */}
      <div
        className="grid mt-8 gap-4 sm:gap-5
                   grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
        role="list"
        aria-label="Report sections"
      >
        {REPORTS.sections.map((section) => (
          <ReportCard key={section.title} section={section} />
        ))}
      </div>
    </section>
  );
}
