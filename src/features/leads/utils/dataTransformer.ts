import type { Lead } from "@/features/leads/types";

// Utility to safely convert API data to renderable strings
export const transformLeadForDisplay = (lead: Lead) => ({
  ...lead,
  name: String(lead.name),
  phone_number: String(lead.phone_number),
  createdAt: String(lead.createdAt),
  assigned_by: String(lead.assigned_by || ""),
  assigned_to: {
    ...lead.assigned_to,
    name: String(lead.assigned_to.name),
  },
});

// Type guard to check if a value is safely renderable
export const isSafeToRender = (
  value: unknown
): value is string | number | boolean => {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
};
