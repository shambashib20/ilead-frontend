import Header from "@/components/Header";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useState } from "react";
import Logo from "../../assets/logo.png";
import Logo_dark from "../../assets/logo_dark.png";
import Logo_small from "../../assets/logo_small.png";
import Logo_small_dark from "../../assets/logo-dark-sm.png";
import {
  Bell,
  Calendar,
  Circle,
  CircleDot,
  FileText,
  Funnel,
  House,
  LayoutGrid,
  ListChecks,
  ListTodo,
  PartyPopper,
  Presentation,
  SquareCheckBig,
  Users,
  UserX,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useTheme } from "@/contexts/ThemeProvider";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: RouteComponent,
});

const navItems = [
  { name: "Dashboard", icon: <House size={20} />, path: "/dashboard" },
  { name: "Lead", icon: <Funnel size={20} />, path: "/lead" },
  { name: "Task", icon: <Calendar size={20} />, path: "/task" },
  { name: "Reminder", icon: <Bell size={20} />, path: "/reminder" },
  { name: "Meeting", icon: <Presentation size={20} />, path: "/meeting" },
  { name: "Todo", icon: <ListTodo size={20} />, path: "/todo" },
  { name: "Notes", icon: <SquareCheckBig size={20} />, path: "/notes" },
  { name: "Calendar", icon: <Calendar size={20} />, path: "/calendar" },
  { name: "Customer", icon: <Users size={20} />, path: "/customer" },
  { name: "Invoice", icon: <FileText size={20} />, path: "/invoice" },
  { name: "Leave", icon: <UserX size={20} />, path: "/leave" },
  { name: "Holidays", icon: <Calendar size={20} />, path: "/holidays" },
  { name: "SOP", icon: <ListChecks size={20} />, path: "/sop" },
  { name: "Greetings", icon: <PartyPopper size={20} />, path: "/greetings" },
  { name: "Reports", icon: <LayoutGrid size={20} />, path: "/reports" },
];

function RouteComponent() {
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const effectiveCollapsed = isCollapsed && !isHovered;

  return (
    <div className="dashboard_layout">
      {/* Desktop Sidebar */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          hidden lg:flex
          flex-col
           transition-[width] duration-300 ease-in-out
           ${effectiveCollapsed ? "w-[80px]" : "w-[270px]"}
          bg-primary  text-gray-600 dark:text-gray-300 shadow 
        `}
      >
        <div
          className={`logo flex ${effectiveCollapsed ? "px-1 pt-4 pb-0" : "px-6 pt-6 pb-1"} relative`}
        >
          {effectiveCollapsed ?
            <img
              src={theme === "light" ? Logo_small : Logo_small_dark}
              alt=""
              className="w-11 h-11 block mx-auto"
            />
          : <img
              src={theme !== "light" ? Logo_dark : Logo}
              alt=""
              className="w-38 h-13"
            />
          }
          {!effectiveCollapsed && (
            <button
              className={`my-4 self-center absolute top-2 right-2 `}
              onClick={() => setIsCollapsed((prev) => !prev)}
            >
              {isCollapsed ?
                <Circle />
              : <CircleDot />}
            </button>
          )}
        </div>

        <nav
          className="flex-1 overflow-y-auto  [&::-webkit-scrollbar]:w-1.5  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:transparent
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:transparent hover:[&::-webkit-scrollbar-thumb]:bg-gray-300"
        >
          {effectiveCollapsed ?
            <div className="flex flex-col items-center  py-6 ps-1">
              {navItems.map((item, idx) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    to={item.path}
                    key={idx}
                    className={`text-gray-500 hover:text-black p-3 ${
                      isActive ?
                        "primary-gradient sidebar-active text-white "
                      : ""
                    }`}
                  >
                    {item.icon}
                  </Link>
                );
              })}
            </div>
          : <ul className="ps-4 pe-2 pt-4">
              {navItems.map((item, idx) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={idx}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-4 text-[15px] h-11 p-4 w-full rounded-md  ${
                        isActive ?
                          "primary-gradient sidebar-active text-white"
                        : ""
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          }
        </nav>
      </aside>

      {/* Mobile Sidebar Drawer with Slide Animation */}
      <div
        className={`
          fixed inset-0 z-40 transition-transform duration-300 ease-in-out
          lg:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          bg-gray-900 text-white w-64
        `}
      >
        <div className="p-4">
          <button className="mb-4" onClick={() => setMobileOpen(false)}>
            Close
          </button>
          <nav className="space-y-4">
            <div className="flex items-center gap-2">
              <i>🏠</i> <span>Home</span>
            </div>
            <div className="flex items-center gap-2">
              <i>📁</i> <span>Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <i>⚙️</i> <span>Settings</span>
            </div>
          </nav>
        </div>
      </div>

      {/* Backdrop for mobile sidebar */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-auto flex flex-col z-10 relative py-4 px-8 ">
        <Header />

        <div className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>

        <footer className="footer border-t p-4">Footer Content</footer>
      </main>
    </div>
  );
}
