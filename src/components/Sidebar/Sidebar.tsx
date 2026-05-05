import { useTheme } from "@/contexts/ThemeProvider";
import { useMemo, useState } from "react";
import Logo from "../../assets/logo.png";
import Logo_dark from "../../assets/logo_dark.png";
import Logo_small from "../../assets/logo_small.png";
import Logo_small_dark from "../../assets/logo-dark-sm.png";
import { Circle, CircleDot } from "lucide-react";
import { navItems, SidebarMenuItem, type NavItem } from "./data";

const user = JSON.parse(localStorage.getItem("user") || "{}");
const currentUserRole = user?.role || "";

export const filteredNavItems = navItems.filter((item) => {
  if (!item.roles) return true;
  return item.roles.includes(currentUserRole);
});

function Sidebar() {
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const effectiveCollapsed = isCollapsed && !isHovered;

  // Group filtered items
  const groupedItems = useMemo(() => {
    const groups: { groupName: string; items: NavItem[] }[] = [];
    const seen = new Map<string, NavItem[]>();

    filteredNavItems.forEach((item) => {
      const g = item.group || "OTHER";
      if (!seen.has(g)) {
        seen.set(g, []);
        groups.push({ groupName: g, items: seen.get(g)! });
      }
      seen.get(g)!.push(item);
    });

    return groups;
  }, []);

  return (
    <aside
      onMouseEnter={() => isCollapsed && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        hidden lg:flex flex-col h-screen sticky top-0
        transition-[width] duration-300 ease-in-out
        ${effectiveCollapsed ? "w-[80px]" : "w-[250px]"}
        bg-primary text-gray-600 dark:text-gray-300
      `}
    >
      {/* Logo */}
      <div
        className={`logo flex ${effectiveCollapsed ? "px-1 pt-4 pb-3" : "px-6 pt-6 pb-1"} relative`}
      >
        {effectiveCollapsed ? (
          <img
            src={theme === "light" ? Logo_small : Logo_small_dark}
            alt=""
            className="w-11 h-11 block mx-auto"
          />
        ) : (
          <img
            src={theme !== "light" ? Logo_dark : Logo}
            alt=""
            className="w-35 h-11"
          />
        )}
        {!effectiveCollapsed && (
          <button
            className="my-4 self-center absolute top-2 right-2"
            onClick={() => setIsCollapsed((prev) => !prev)}
          >
            {isCollapsed ? <Circle /> : <CircleDot />}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-hidden">
        <ul
          className="ps-2 pe-2 pt-2 h-full overflow-y-auto
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-track]:transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:transparent
            hover:[&::-webkit-scrollbar-thumb]:bg-gray-300"
        >
          {groupedItems.map(({ groupName, items }) => (
            <li key={groupName} className="mb-2">
              {/* Group label */}
              {!effectiveCollapsed ? (
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-900 dark:text-blue-500 px-3 pt-4 pb-1">
                  {groupName}
                </p>
              ) : (
                <div className="border-t border-gray-200 dark:border-gray-700 my-3 mx-2" />
              )}

              {/* Items */}
              <ul className="space-y-1">
                {items.map((item, idx) => (
                  <SidebarMenuItem
                    key={idx}
                    item={item}
                    isCollapsed={effectiveCollapsed}
                    depth={0}
                    currentUserRole={currentUserRole}
                  />
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
