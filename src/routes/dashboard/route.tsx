import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useState } from "react";

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

function RouteComponent() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dashboard_layout ">
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden lg:flex
          flex-col
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-[80px]" : "w-[260px]"}
          bg-gray-900 text-white
        `}
      >
        {isCollapsed ? "S" : "main logo"}

        <button
          className="my-4 self-center"
          onClick={() => setIsCollapsed((prev) => !prev)}
        >
          menu
        </button>

        <nav className="flex-1 overflow-y-auto">
          {isCollapsed ?
            <div className="flex flex-col items-center gap-4 py-4">
              <i>🏠</i>
              <i>📁</i>
              <i>⚙️</i>
            </div>
          : <ul className="p-4 space-y-4">
              <li className="flex items-center gap-2">
                <i>🏠</i> <span>Home</span>
              </li>
              <li className="flex items-center gap-2">
                <i>📁</i> <span>Projects</span>
              </li>
              <li className="flex items-center gap-2">
                <i>⚙️</i> <span>Settings</span>
              </li>
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
      <main className="flex-auto flex flex-col bg-white z-10 relative">
        <header className="h-[60px] border-b px-4 flex items-center justify-between">
          <h1 className="text-xl">Dashboard</h1>
          {/* Mobile toggle button */}
          <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
            menu
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>

        <footer className="footer border-t p-4">Footer Content</footer>
      </main>
    </div>
  );
}
