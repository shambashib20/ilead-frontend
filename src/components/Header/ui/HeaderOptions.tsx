import ThemeToggler from "@/components/ThemeToggler";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FollowUp from "@/features/dashboard/components/FollowUp";
import { useMedia } from "@/hooks/useMedia";
import { useModalStore } from "@/store/useModalStore";
import { Link } from "@tanstack/react-router";
import { Bell, Moon, PhoneMissed } from "lucide-react";

const icons = [PhoneMissed, Moon, Bell];

export default function HeaderOptionsBox({ logs = [] }: { logs?: any[] }) {
  const logCount = logs.length;
  const isMobile = useMedia("(max-width: 767px)");
  const { openModal, setModalTitle, setModalSize, closeModal } =
    useModalStore();

  function handleFollowUps() {
    setModalSize?.("lg");
    setModalTitle?.("Missed Follow ups ");
    openModal?.({
      content: (
        <div className="mx-3 overflow-hidden">
          {" "}
          {/* <hello /> */}
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
  }

  return (
    <ul className="flex gap-3 items-center">
      {icons.map((Icon, idx) => {
        const isMoon = Icon === Moon;
        const isBell = Icon === Bell;
        const isPhone = Icon === PhoneMissed;
        if (isMoon) {
          return (
            <li key={idx} className="cursor-pointer">
              <ThemeToggler />
            </li>
          );
        }

        if (isBell) {
          return (
            <li key={idx} className="relative flex items-center ">
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
                  className="w-80 max-h-96 overflow-y-auto  [&::-webkit-scrollbar]:w-1.5 
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:transparent
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:transparent hover:[&::-webkit-scrollbar-thumb]:bg-gray-300"
                  align="end"
                >
                  {logs.length > 0 ? (
                    logs.map((log, i) => (
                      <Link to="/workspace-logs" key={log._id || i}>
                        <div className="p-2 border-b last:border-none hover:bg-gray-100 dark:hover:bg-blue-950/30 transition">
                          <p className="text-sm font-semibold">{log.title}</p>
                          <p className="text-xs dark:text-gray-100">
                            {log.description}
                          </p>
                          <span className="text-[10px] dark:text-gray-100">
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

        if (isPhone) {
          return (
            <li key={idx} className="cursor-pointer">
              <Icon
                size={isMobile ? 18 : 20}
                onClick={() => handleFollowUps()}
              />
            </li>
          );
        }
        return (
          <li key={idx} className="cursor-pointer">
            <Link to=".">
              <Icon size={isMobile ? 18 : 20} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
