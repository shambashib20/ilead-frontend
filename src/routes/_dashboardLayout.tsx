import Header from "@/components/Header";
import { SidebarMenuItem } from "@/components/Sidebar/data";
import Sidebar, { filteredNavItems } from "@/components/Sidebar/Sidebar";
import { useTheme } from "@/contexts/ThemeProvider";
import { useSidebarStore } from "@/store/useSidebarStore";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import Logo from "../assets/logo.png";
import Logo_dark from "../assets/logo_dark.png";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useModalStore } from "@/store/useModalStore";
import FollowUp from "@/features/dashboard/components/FollowUp";
import { Button } from "@/components/ui/button";
import { useUser } from "@/features/auth/hooks/useUser";

export const Route = createFileRoute("/_dashboardLayout")({
  beforeLoad: async ({ context }) => {
    console.log(context.user?.role);

    if (!context?.isAuthenticated) {
      throw redirect({ to: "/login" });
    }

    if (context?.user?.role === "Masteradmin") {
      throw redirect({ to: "/masterpannel" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useUser();
  console.log(data?.role);
  const { mobileOpen, setMobileOpen } = useSidebarStore();
  const { theme } = useTheme();
  const { openModal, setModalTitle, setModalSize, closeModal } =
    useModalStore();
  console.log(filteredNavItems);

  useEffect(() => {
    // 🚫 Masteradmin ko koi follow-up modal nahi
    if (data?.role === "Masteradmin") {
      window.location.href = "/masterpannel";
      return;
    }

    let start = performance.now();
    let rafId: number;

    function tick(now: number) {
      const elapsed = now - start;

      if (elapsed >= 5 * 60 * 1000) {
        setModalSize?.("lg");
        setModalTitle?.("Missed Follow ups");
        openModal?.({
          content: (
            <div className="mx-3 border-1 border-gray-600 overflow-hidden">
              <FollowUp />
            </div>
          ),
          type: "action",
          customActions: (
            <div>
              <Button onClick={() => closeModal()}>Close</Button>
            </div>
          ),
        });

        start = now; // reset timer
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [data?.role]);

  return (
    <div className="dashboard_layout">
      <div className="bg-primary">
        <Sidebar />
        <div
          className={`
          fixed inset-0 z-40 transition-transform duration-300 ease-in-out
          lg:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          bg-white text-gray-900 dark:bg-primary dark:text-gray-100
          w-64 shadow-lg
        `}
        >
          <div className="p-4">
            <div className="logo flex items-center justify-between mb-6 pt-2">
              <img
                src={theme !== "light" ? Logo_dark : Logo}
                alt=""
                className="w-38 h-10"
              />
              <button
                className=" mb-2 flex items-center justify-end w-full text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav
              className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:transparent
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:transparent hover:[&::-webkit-scrollbar-thumb]:bg-gray-300"
            >
              <ul className="">
                {filteredNavItems.map((item, idx) => (
                  <SidebarMenuItem
                    key={idx}
                    item={item}
                    isCollapsed={false}
                    depth={0}
                  />
                ))}
              </ul>
            </nav>
            {/* <nav className="space-y-2">
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
          </nav> */}
          </div>
        </div>

        {/* Backdrop for mobile sidebar */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </div>
      {/* Main Content */}
      <main className="flex-auto flex flex-col z-10 relative py-4 px-4 overflow-x-hidden ">
        <Header />

        <div className="flex-1 overflow-y-visible mt-0 ">
          <Outlet />
        </div>

        <footer className="footer text-sm mt-10">
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
