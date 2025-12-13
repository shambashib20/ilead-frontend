import {
  labelReportsQueryOptions,
  useGetLabelReports,
} from "@/features/reports/hooks/useGetLabelReports";
import {
  sourceReportsQueryOptions,
  useGetReports,
} from "@/features/reports/hooks/useGetReports";
import {
  statusReportsQueryOptions,
  useGetStatusReports,
} from "@/features/reports/hooks/useGetStatusReports";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboardLayout/report/$slug")({
  component: RouteComponent,
  loader: ({ context, params }) => {
    if (params.slug === "lead-source") {
      return context.queryClient.ensureQueryData(
        sourceReportsQueryOptions({ enabled: params.slug === "lead-source" })
      );
    }
    if (params.slug === "lead-label") {
      return context.queryClient.ensureQueryData(
        labelReportsQueryOptions({ enabled: params.slug === "lead-label" })
      );
    }
    if (params.slug === "lead-status") {
      return context.queryClient.ensureQueryData(
        statusReportsQueryOptions({ enabled: params.slug === "lead-status" })
      );
    }
    return null;
  },
});

// Reusable view that works for both lead-source and lead-status
type ReportKey = "sourceTitle" | "statusTitle" | "labelTitle";

type LeadReportViewProps = {
  slug: string;
  items: Array<{ _id: string; title: string; color?: string }>;
  queryKey: ReportKey;
  heading: string;
};

function LeadReportView({
  slug,
  items,
  queryKey,
  heading,
}: LeadReportViewProps) {
  console.log(items);

  return (
    <section className="report-detail">
      <div className="page-map py-4 px-4 my-6 bg-primary shadow-lead rounded-[6px]">
        <nav className="flex items-center gap-3 text-sm dark:text-gray-400">
          <Link to="/report">Reports</Link>
          <span>{">"}</span>
          <span className="capitalize font-medium">{slug}</span>
        </nav>
      </div>

      <div className="bg-primary shadow-lead rounded-lg p-6">
        <h1 className="text-2xl text-blue-500 font-medium mb-2">{heading}</h1>

        <p className="dark:text-gray-300 text-sm">
          Track lead distribution across{" "}
          {queryKey === "sourceTitle"
            ? "sources"
            : queryKey === "labelTitle"
              ? "labels"
              : "statuses"}{" "}
          and agents
        </p>
      </div>
    </section>
  );
}

function RouteComponent() {
  const { slug } = Route.useParams();

  const isLeadSource = slug === "lead-source";
  const isLeadLabel = slug === "lead-label";
  const isLeadStatus = slug === "lead-status";

  // 👇 Sirf active slug wali query chalegi
  const sourceQuery = useGetReports(isLeadSource);
  const labelQuery = useGetLabelReports(isLeadLabel);
  const statusQuery = useGetStatusReports(isLeadStatus);

  console.log(statusQuery.status.data);

  let items: any;
  let heading = "";
  let queryKey: ReportKey = "sourceTitle";

  if (isLeadSource) {
    items = sourceQuery.reports ? sourceQuery.reports : [];
    heading = "Lead Source Analytics";
    queryKey = "sourceTitle";
  }

  if (isLeadLabel) {
    items = labelQuery.reports ? labelQuery.reports : [];
    heading = "Lead Label Analytics";
    queryKey = "labelTitle";
  }

  if (isLeadStatus) {
    items = statusQuery?.status?.data ? statusQuery?.status?.data : [];
    heading = "Lead Status Analytics";
    queryKey = "statusTitle";
  }

  return (
    <LeadReportView
      slug={slug}
      items={items}
      heading={heading}
      queryKey={queryKey}
    />
  );
}
