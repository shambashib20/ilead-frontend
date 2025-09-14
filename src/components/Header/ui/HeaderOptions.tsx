import ThemeToggler from "@/components/ThemeToggler";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMedia } from "@/hooks/useMedia";
import { Link } from "@tanstack/react-router";
import { Bell, ListTodo, Moon, PhoneMissed, Search } from "lucide-react";

const icons = [
  PhoneMissed,
  ListTodo,
  // Copy,
  Search,
  Moon,
  Bell,
];

export default function HeaderOptionsBox({ logs = [] }: { logs?: any[] }) {
  const logCount = logs.length;
  const isMobile = useMedia("(max-width: 767px)");

  return (
    <ul className="flex gap-3 items-center">
      {icons.map((Icon, idx) => {
        const isMoon = Icon === Moon;
        const isBell = Icon === Bell;

        if (isMoon) {
          return (
            <li key={idx}>
              <ThemeToggler />
            </li>
          );
        }

        if (isBell) {
          return (
            <li key={idx} className="relative flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative flex items-center justify-center h-8 w-8 cursor-pointer">
                    <Icon size={isMobile ? 18 : 22} />
                    {logCount > 0 && (
                      <span className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {logCount > 99 ? "99+" : logCount}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-80 max-h-96 overflow-y-auto"
                  align="end"
                >
                  {logs.length > 0 ? (
                    logs.map((log, i) => (
                      <Link to="/workspace-logs" key={log._id || i}>
                        <div className="p-2 border-b last:border-none hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                          <p className="text-sm font-semibold">{log.title}</p>
                          <p className="text-xs text-gray-500">
                            {log.description}
                          </p>
                          <span className="text-[10px] text-gray-400">
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-center text-sm p-3 text-gray-500">
                      No logs available
                    </p>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          );
        }

        return (
          <li key={idx}>
            <Link to=".">
              <Icon size={isMobile ? 18 : 20} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
