import { Funnel, House, LayoutGrid, Tags } from "lucide-react";

// Get user role safely from localStorage
const user = JSON.parse(localStorage.getItem("user") || "{}");
const currentUserRole = user?.role || "";

// All navigation items
const navItems = [
  { name: "Dashboard", icon: <House size={20} />, path: "/dashboard" },
  { name: "Lead", icon: <Funnel size={20} />, path: "/lead" },
  {
    name: "Label",
    icon: <Tags size={20} />,
    path: "/label",
    roles: ["Admin", "Superadmin"],
  },

  {
    name: "Status",
    icon: <Tags size={20} />,
    path: "/status",
    roles: ["Admin", "Superadmin"],
  },
  {
    name: "Workspace Logs",
    icon: <Tags size={20} />,
    path: "/workspace-logs",
    roles: ["Admin", "Superadmin"],
  },
  { name: "Reports", icon: <LayoutGrid size={20} />, path: "/reports" },
];

// Filter items based on role
export const filteredNavItems = navItems.filter((item) => {
  if (!item.roles) return true; // Show to all if no roles specified
  return item.roles.includes(currentUserRole); // Only show if role allowed
});
