import { useEffect } from "react";
import { useUser } from "@/features/auth/hooks/useUser";
import { useTelecallerAnalytics } from "../hooks/useUserAnalytics";
import BrandLoader from "@/components/BrandLoader/BrandLoader";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import type { Lead } from "@/features/leads/types";

export default function TelecallerAnalyticsScreen() {
  const { data: user } = useUser();

  const {
    mutate: fetchAnalytics,
    data,
    isPending: isLoading,
    isError,
  } = useTelecallerAnalytics();

  // Auto-fetch analytics when screen loads
  useEffect(() => {
    if (!user) return;

    fetchAnalytics({
      startDate: "",
      endDate: "",
    });
  }, [user]);

  if (isLoading || !data) return <BrandLoader />;

  if (isError)
    return (
      <div className="flex items-center justify-center h-[70vh] text-red-400">
        Failed to load analytics
      </div>
    );

  const stats = data.data.stats;
  const agent = data.data.agent;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold mb-1">Telecaller Analytics</h1>
        <p className="text-gray-400">
          Detailed performance insights for{" "}
          <span className="font-medium">{agent.name}</span>
        </p>
      </div>

      {/* Agent Card */}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Assigned Leads"
          value={stats.totalAssignedLeads}
        />

        <StatCard title="Converted Leads" value={stats.convertedLeads} />

        <StatCard
          title="Customer Conversion (%)"
          value={`${stats.conversionRate}%`}
        />

        <StatCard title="Missed Follow-ups" value={stats.missedFollowups} />

        <StatCard
          title="Today's Upcoming Followups"
          value={`${stats.todaysFollowups}`}
        />
      </div>

      {/* Lead Trend Chart */}
      <div className="bg-primary rounded-lg p-6 border border-white/10">
        <h2 className="text-lg font-semibold mb-4">Lead Trend (Daily)</h2>

        {stats.leadTrend.length === 0 ? (
          <p className="text-gray-400">No lead trend data available.</p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.leadTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  wrapperStyle={{ zIndex: 10000 }}
                  contentStyle={{
                    backgroundColor: "rgba(20,20,20,0.8)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#4f72bd"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="bg-primary rounded-lg p-6 border border-white/10">
        <h2 className="text-lg font-semibold mb-4">Missed Followups</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.missedFollowupsForCards.leads.length === 0 ? (
            <p className="text-gray-400">No followups for today.</p>
          ) : (
            stats.missedFollowupsForCards.leads.map((lead: Lead) => (
              <div
                key={lead.leadId}
                className="bg-[#0f1f3d] border border-white/10 rounded-lg p-4"
              >
                {/* Name */}
                <h3 className="text-white font-semibold text-sm">
                  {lead.name}
                </h3>

                {/* Phone */}
                <p className="text-xs text-gray-400 mt-1">
                  {lead.phone_number}
                </p>

                {/* Followup time */}
                <p className="text-xs text-blue-400 mt-2">
                  Follow-up at{" "}
                  {new Date(lead.next_followup_date).toLocaleTimeString(
                    "en-IN",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>

                {/* Comment */}
                {lead.comment && (
                  <p className="text-xs text-gray-300 mt-2 line-clamp-2">
                    {lead.comment}
                  </p>
                )}

                {/* Label */}
                {lead.labels?.length > 0 && (
                  <span
                    className="inline-block mt-3 px-2 py-1 text-xs rounded"
                    style={{
                      backgroundColor:
                        lead.labels[0]?.meta?.color_code || "#334155",
                      color: "#fff",
                    }}
                  >
                    {lead.labels[0].title}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-primary rounded-lg p-6 border border-white/10">
        <h2 className="text-lg font-semibold mb-4">Today's Followups</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.todaysFollowupsForCards.leads.length === 0 ? (
            <p className="text-gray-400">No followups for today.</p>
          ) : (
            stats.todaysFollowupsForCards.leads.map((lead: Lead) => (
              <div
                key={lead.leadId}
                className="bg-[#0f1f3d] border border-white/10 rounded-lg p-4"
              >
                {/* Name */}
                <h3 className="text-white font-semibold text-sm">
                  {lead.name}
                </h3>

                {/* Phone */}
                <p className="text-xs text-gray-400 mt-1">
                  {lead.phone_number}
                </p>

                {/* Followup time */}
                <p className="text-xs text-blue-400 mt-2">
                  Follow-up at{" "}
                  {new Date(lead.next_followup_date).toLocaleTimeString(
                    "en-IN",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>

                {/* Comment */}
                {lead.comment && (
                  <p className="text-xs text-gray-300 mt-2 line-clamp-2">
                    {lead.comment}
                  </p>
                )}

                {/* Label */}
                {lead.labels?.length > 0 && (
                  <span
                    className="inline-block mt-3 px-2 py-1 text-xs rounded"
                    style={{
                      backgroundColor:
                        lead.labels[0]?.meta?.color_code || "#334155",
                      color: "#fff",
                    }}
                  >
                    {lead.labels[0].title}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Reusable Stat Card Component
function StatCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-primary border border-white/10 rounded-lg p-5">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}

// function LeadMiniCard({ lead }: { lead: Lead }) {
//   return (
//     <div className="bg-[#0f1f3d] border border-[#1e335c] rounded-lg p-4 hover:shadow-lg transition">
//       {/* Header */}
//       <div className="flex justify-between items-start">
//         <div>
//           <h3 className="text-white font-semibold text-sm">{lead.name}</h3>
//           <p className="text-xs text-gray-400">{lead.phone_number}</p>
//         </div>

//         {lead?.next_followup_date && (
//           <span className="text-xs bg-[#1e3a8a] text-blue-200 px-2 py-1 rounded">
//             {new Date(lead?.next_followup_date).toLocaleTimeString("en-IN", {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}
//           </span>
//         )}
//       </div>

//       {/* Label */}
//       {lead.labels?.length > 0 && (
//         <div className="mt-2">
//           <span
//             className="text-xs px-2 py-1 rounded"
//             style={{
//               backgroundColor: lead.labels[0]?.meta?.color_code || "#334155",
//               color: "#fff",
//             }}
//           >
//             {lead.labels[0]?.title}
//           </span>
//         </div>
//       )}

//       {/* Comment */}
//       {lead.comment && (
//         <p className="text-xs text-gray-300 mt-2 line-clamp-2">
//           {lead.comment}
//         </p>
//       )}

//       {/* Footer */}
//       <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
//         <span>Agent: {lead.assigned_to?.name}</span>

//         <button className="text-blue-400 hover:underline">View</button>
//       </div>
//     </div>
//   );
// }
