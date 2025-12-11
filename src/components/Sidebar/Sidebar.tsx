import { useTheme } from "@/contexts/ThemeProvider";
import { useState } from "react";

import Logo from "../../assets/logo.png";
import Logo_dark from "../../assets/logo_dark.png";
import Logo_small from "../../assets/logo_small.png";
import Logo_small_dark from "../../assets/logo-dark-sm.png";

import { Circle, CircleDot } from "lucide-react";
import { navItems, SidebarMenuItem } from "./data";

const user = JSON.parse(localStorage.getItem("user") || "{}");
const currentUserRole = user?.role || "";
console.warn(currentUserRole, "sidebar role");
// Filter items based on role
export const filteredNavItems = navItems.filter((item) => {
  if (!item.roles) return true;
  return item.roles.includes(currentUserRole);
});

function Sidebar() {
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const effectiveCollapsed = isCollapsed && !isHovered;

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        hidden lg:flex flex-col
        transition-[width] duration-300 ease-in-out
        ${effectiveCollapsed ? "w-[80px]" : "w-[250px]"}
        bg-primary text-gray-600 dark:text-gray-300 
      `}
    >
      {/* Logo Section (unchanged) */}
      <div
        className={`logo flex ${
          effectiveCollapsed ? "px-1 pt-4 pb-3" : "px-6 pt-6 pb-1"
        } relative`}
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
            className="w-34 h-12"
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

      {/* Nav Section */}
      <nav className="flex-1  ">
        <ul
          className="ps-2 pe-2 pt-4 h-[530px] overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:transparent
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:transparent hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 "
        >
          {filteredNavItems.map((item, idx) => (
            <SidebarMenuItem
              key={idx}
              item={item}
              isCollapsed={effectiveCollapsed}
              depth={3}
              currentUserRole={currentUserRole}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
