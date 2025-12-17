import { useTheme } from "@/contexts/ThemeProvider";
import { useAllLabels } from "@/features/leads/hooks/useAllLabels";
import { useSource } from "@/features/leads/hooks/useSource";
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
import { useStatus } from "@/features/status/hooks/useStatus";
import { cn } from "@/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

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

interface StatusChipProps {
  status: string;
  color: string;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function StatusChip({
  status,
  color,
  isActive,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: StatusChipProps) {
  const { theme } = useTheme();

  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all",
        isActive ? "opacity-100" : "opacity-40 grayscale",
        isHovered && "ring-2 ring-offset-2"
      )}
      style={{
        backgroundColor: isActive ? `${color}20` : `${color}5`,
        color: isActive
          ? `${theme === "dark" ? "#fff" : color}`
          : `${theme === "light" ? color : "#000"}`,
        ...(isHovered && { ringColor: color }),
      }}
    >
      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
      {status}
    </button>
  );
}

interface Agent {
  agent_id: string;
  agent_name: string;
  lead_count: number;
  leads_per_report: Array<Record<string, number>>;
}

interface LeadReportProps {
  items: Array<{ _id: string; title: string; color?: string }>;
  heading: string;
  data: {
    totalLeads: number;
    agents: Agent[];
  };
  slug: string;
  queryKey: string;
}

export function LeadReport({
  data,
  slug,
  items,
  heading,
  queryKey,
}: LeadReportProps) {
  console.log(data.agents);
  console.log(items);

  const colorMapping: Record<string, string> = {};
  items.forEach((item) => {
    if (item.color) {
      colorMapping[item.title] = item.color;
    }
  });

  const allStatuses =
    items.length > 0
      ? items.map((item) => item.title)
      : Array.from(
          new Set(
            data.agents.flatMap((agent) =>
              agent.leads_per_report.flatMap((statusObj) =>
                Object.keys(statusObj)
              )
            )
          )
        );

  const [activeStatuses, setActiveStatuses] = useState<Set<string>>(
    new Set(allStatuses)
  );
  const [hoveredStatus, setHoveredStatus] = useState<string | null>(null);

  const toggleStatus = (status: string) => {
    setActiveStatuses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(status)) {
        newSet.delete(status);
      } else {
        newSet.add(status);
      }
      return newSet;
    });
  };

  // Calculate the total count for each agent (only active statuses)
  const getAgentTotal = (agent: Agent) => {
    return agent.leads_per_report.reduce((sum, statusObj) => {
      const status = Object.keys(statusObj)[0];
      const count = Object.values(statusObj)[0];
      return activeStatuses.has(status) ? sum + count : sum;
    }, 0);
  };

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

        <div className="w-full p-6 space-y-6 mt-5">
          {/* Status Chips */}
          <div className="flex flex-wrap gap-2">
            {allStatuses.map((status) => (
              <StatusChip
                key={status}
                status={status}
                color={colorMapping[status] || "#6b7280"}
                isActive={activeStatuses.has(status)}
                isHovered={hoveredStatus === status}
                onClick={() => toggleStatus(status)}
                onMouseEnter={() => setHoveredStatus(status)}
                onMouseLeave={() => setHoveredStatus(null)}
              />
            ))}
          </div>

          {/* Chart */}
          <div className="space-y-3">
            {data.agents.map((agent) => {
              const total = getAgentTotal(agent);

              return (
                <div key={agent.agent_id} className="space-y-1">
                  {/* Agent Name */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground font-medium w-48 truncate">
                      {agent.agent_name}
                    </span>
                    <span className="text-muted-foreground">{total}</span>
                  </div>

                  {/* Horizontal Stacked Bar */}
                  <div className="flex items-center gap-1">
                    <div className="flex-1 flex h-7 rounded overflow-hidden bg-muted/30">
                      {total > 0 ? (
                        agent.leads_per_report.map((statusObj, idx) => {
                          const status = Object.keys(statusObj)[0];
                          const count = Object.values(statusObj)[0];

                          if (!activeStatuses.has(status) || count === 0) {
                            return null;
                          }

                          const percentage = (count / total) * 100;
                          const isHighlighted = hoveredStatus === status;

                          return (
                            <div
                              key={`${agent.agent_id}-${status}-${idx}`}
                              className={cn(
                                "flex items-center justify-center text-[11px] font-semibold text-white transition-all relative group",
                                isHighlighted &&
                                  "ring-2 ring-white ring-inset z-10 brightness-110"
                              )}
                              style={{
                                width: `${percentage}%`,
                                backgroundColor:
                                  colorMapping[status] || "#6b7280",
                                opacity:
                                  hoveredStatus && !isHighlighted ? 0.3 : 1,
                              }}
                            >
                              {percentage > 5 && count}

                              {/* Tooltip */}
                              {isHighlighted && (
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-20">
                                  {status}: {count}
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="w-full flex items-center justify-center text-xs text-muted-foreground">
                          0
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function RouteComponent() {
  const { slug } = Route.useParams();

  const isLeadSource = slug === "lead-source";
  const isLeadLabel = slug === "lead-label";
  const isLeadStatus = slug === "lead-status";

  // Queries (sirf enabled wali fire hongi)
  const sourceQuery = useGetReports(isLeadSource);
  const labelQuery = useGetLabelReports(isLeadLabel);
  const statusQuery = useGetStatusReports(isLeadStatus);

  // Meta lists
  const { status } = useStatus();
  const { allLables } = useAllLabels();
  const { sources } = useSource();

  let items: Array<{ _id: string; title: string; color?: string }> = [];
  let data: any;
  let heading = "";

  let queryKey = "sourceTitle";

  /* -------- Lead Source -------- */
  if (isLeadSource) {
    items =
      sources?.map((source) => ({
        _id: source._id,
        title: source.title,
        color: source.meta?.colorCode,
      })) ?? [];

    data = sourceQuery.reports ? sourceQuery.reports : [];
    heading = "Lead Source Analytics";
    queryKey = "sourceTitle";
  }

  /* -------- Lead Label -------- */
  if (isLeadLabel) {
    items =
      allLables?.data?.map((label) => ({
        _id: label._id,
        title: label.title,
        color: label.meta?.color_code,
      })) ?? [];

    data = labelQuery.reports ? labelQuery.reports : [];
    heading = "Lead Label Analytics";
    queryKey = "labelTitle";
  }

  /* -------- Lead Status -------- */
  if (isLeadStatus) {
    items =
      status?.statuses?.map((s) => ({
        _id: s._id,
        title: s.title,
        color: s.meta?.color_code,
      })) ?? [];

    data = statusQuery.status.data ? statusQuery.status.data : [];
    heading = "Lead Status Analytics";
    queryKey = "statusTitle";
  }

  return (
    <LeadReport
      data={data}
      items={items}
      heading={heading}
      slug={slug}
      queryKey={queryKey}
    />
  );
}
