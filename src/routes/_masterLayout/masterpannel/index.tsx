import { createFileRoute } from "@tanstack/react-router";
import { useMasterAdminStats } from "@/features/masterAdmin/hooks/useMasterAdminStats";
import { motion } from "framer-motion";
import BrandLoader from "@/components/BrandLoader/BrandLoader";

export const Route = createFileRoute("/_masterLayout/masterpannel/")({
  component: RouteComponent,
});

type StatType = "leads" | "clients" | "customers" | "vendors" | "activeVendors";

function StatCard({
  title,
  value,
  type,
}: {
  title: string;
  value?: number | string;
  type: StatType;
}) {
  const animations: Record<StatType, any> = {
    leads: {
      initial: { opacity: 0 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 2.2, repeat: Infinity, repeatType: "loop" },
    },

    clients: {
      initial: { opacity: 0 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 2.2, repeat: Infinity, repeatType: "loop" },
    },

    customers: {
      initial: { opacity: 0 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 2.2, repeat: Infinity, repeatType: "loop" },
    },

    vendors: {
      initial: { opacity: 0 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 2.2, repeat: Infinity, repeatType: "loop" },
    },

    activeVendors: {
      initial: { opacity: 0 },
      animate: { opacity: 1, x: 0 },
      transition: {
        duration: 2.2,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };
  return (
    <motion.div
      {...animations[type]}
      whileHover={{ scale: 1.04 }}
      className="rounded-xl border bg-primary p-5 shadow-sm cursor-pointer "
    >
      <p className="text-sm text-primary-foreground ">{title}</p>

      <motion.h2
        key={value}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-2 text-3xl font-bold text-primary-foreground"
      >
        {value ?? "—"}
      </motion.h2>
    </motion.div>
  );
}

function StatusCard({
  title,
  value,
  subtitle,
  status = "success",
}: {
  title: string;
  value: string;
  subtitle?: string;
  status?: "success" | "warning" | "error" | "info";
}) {
  const statusStyles = {
    success: "bg-green-500/10 text-green-600 border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    error: "bg-red-500/10 text-red-600 border-red-500/20",
    info: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
      className={`rounded-2xl border p-6 shadow-sm ${statusStyles[status]} cursor-pointer`}
    >
      <p className="text-sm font-medium opacity-80">{title}</p>

      <h2 className="mt-3 text-3xl font-bold">{value}</h2>

      {subtitle && <p className="mt-2 text-sm opacity-70">{subtitle}</p>}
    </motion.div>
  );
}

function RouteComponent() {
  const { data, isLoading, isError } = useMasterAdminStats();

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <BrandLoader />
      </div>
    );
  if (isError) return <div>Failed to load dashboard</div>;

  const stats = data?.card_statistics;
  const system = data;
  const server_message = data?.server;

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Master Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Leads across vendors"
          value={stats?.totalLeads}
          type="leads"
        />
        <StatCard
          title="Client Leads"
          value={stats?.totalClients}
          type="clients"
        />
        <StatCard
          title="CRM Customers"
          value={stats?.totalCustomers}
          type="customers"
        />
        <StatCard
          title="Total Vendors"
          value={stats?.totalProperties}
          type="vendors"
        />
        <StatCard
          title="Active Vendors"
          value={stats?.activeProperties}
          type="activeVendors"
        />
      </div>

      <div className="mt-10">
        <h1 className="mb-6 text-2xl font-bold">System & Integration Status</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {/* Razorpay Webhook */}
          <StatusCard
            title="Razorpay Webhook"
            value={
              system?.paymentWebhookStatus?.success ? "Active" : "Inactive"
            }
            subtitle={system?.paymentWebhookStatus?.webhookUrl}
            status={system?.paymentWebhookStatus?.success ? "success" : "error"}
          />

          {/* CPU Load */}
          <StatusCard
            title="CPU Load"
            value={`${system?.cpuLoad}%`}
            subtitle="Current server load"
            status={
              Number(system?.cpuLoad) < 60
                ? "success"
                : Number(system?.cpuLoad) < 80
                  ? "warning"
                  : "error"
            }
          />

          {/* Memory Usage */}
          <StatusCard
            title="Memory Usage"
            value={`${system?.memory?.usagePercent}%`}
            subtitle={`${system?.memory?.usedGB} GB / ${system?.memory?.totalGB} GB`}
            status={
              Number(system?.memory?.usagePercent) < 70
                ? "success"
                : Number(system?.memory?.usagePercent) < 85
                  ? "warning"
                  : "error"
            }
          />

          {/* DB Status */}
          <StatusCard
            title="Database"
            value="MongoDB Connected"
            subtitle={system?.dbStatus}
            status="success"
          />
        </div>
      </div>

      <div className="mt-10">
        <h1 className="mb-6 text-2xl font-bold">Server Status</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <p className="bg-primary text-sm p-4 rounded-xl leading-6">
            {server_message}
          </p>
        </div>
      </div>
    </div>
  );
}
