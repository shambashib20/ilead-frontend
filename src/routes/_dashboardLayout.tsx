import Header from "@/components/Header";
import { navItems } from "@/components/Sidebar/data";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useSidebarStore } from "@/store/useSidebarStore";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import {
  Funnel,
  House,
  Tags,
  // FileText,
  MessageSquare,
  Activity,
  UserCircle,
  Users,
  Link,
  X,
} from "lucide-react";

export const Route = createFileRoute("/_dashboardLayout")({
  beforeLoad: async ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { mobileOpen, setMobileOpen } = useSidebarStore();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserRole = user?.role || "";

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(currentUserRole);
  });

  return (
    <div className="dashboard_layout">
      <Sidebar />

      <div
        className={`
          fixed inset-0 z-40 transition-transform duration-300 ease-in-out
          lg:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100
          w-64 shadow-lg
        `}
      >
        <div className="p-4">
          <button
            className="mb-6 flex items-center justify-end w-full text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>

          <nav className="space-y-2">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            ))}
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
      <main className="flex-auto flex flex-col z-10 relative py-4 px-8 overflow-x-hidden">
        <Header />

        <div className="flex-1 overflow-y-visible mt-0 ">
          <Outlet />
        </div>

        <footer className="footer text-sm">
          Made with ❤ by{" "}
          <a
            href="https://www.shambashib.in/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Shambashib Majumdar
          </a>{" "}
          & Tushar Dutta
        </footer>
      </main>
    </div>
  );
}
