import Header from "@/components/Header";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useState } from "react";
import Logo from "../../assets/logo.png";
import Logo_small from "../../assets/logo_small.png";
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dashboard_layout">
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden lg:flex
          flex-col
           transition-[width] duration-300 ease-in-out
          ${isCollapsed ? "w-[80px]" : "w-[260px]"}
          bg-white dark:bg-[#283046]  text-gray-600 dark:text-gray-300 shadow 
        `}
      >
        <div
          className={`logo flex ${isCollapsed ? "px-1 pt-4 pb-0" : "px-6 pt-6 pb-1"} relative`}
        >
          {isCollapsed ?
            <img src={Logo_small} alt="" className="w-11 h-11 block mx-auto" />
          : <img src={Logo} alt="" className="w-38 h-13" />}

          <button
            className={`my-4 self-center absolute top-2 right-2 `}
            onClick={() => setIsCollapsed((prev) => !prev)}
          >
            {isCollapsed ?
              <Circle />
            : <CircleDot />}
          </button>
        </div>

        <nav
          className="flex-1 overflow-y-auto  [&::-webkit-scrollbar]:w-1.5  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:transparent
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300"
        >
          {isCollapsed ?
            <div className="flex flex-col items-center  py-6">
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
          : <ul className="ps-4 pe-1 pt-4">
              {navItems.map((item, idx) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={idx}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-4 text-[15px] h-11 p-4 w-full rounded-md hover:bg-gray-100 ${
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
