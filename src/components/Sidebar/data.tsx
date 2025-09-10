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
} from "lucide-react";
import { useState } from "react";

const user = JSON.parse(localStorage.getItem("user") || "{}");
const currentUserRole = user?.role || "";

// All navigation items
export const navItems = [
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
    icon: <TrendingUp size={20} />,
    path: "/status",
    roles: ["Admin", "Superadmin"],
  },
  {
    name: "Source",
    icon: <Activity size={20} />,
    path: "/source",
    roles: ["Admin", "Superadmin"],
  },
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
    name: "Third Party Integrations",
    icon: <UserCircle size={20} />,
    roles: ["Admin", "Superadmin"],
    subItems: [
      { name: "API Connections", path: "/integrations/api" },
      { name: "Webhooks", path: "/integrations/webhooks" },
      { name: "Marketplace", path: "/integrations/marketplace" },
    ],
  },
];

// Filter items based on role
export const filteredNavItems = navItems.filter((item) => {
  if (!item.roles) return true;
  return item.roles.includes(currentUserRole); // Only show if role allowed
});

export const SubMenuItem = ({
  item,
  isCollapsed,
  depth = 0,
}: {
  item: (typeof navItems)[0];
  isCollapsed: boolean;
  depth: number;
}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isActive = location.pathname === item.path;

  // Check if any subitem is active
  const isSubItemActive =
    hasSubItems &&
    item.subItems.some((subItem) => location.pathname === subItem.path);

  return (
    <li>
      {hasSubItems ? (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`
              flex items-center justify-between w-full text-[15px] h-11 rounded-md p-2
              transition-all duration-200 ease-in-out group font-bold
              ${isActive || isSubItemActive ? "primary-gradient sidebar-active text-white" : ""}
            `}
            style={{ paddingLeft: `${1.3 + depth * 1.5}rem` }}
          >
            <div className="flex items-center gap-4">
              <span className=" transition-transform duration-300 ease-in-out group-hover:translate-x-1">
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="overflow-hidden whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </div>
            {!isCollapsed && (
              <span className="transition-transform duration-200">
                {isOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </span>
            )}
          </button>

          {!isCollapsed && isOpen && (
            <ul className="mt-1">
              {item.subItems.map((subItem, subIdx) => (
                <li key={subIdx}>
                  <Link
                    to={subItem.path}
                    className={`
                      flex items-center gap-4 text-[14px] h-9 rounded-md p-2 mx-2
                      transition-all duration-200 ease-in-out group font-medium
                      ${location.pathname === subItem.path ? "primary-gradient sidebar-active text-white" : ""}
                    `}
                    style={{ paddingLeft: `${2.5 + depth * 1.5}rem` }}
                  >
                    <span className="transition-transform duration-300 ease-in-out group-hover:translate-x-1">
                      • {/* You can replace with an icon if needed */}
                    </span>
                    <span className="overflow-hidden whitespace-nowrap">
                      {subItem.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <Link
          to={item.path}
          className={`
            flex items-center gap-4 text-[15px] h-11 rounded-md p-2
            transition-all duration-200 ease-in-out group font-bold
            ${isActive ? "primary-gradient sidebar-active text-white" : ""}
          `}
          style={{ paddingLeft: `${1 + depth * 1.5}rem` }}
        >
          <span className="ps-1 transition-transform duration-300 ease-in-out group-hover:translate-x-1">
            {item.icon}
          </span>
          {!isCollapsed && (
            <span className="overflow-hidden whitespace-nowrap">
              {item.name}
            </span>
          )}
        </Link>
      )}
    </li>
  );
};
