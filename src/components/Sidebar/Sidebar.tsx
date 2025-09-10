import { useTheme } from "@/contexts/ThemeProvider";
import { useState } from "react";

import Logo from "../../assets/logo.png";
import Logo_dark from "../../assets/logo_dark.png";
import Logo_small from "../../assets/logo_small.png";
import Logo_small_dark from "../../assets/logo-dark-sm.png";

import { Circle, CircleDot } from "lucide-react";
import { filteredNavItems, SubMenuItem } from "./data";

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
        ${effectiveCollapsed ? "w-[80px]" : "w-[300px]"}
        bg-primary text-gray-600 dark:text-gray-300 shadow
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
            className="w-38 h-13"
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
      <nav
        className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:transparent
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:transparent hover:[&::-webkit-scrollbar-thumb]:bg-gray-300"
      >
        <ul className="ps-2 pe-2 pt-4">
          {filteredNavItems.map((item, idx) => (
            <SubMenuItem
              key={idx}
              item={item}
              isCollapsed={effectiveCollapsed}
              depth={0}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
