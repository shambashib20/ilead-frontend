// cardActions.tsx (ya jahan bhi tera CARD_ACTIONS hai)
import {
  LeadAssign,
  LeadCreateCustomer,
  LeadDelete,
  LeadLabels,
} from "@/features/leads/components/LeadModals";
import {
  LeadFollowUp,
  LeadStatus,
} from "@/features/leads/components/LeadModals/LeadModals";

import {
  RefreshCw,
  Send,
  Tag,
  Trash,
  TrendingUp,
  UserPlus,
} from "lucide-react";

// NOTE: don't read localStorage at module top-level if SSR is possible.
// const role = localStorage.getItem("role"); // <-- avoid this

type CardActionType = "form" | "action" | "info";

type CardAction = {
  icon: any;
  color: string;
  dark: string;
  label: string;
  title: string | null;
  el: React.ReactNode;
  type: CardActionType;
  customActions?: any;
  // optional allowed roles — if present, only these roles can see the action
  allowedRoles?: string[];
};

export const BASE_CARD_ACTIONS: CardAction[] = [
  {
    icon: Trash,
    color: "red",
    dark: "red",
    label: "Delete Lead",
    title: "Delete Lead",
    el: <LeadDelete />,
    type: "form",
    customActions: undefined,
    allowedRoles: ["Superadmin"], // allowed role(s) (case-handling below)
  },
  {
    icon: Tag,
    color: "green",
    dark: "green",
    label: "Lead Label Assign",
    title: "Lead Label Assign",
    el: <LeadLabels />,
    type: "action",
    customActions: undefined,
  },
  {
    icon: TrendingUp,
    color: "pink",
    dark: "hotpink",
    label: "Lead Assignment",
    title: "Change Lead Assign To",
    el: <LeadAssign />,
    type: "form",
    customActions: undefined,
  },
  {
    icon: UserPlus,
    color: "pink",
    dark: "blue",
    label: "Convert Lead to Customer",
    title: null,
    el: <LeadCreateCustomer />,
    type: "info",
    customActions: undefined,
  },
  {
    icon: RefreshCw,
    color: "orange",
    dark: "orange",
    label: "Change Lead Status",
    title: "Change Lead Status",
    el: <LeadStatus />,
    type: "action",
    customActions: undefined,
  },
  {
    icon: Send,
    color: "white",
    dark: "black",
    label: "Lead Follow Up",
    title: "Add Lead Follow Up",
    el: <LeadFollowUp />,
    type: "form",
    customActions: undefined,
  },
];

/**
 * getCardActions
 * - role: optional — if not provided, it will try to read from localStorage (SSR-safe)
 * - returns filtered array according to allowedRoles
 */
export function getCardActions(role?: string) {
  // SSR-safe role detection: only access localStorage in browser
  const resolvedRole =
    role ??
    (typeof window !== "undefined"
      ? (localStorage.getItem("role") ?? undefined)
      : undefined);

  // normalize for case-insensitive comparison
  const roleNorm = resolvedRole?.toString().toLowerCase();

  return BASE_CARD_ACTIONS.filter((action) => {
    if (!action.allowedRoles || action.allowedRoles.length === 0) return true;
    // if allowedRoles defined, check if current role matches any (case-insensitive)
    return action.allowedRoles.some((r) => r.toLowerCase() === roleNorm);
  });
}
