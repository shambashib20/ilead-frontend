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
