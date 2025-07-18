import { createFileRoute } from "@tanstack/react-router";
import { useLeads } from "@/features/leads/hooks/useLeads";
import { useLeadFilters } from "@/features/leads/hooks/useLeadFilters";
import LeadsBoard from "@/features/leads/components/LeadsBoard";
import LoadingState from "@/features/leads/components/LeadsLoading";

export const Route = createFileRoute("/_dashboardLayout/lead/")({
  component: RouteComponent,
});

function RouteComponent() {
  const filters = useLeadFilters();
  const { leads, isLoading, statuses, error } = useLeads(filters);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600">
            Error loading leads
          </h3>
          <p className="text-sm text-gray-500">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No leads found</p>
      </div>
    );
  }

  // Ensure all required Lead properties are present, including 'meta'
  const normalizedLeads = leads.map((lead) => ({
    ...lead,
    address: lead.address ?? "",
    email: lead.email ?? "",
    company_name: lead.company_name ?? "",
    meta: lead.meta ?? {}, // Provide a default empty object or adjust as per your Lead type definition
  }));

  return <LeadsBoard leads={normalizedLeads} statuses={statuses} />;
}
