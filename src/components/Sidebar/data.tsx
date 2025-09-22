import { cn } from "@/lib/utils";
import { useLocation } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  Funnel,
  House,
  Tags,
  // FileText,
  MessageSquare,
  Activity,
  UserCircle,
  Users,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Filter,
  Settings,
  Plug,
  CreditCard,
  Bell,
  Shield,
  Sliders,
} from "lucide-react";
import { useState, type ReactNode } from "react";

export type NavItem = {
  name: string;
  icon?: ReactNode; // har jagah icon zaroori nahi hoga, isliye optional
  path?: string;
  roles?: string[];
  subItems?: NavItem[]; // recursion
};

interface SidebarMenuItemProps {
  item: NavItem;
  isCollapsed: boolean;
  depth?: number;
  currentUserRole?: string;
}

// All navigation items
export const navItems: NavItem[] = [
  { name: "Dashboard", icon: <House size={20} />, path: "/dashboard" },
  { name: "Lead", icon: <Filter size={20} />, path: "/lead" },
  {
    name: "Workspace Logs",
    icon: <MessageSquare size={20} />,
    path: "/workspace-logs",
    roles: ["Admin", "Superadmin"],
  },
  {
    name: "User Module",
    icon: <Users size={20} />,
    roles: ["Admin", "Superadmin"],
    subItems: [
      { name: "User List", path: "/users" },
      { name: "Roles & Permissions", path: "/roles" },
      { name: "Activity Log", path: "/user-activity" },
    ],
  },
  {
    name: "Customers",
    icon: <UserCircle size={20} />,
    path: "/customer",
    roles: ["Admin", "Superadmin"],
  },
  {
    name: "Integrations",
    icon: <Plug size={20} />,
    roles: ["Admin", "Superadmin"],
    subItems: [
      { name: "API Connections", path: "/third-party-integration" },
      { name: "Webhooks", path: "/integrations/webhooks" },
      { name: "Marketplace", path: "/integrations/marketplace" },
    ],
  },
  {
    name: "General Settings",
    icon: <Settings size={20} />,
    subItems: [
      {
        name: "Attributes",
        icon: <Funnel size={18} />,
        subItems: [
          {
            name: "Labels",
            icon: <Tags size={18} />,
            path: "/label",
            roles: ["Admin", "Superadmin"],
          },
          {
            name: "Status",
            icon: <TrendingUp size={18} />,
            path: "/status",
            roles: ["Admin", "Superadmin"],
          },
          {
            name: "Sources",
            icon: <Activity size={18} />,
            path: "/source",
            roles: ["Admin", "Superadmin"],
          },
        ],
      },
    ],
    roles: ["Admin", "Superadmin"],
  },
];

export const SidebarMenuItem = ({
  item,
  isCollapsed,
  depth = 0,
  currentUserRole = "Admin",
}: SidebarMenuItemProps) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Check if user has permission to see this item
  const hasPermission = !item.roles || item.roles.includes(currentUserRole);

  if (!hasPermission) return null;

  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isActive = location.pathname === item.path;

  // Recursive function to check if any nested item is active
  const checkActiveRecursive = (items: NavItem[]): boolean => {
    return items.some(
      (subItem) =>
        location.pathname === subItem.path ||
        (subItem.subItems && checkActiveRecursive(subItem.subItems))
    );
  };

  const isSubItemActive = hasSubItems
    ? checkActiveRecursive(item.subItems!)
    : false;
  const shouldHighlight = isActive || isSubItemActive;

  const baseStyles = cn(
    "flex items-center gap-3 text-sm h-11  rounded-lg transition-all duration-200 ease-in-out group relative",
    "hover:bg-sidebar-hover hover:translate-x-1",
    shouldHighlight &&
      "bg-gradient-to-r from-[#432ee5] to-[#e43e2b] text-sidebar-text-active shadow-lg",
    !shouldHighlight && "text-sidebar-text hover:text-sidebar-text"
  );

  const indentStyles = {
    paddingLeft: `${0.6 + depth * 0.2}rem`,
  };

  // If item has subItems, render as expandable button
  if (hasSubItems) {
    return (
      <li className="overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(baseStyles, "w-full justify-between px-3")}
          style={indentStyles}
        >
          <div className="flex items-center gap-3 min-w-0">
            {item.icon && (
              <span className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                {item.icon}
              </span>
            )}
            {!isCollapsed && (
              <span className="truncate font-medium">{item.name}</span>
            )}
          </div>
          {!isCollapsed && (
            <span className="flex-shrink-0 transition-transform duration-200">
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
        </button>

        {/* Recursive rendering of sub-items */}
        {!isCollapsed && isOpen && item.subItems && (
          <ul className="mt-1 space-y-1 ">
            {item.subItems.map((subItem, index) => (
              <SidebarMenuItem
                key={`${subItem.name}-${index}`}
                item={subItem}
                isCollapsed={isCollapsed}
                depth={depth + 1}
                currentUserRole={currentUserRole}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  // If item has a path, render as Link
  if (item.path) {
    return (
      <li className="overflow-hidden">
        <Link
          to={item.path}
          className={cn(baseStyles, "px-3")}
          style={indentStyles}
        >
          {item.icon ? (
            <span className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
              {item.icon}
            </span>
          ) : (
            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-sidebar-text-muted group-hover:bg-sidebar-text" />
            </span>
          )}
          {!isCollapsed && (
            <span className="truncate font-medium">{item.name}</span>
          )}
        </Link>
      </li>
    );
  }

  // If item has neither subItems nor path, render as static item
  return (
    <li className="overflow-hidden">
      <div
        className={cn(baseStyles, "px-3 cursor-default")}
        style={indentStyles}
      >
        {item.icon ? (
          <span className="flex-shrink-0">{item.icon}</span>
        ) : (
          <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-sidebar-text-muted" />
          </span>
        )}
        {!isCollapsed && (
          <span className="truncate font-medium text-sidebar-text-muted">
            {item.name}
          </span>
        )}
      </div>
    </li>
  );
};
