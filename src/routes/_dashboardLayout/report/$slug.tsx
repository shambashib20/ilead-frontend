import {
  allLabelsQueryOptions,
  useAllLabels,
} from "@/features/leads/hooks/useAllLabels";
import {
  sourceQueryOptions,
  useSource,
} from "@/features/leads/hooks/useSource";
import {
  StatusQueryOptions,
  useStatus,
} from "@/features/leads/hooks/useStatus"; // assuming this exists
import { useGetReports } from "@/features/reports/hooks/useGetReports";
import { useGetStatusReports } from "@/features/reports/hooks/useGetStatusReports";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useCallback } from "react";

// recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/_dashboardLayout/report/$slug")({
  component: RouteComponent,
  // Prefetch only for lead-source; for lead-status we’ll let the hook load lazily
  loader: ({ context, params }) => {
    if (params.slug === "lead-source") {
      return context.queryClient.ensureQueryData(sourceQueryOptions());
    }
    if (params.slug === "lead-label") {
      return context.queryClient.ensureQueryData(allLabelsQueryOptions());
    }
    if (params.slug === "lead-status") {
      return context.queryClient.ensureQueryData(StatusQueryOptions());
    }
    return null;
  },
});

type AgentDatum = {
  agent_id: string;
  agent_name: string;
  lead_count: number;
};

type LeadBySourcePayload = {
  message: string;
  status: "SUCCESS" | "ERROR";
  data: {
    source: string; // when querying by source
    status?: string; // when querying by status (optional if your API returns it)
    totalLeads: number;
    agents: AgentDatum[];
    unassigned: { lead_count: number };
  };
};

type SourceItem = { _id: string; title: string };
type LabelItem = { _id: string; title: string };

type StatusItem = {
  _id: string;
  title: string;
  description?: string;
  meta?: { is_active?: boolean; color_code?: string; is_editable?: boolean };
};

type MutateFn = (
  variables: any,
  options: {
    onSuccess?: (res: unknown) => void;
    onError?: (err: unknown) => void;
    onSettled?: () => void;
  }
) => void;

