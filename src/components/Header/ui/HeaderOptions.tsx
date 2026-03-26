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
import { useState } from "react";

const icons = [PhoneMissed, Moon, Bell];

export default function HeaderOptionsBox({ logs = [] }: { logs?: any[] }) {
  const logCount = logs.length;
  const isMobile = useMedia("(max-width: 767px)");
  const { pushModal, closeModal } = useModalStore();
  const [open, setOpen] = useState(false); // 👈 dropdown state

  function handleFollowUps() {
    pushModal({
      title: "Missed Follow Ups",
      size: "lg",
      type: "action",
      content: (
        <div className="mx-3 overflow-hidden">
          <FollowUp />
        </div>
      ),
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
            <li key={idx} className="relative flex items-center">
              <DropdownMenu open={open} onOpenChange={setOpen}>
                {" "}
                {/* 👈 */}
                <DropdownMenuTrigger asChild>
                  <button className="relative flex items-center justify-center h-8 w-8 cursor-pointer">
                    <Icon size={isMobile ? 18 : 22} />
                    {logCount > 0 && (
                      <span className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                        {logCount > 99 ? "99+" : logCount}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-80 max-h-[420px] overflow-y-auto p-0
                    [&::-webkit-scrollbar]:w-1
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-thumb]:bg-gray-300/40"
                  align="end"
                >
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-background z-10">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-foreground">
                        Notifications
                      </h4>
                      {logCount > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {logCount} new
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  {logs.length > 0 ? (
                    <div>
                      {logs.map((log, i) => (
                        <Link
                          to="/workspace-logs"
                          key={log._id || i}
                          onClick={() => setOpen(false)} // 👈
                        >
                          <div className="flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-none">
                            <div className="mt-1.5 flex-shrink-0">
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground leading-snug">
                                {log.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                                {log.description}
                              </p>
                              <span className="text-[10px] text-muted-foreground/70 mt-1 block">
                                {new Date(log.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
                        <Icon size={18} className="text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        All caught up!
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        No notifications yet
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  {logs.length > 0 && (
                    <div className="px-4 py-2.5 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-background">
                      <Link
                        to="/workspace-logs"
                        onClick={() => setOpen(false)} // 👈
                      >
                        <p className="text-xs text-blue-500 hover:text-blue-600 text-center font-medium transition-colors">
                          View all notifications →
                        </p>
                      </Link>
                    </div>
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
