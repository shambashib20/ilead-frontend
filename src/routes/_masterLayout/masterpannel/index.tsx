import { createFileRoute } from "@tanstack/react-router";
import { useMasterAdminStats } from "@/features/masterAdmin/hooks/useMasterAdminStats";

export const Route = createFileRoute("/_masterLayout/masterpannel/")({
  component: RouteComponent,
});

function StatCard({
  title,
  value,
}: {
  title: string;
  value?: number | string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="mt-2 text-3xl font-bold text-gray-900">{value ?? "—"}</h2>
    </div>
  );
}

function RouteComponent() {
  const { data, isLoading, isError } = useMasterAdminStats();

  if (isLoading) return <div>Loading dashboard...</div>;
  if (isError) return <div>Failed to load dashboard</div>;

  const stats = data?.card_statistics;

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Master Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total Leads" value={stats?.totalLeads} />
        <StatCard title="Total Clients" value={stats?.totalClients} />
        <StatCard title="Total Customers" value={stats?.totalCustomers} />
        <StatCard title="Total Properties" value={stats?.totalProperties} />
        <StatCard title="Active Properties" value={stats?.activeProperties} />
      </div>
    </div>
  );
}