// Reusable view that works for both lead-source and lead-status
function LeadReportView({
  slug,
  items,
  queryKey, // "sourceTitle" | "statusTitle"
  heading,
  mutateFn, // <-- inject the correct mutate
}: {
  slug: string;
  items: Array<{ _id: string; title: string }>;
  queryKey: "sourceTitle" | "statusTitle" | "labelTitle";
  heading: string;
  mutateFn: MutateFn;
}) {
  // UI state
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [data, setData] = useState<LeadBySourcePayload | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Visualization controls
  const [showAssigned, setShowAssigned] = useState(true);
  const [showUnassigned, setShowUnassigned] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [startIndex, setStartIndex] = useState(0);

  // No auto-fetching; click-only
  const handleClick = useCallback(
    (item: { _id: string; title: string }) => {
      if (pendingId === item._id) return;
      setError(null);
      setPendingId(item._id);

      const payload =
        queryKey === "sourceTitle"
          ? { sourceTitle: item.title }
          : { labelTitle: item.title };

      mutateFn(payload, {
        onSuccess: (res) => {
          setData(res as LeadBySourcePayload);
          setActiveId(item._id);
          setStartIndex(0);
        },
        onError: (err) => {
          setError(err instanceof Error ? err : new Error("Request failed"));
        },
        onSettled: () => {
          setPendingId(null);
        },
      });
    },
    [mutateFn, pendingId, queryKey]
  );

  // Build rows from API payload + filters
  const allRows = useMemo(() => {
    if (!data)
      return [] as Array<{
        id: string;
        name: string;
        leads: number;
        type: "assigned" | "unassigned";
      }>;

    const rows: Array<{
      id: string;
      name: string;
      leads: number;
      type: "assigned" | "unassigned";
    }> = [];

    if (showAssigned) {
      for (const a of data.data.agents ?? []) {
        rows.push({
          id: a.agent_id,
          name: a.agent_name || "Unnamed",
          leads: a.lead_count ?? 0,
          type: "assigned",
        });
      }
    }

    if (showUnassigned) {
      rows.push({
        id: "__unassigned__",
        name: "Unassigned",
        leads: data.data.unassigned?.lead_count ?? 0,
        type: "unassigned",
      });
    }

    rows.sort((a, b) => b.leads - a.leads);
    return rows;
  }, [data, showAssigned, showUnassigned]);

  // Clamp pagination if dataset shrinks or page size changes
  useEffect(() => {
    const lastStart = Math.max(0, allRows.length - pageSize);
    if (startIndex > lastStart) setStartIndex(lastStart);
  }, [allRows.length, pageSize, startIndex]);

  // Reset pagination on filter or page size change
  useEffect(() => {
    setStartIndex(0);
  }, [showAssigned, showUnassigned, pageSize]);

  const endIndex = Math.min(startIndex + pageSize, allRows.length);
  const windowRows = useMemo(
    () => allRows.slice(startIndex, endIndex),
    [allRows, startIndex, endIndex]
  );

  const totalLeads = useMemo(() => {
    if (data?.data.totalLeads != null) return data.data.totalLeads;
    return allRows.reduce((acc, r) => acc + r.leads, 0);
  }, [data, allRows]);

  const agentCount = useMemo(() => {
    return allRows.filter((r) => r.type === "assigned").length;
  }, [allRows]);

  // Chart: full set top 20
  const chartData = useMemo(() => {
    return allRows.slice(0, 20).map((r) => ({ name: r.name, Leads: r.leads }));
  }, [allRows]);

  // Controls
  const handlePrev = useCallback(() => {
    setStartIndex((s) => Math.max(0, s - pageSize));
  }, [pageSize]);

  const handleNext = useCallback(() => {
    setStartIndex((s) =>
      Math.min(Math.max(0, allRows.length - pageSize), s + pageSize)
    );
  }, [allRows.length, pageSize]);

  const handleDownloadCSV = useCallback(() => {
    if (allRows.length === 0) return;
    const header = ["Agent", "Leads", "Type", "Context"];
    const contextLabel =
      data?.data.source ?? data?.data.status ?? slug ?? "unknown";

    const body = allRows.map((r) => [
      r.name,
      String(r.leads),
      r.type,
      String(contextLabel),
    ]);
    const lines = [header, ...body]
      .map((cols) =>
        cols.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const safeLabel = String(contextLabel).replace(/\s+/g, "-").toLowerCase();
    const blob = new Blob([lines], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-by-agent-${safeLabel}-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [allRows, data?.data.source, data?.data.status, slug]);

  const hasAnyRows = allRows.length > 0;
  const hasAnyLeads = Number(totalLeads) > 0;

  return (
    <section className="report-detail">
      {/* Breadcrumb */}
      <div className="page-map py-4">
        <nav
          className="flex items-center gap-1 text-sm text-gray-400"
          aria-label="Breadcrumb"
        >
          <Link to="/report" className="hover:text-white transition-colors">
            Reports
          </Link>
          <span aria-hidden>/</span>
          <span className="text-white font-medium">{slug}</span>
        </nav>
      </div>

      <div className="bg-primary rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">{heading}</h1>
          <p className="text-gray-300">
            Track lead distribution across{" "}
            {queryKey === "sourceTitle" ? "sources" : "statuses"} and agents
          </p>
        </div>

        {/* Selector pills */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-1 p-2 bg-white/5 rounded-lg w-fit">
            {items.map((item) => {
              const isActive = activeId === item._id;
              const isPendingThis = pendingId === item._id;
              return (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => handleClick(item)}
                  disabled={isPendingThis}
                  aria-pressed={isActive}
                  aria-busy={isPendingThis}
                  className={[
                    "px-4 py-2 rounded-md text-sm font-medium transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-primary",
                    isActive
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-300 hover:text-white hover:bg-white/10",
                    isPendingThis
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer",
                  ].join(" ")}
                >
                  {isPendingThis ? "Loading…" : item.title}
                </button>
              );
            })}
          </div>

          {error && (
            <div
              className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
              role="alert"
            >
              <p className="text-red-300 text-sm">{error.message}</p>
            </div>
          )}
        </div>

        {/* Empty State before any selection */}
        {!data && !error && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              Select a {queryKey === "sourceTitle" ? "source" : "status"} to
              view analytics
            </div>
            <div className="text-sm text-gray-500">
              Choose from the options above
            </div>
          </div>
        )}

        {/* Analytics Dashboard */}
        {data && (
          <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-sm text-gray-300 mb-1">
                  Current {queryKey === "sourceTitle" ? "Source" : "Status"}
                </div>
                <div className="text-xl font-semibold">
                  {data?.data?.source ?? data?.data?.status ?? slug ?? "—"}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-sm text-gray-300 mb-1">Total Leads</div>
                <div className="text-xl font-semibold">
                  {Number.isFinite(totalLeads) ? totalLeads : 0}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-sm text-gray-300 mb-1">Agents</div>
                <div className="text-xl font-semibold">
                  {allRows.filter((r) => r.type === "assigned").length}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4 p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAssigned}
                    onChange={(e) => setShowAssigned(e.target.checked)}
                    className="rounded border-white/20 bg-white/10"
                  />
                  Assigned
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showUnassigned}
                    onChange={(e) => setShowUnassigned(e.target.checked)}
                    className="rounded border-white/20 bg-white/10"
                  />
                  Unassigned
                </label>
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <select
                  className="bg-white/10 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={pageSize}
                  onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
                  aria-label="Rows per page"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>

                <button
                  onClick={handleDownloadCSV}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm transition-colors"
                >
                  Export CSV
                </button>
              </div>
            </div>

            {/* Empty/Zero data states */}
            {(!hasAnyRows || !hasAnyLeads) && (
              <div className="text-center py-10 text-gray-400 bg-white/5 rounded-lg">
                Nothing to show. Toggle “Assigned” or “Unassigned,” or pick
                another option.
              </div>
            )}

            {/* Chart */}
            {hasAnyRows && hasAnyLeads && (
              <div className="bg-white/5 rounded-lg p-6">
                <div className="mb-3 text-sm text-gray-400">
                  Top 20 agents by leads (all pages)
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ top: 8, right: 24, bottom: 8, left: 24 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis type="number" stroke="#9CA3AF" />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={160}
                        stroke="#9CA3AF"
                        fontSize={12}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "8px",
                          backdropFilter: "blur(8px)",
                          color: "white",
                          fontSize: 12,
                        }}
                      />
                      <Bar
                        dataKey="Leads"
                        fill="#4f72bd"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Table with Pagination */}
            {hasAnyRows && (
              <div className="bg-white/5 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white/10">
                      <tr>
                        <th
                          scope="col"
                          className="py-3 px-4 text-left font-medium text-gray-300"
                        >
                          Agent
                        </th>
                        <th
                          scope="col"
                          className="py-3 px-4 text-left font-medium text-gray-300"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          className="py-3 px-4 text-right font-medium text-gray-300"
                        >
                          Leads
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {windowRows.map((r, idx) => (
                        <tr
                          key={r.id}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium">{r.name}</div>
                              <div className="text-xs text-gray-400">
                                #{startIndex + idx + 1}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                r.type === "assigned"
                                  ? "bg-blue-500/20 text-blue-300"
                                  : "bg-gray-500/20 text-gray-300"
                              }`}
                            >
                              {r.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-semibold">
                            {r.leads}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between p-4 border-t border-white/10">
                  <div className="text-sm text-gray-400">
                    Showing {allRows.length === 0 ? 0 : startIndex + 1}-
                    {endIndex} of {allRows.length}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrev}
                      disabled={startIndex === 0}
                      aria-label="Previous page"
                      className="px-3 py-2 rounded border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={endIndex >= allRows.length}
                      aria-label="Next page"
                      className="px-3 py-2 rounded border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function RouteComponent() {
  const { slug } = Route.useParams();
  const isLeadSource = slug === "lead-source";
  const isLeadStatus = slug === "lead-status";
  const isLeadLabel = slug === "lead-label";

  // When slug doesn't match either, render a dead-simple static page without mounting data hooks
  if (!isLeadSource && !isLeadStatus && !isLeadLabel) {
    return (
      <section className="report-detail">
        <div className="page-map py-4">
          <nav
            className="flex items-center gap-1 text-sm text-gray-400"
            aria-label="Breadcrumb"
          >
            <Link to="/report" className="hover:text-white transition-colors">
              Reports
            </Link>
            <span aria-hidden>/</span>
            <span className="text-white font-medium">{slug}</span>
          </nav>
        </div>

        <div className="bg-primary rounded-lg p-6">
          <h1 className="text-2xl font-semibold mb-2">Report</h1>
          <p className="text-gray-300">No data fetching for “{slug}”.</p>
        </div>
      </section>
    );
  }

  if (isLeadSource) {
    // data list
    const { sources = [] as SourceItem[] } = useSource();
    const items = sources.map((s) => ({ _id: s._id, title: s.title }));
    // correct mutation
    const { mutate: mutateSourceReport } = useGetReports();

    return (
      <LeadReportView
        slug={slug}
        items={items}
        queryKey="sourceTitle"
        heading="Lead Source Analytics"
        mutateFn={mutateSourceReport}
      />
    );
  }

  if (isLeadStatus) {
    // data list
    const { status } = useStatus();
    const items = status.data.map((s) => ({ _id: s._id, title: s.title }));
    // correct mutation
    const { mutate: mutateStatusReport } = useGetStatusReports();

    return (
      <LeadReportView
        slug={slug}
        items={items}
        queryKey="statusTitle"
        heading="Lead Status Analytics"
        mutateFn={mutateStatusReport}
      />
    );
  }

  if (isLeadLabel) {
    // data list
    const { allLables } = useAllLabels();
    const items = allLables.data.map((s) => ({ _id: s._id, title: s.title }));
    // correct mutation
    const { mutate: mutateSourceReport } = useGetStatusReports();

    return (
      <LeadReportView
        slug={slug}
        items={items}
        queryKey="labelTitle"
        heading="Lead Label Analytics"
        mutateFn={mutateSourceReport}
      />
    );
  }

  // // lead-status
  // const { status } = useStatus();
  // const statusItems: StatusItem[] = (status?.data ?? []) as StatusItem[];
  // const items = statusItems.map((s) => ({ _id: s._id, title: s.title }));
  // // correct mutation
  // const { mutate: mutateStatusReport } = useGetStatusReports();

  return <h3>No</h3>;
}
