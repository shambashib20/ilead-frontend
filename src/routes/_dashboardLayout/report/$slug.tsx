import {
  sourceQueryOptions,
  useSource,
} from "@/features/leads/hooks/useSource";
import { useGetReports } from "@/features/reports/hooks/useGetReports";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

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
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(sourceQueryOptions());
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
    source: string;
    totalLeads: number;
    agents: AgentDatum[];
    unassigned: { lead_count: number };
  };
};

function RouteComponent() {
  const { slug } = Route.useParams();
  const { sources = [] } = useSource();
  const { mutate } = useGetReports();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [data, setData] = useState<LeadBySourcePayload | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Visualization controls
  const [showAssigned, setShowAssigned] = useState(true);
  const [showUnassigned, setShowUnassigned] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [startIndex, setStartIndex] = useState(0);

  const handleClick = (item: { _id: string; title: string }) => {
    if (pendingId === item._id) return;
    setError(null);
    setPendingId(item._id);

    mutate(
      { sourceTitle: item.title },
      {
        onSuccess: (res: any) => {
          setData(res as LeadBySourcePayload);
          setActiveId(item._id);
          setStartIndex(0);
        },
        onError: (err: any) => {
          setError(err instanceof Error ? err : new Error("Request failed"));
        },
        onSettled: () => {
          setPendingId(null);
        },
      }
    );
  };

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

  const endIndex = Math.min(startIndex + pageSize, allRows.length);
  const windowRows = allRows.slice(startIndex, endIndex);

  const totalLeads = useMemo(() => {
    if (data?.data.totalLeads != null) return data.data.totalLeads;
    return allRows.reduce((acc, r) => acc + r.leads, 0);
  }, [data, allRows]);

  // Prepare chart data
  const chartData = windowRows.map((r) => ({ name: r.name, Leads: r.leads }));

  // Controls
  function handlePrev() {
    setStartIndex(Math.max(0, startIndex - pageSize));
  }
  function handleNext() {
    setStartIndex(
      Math.min(Math.max(0, allRows.length - pageSize), startIndex + pageSize)
    );
  }

  function handleDownloadCSV() {
    const header = ["Agent", "Leads", "Type", "Source"];
    const sourceLabel = data?.data.source ?? slug ?? "unknown";
    const body = allRows.map((r) => [
      r.name,
      String(r.leads),
      r.type,
      sourceLabel,
    ]);
    const lines = [header, ...body]
      .map((cols) =>
        cols.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob([lines], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-by-agent-${sourceLabel}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="report-detail">
      {/* Minimal Breadcrumb */}
      <div className="page-map py-4">
        <nav className="flex items-center gap-1 text-sm text-gray-400">
          <Link to="/report" className="hover:text-white transition-colors">
            Reports
          </Link>
          <span>/</span>
          <span className="text-white font-medium">{slug}</span>
        </nav>
      </div>

      <div className="bg-primary rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Lead Source Analytics</h1>
          <p className="text-gray-300">
            Track lead distribution across sources and agents
          </p>
        </div>

        {/* Source Selection - Minimal Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-1 p-2 bg-white/5 rounded-lg w-fit">
            {sources.map((item) => {
              const isActive = activeId === item._id;
              const isPendingThis = pendingId === item._id;

              return (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => handleClick(item)}
                  disabled={isPendingThis}
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
                  {isPendingThis ? "..." : item.title}
                </button>
              );
            })}
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-300 text-sm">{error.message}</p>
            </div>
          )}
        </div>

        {/* Empty State */}
        {!data && !error && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              Select a source to view analytics
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
                <div className="text-sm text-gray-300 mb-1">Current Source</div>
                <div className="text-xl font-semibold">{data.data.source}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-sm text-gray-300 mb-1">Total Leads</div>
                <div className="text-xl font-semibold">{totalLeads}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-sm text-gray-300 mb-1">Agents</div>
                <div className="text-xl font-semibold">{allRows.length}</div>
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

            {/* Chart */}
            <div className="bg-white/5 rounded-lg p-6">
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
                      width={120}
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
                      }}
                    />
                    <Bar
                      dataKey="Leads"
                      fill="rgba(255, 255, 255, 0.6)"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table with Pagination */}
            <div className="bg-white/5 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium text-gray-300">
                        Agent
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-gray-300">
                        Type
                      </th>
                      <th className="py-3 px-4 text-right font-medium text-gray-300">
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
                  Showing {allRows.length === 0 ? 0 : startIndex + 1}-{endIndex}{" "}
                  of {allRows.length}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={startIndex === 0}
                    className="px-3 py-2 rounded border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={endIndex >= allRows.length}
                    className="px-3 py-2 rounded border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
