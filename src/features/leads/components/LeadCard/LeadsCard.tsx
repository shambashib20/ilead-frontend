import { memo } from "react";
import { Phone, User } from "lucide-react";
import type { Lead } from "@/features/leads/types";
import { useModalStore } from "@/store/useModalStore";
import { LeadDetail } from "../LeadModals";

import { useTheme } from "@/contexts/ThemeProvider";
import { getCardActions } from "@/utils/cardActions";
import { getData } from "@/utils/localStorage";

interface LeadCardProps {
  lead: Lead;
}

export const LeadCard = memo(({ lead }: LeadCardProps) => {
  const assignedToName = lead.assigned_to.name || "";
  const leadName = String(lead.name);
  const phoneNumber = String(lead.phone_number);
  const createdAt = String(lead.createdAt || "");
  const assignedBy = String(lead?.assigned_by?.name || "");
  const { openModal, setModalTitle, setData, setModalSize } = useModalStore();
  const user =
    typeof window !== "undefined" ? (getData("user") ?? undefined) : undefined;
  const actions = getCardActions(user.role);
  const { theme } = useTheme();

  console.log(user.role);

  return (
    <div className="bg-white dark:bg-primary rounded-lg shadow hover:shadow-lg transition-all">
      <div
        className="cursor-pointer"
        onClick={() => {
          setModalTitle?.("Lead Details");
          setData?.({ _id: lead._id, rayId: lead?.meta?.ray_id });

          setModalSize?.("lg");
          openModal({
            content: <LeadDetail />,
            type: "action" as const,
          });
        }}
      >
        <div className="pt-5 px-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {lead.labels?.length > 0 ? (
              lead.labels.map((label) => {
                return (
                  <span
                    key={label._id || label.title}
                    style={{
                      backgroundColor: label.meta?.color_code || "gray",
                    }}
                    className="text-white text-xs px-3 py-1 rounded"
                  >
                    {label.title}
                  </span>
                );
              })
            ) : (
              <span className="bg-gray-600 text-white text-xs px-3 py-1 rounded">
                No Label
              </span>
            )}
          </div>

          <div className="text-gray-800 dark:text-white text-xs font-medium flex items-center gap-2 mb-2">
            <User color="blue" size={18} />
            <span>{leadName}</span>
          </div>

          <div className="text-gray-800 dark:text-white text-xs font-medium flex items-center gap-2 mb-4">
            <Phone color="green" size={18} />
            <span>{phoneNumber}</span>
          </div>
        </div>

        <div className="space-y-1 px-6">
          <div className="text-gray-800 dark:text-white text-xs flex items-center gap-1">
            <span className="font-medium">CD:</span>
            <span>{new Date(createdAt).toLocaleString()}</span>
          </div>
          {assignedBy !== "" ? (
            <div className="text-gray-800 dark:text-white text-xs flex items-center gap-1">
              <span className="font-medium">BY:</span>
              <span>{assignedBy}</span>
            </div>
          ) : (
            <div></div>
          )}

          <div className="text-gray-800 dark:text-white text-xs flex items-center gap-1">
            <span className="font-medium">TO:</span>
            <span>{assignedToName}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 items-center py-3 px-2 border-t border-gray-300 dark:border-gray-600 flex gap-1.5 relative z-20">
        {actions.map(
          ({
            icon: Icon,
            color,
            dark,
            label,
            el,
            type,
            customActions,
            title,
          }) => (
            <button
              key={label}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors cursor-pointer"
              title={label}
              onClick={() => {
                setModalTitle?.(title);
                setModalSize?.("sm");
                setData?.({
                  _id: lead._id,
                  rayId: lead.meta?.ray_id,
                  labels: lead.labels,
                  status: lead.status,
                });

                openModal({
                  content: el,
                  type,
                  customActions,
                });
              }}
            >
              <div className="relative">
                <Icon size={16} color={theme === "dark" ? color : dark} />
                {label === "Lead Follow Up" && (
                  <span className="absolute -top-1 -right-1 bg-gray-300 dark:bg-gray-800 text-black dark:text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                    {lead.follow_ups?.length ?? 0}
                  </span>
                )}
              </div>
            </button>
          )
        )}
        {/* <button className="ms-auto p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
          <EllipsisVertical size={16} />
        </button> */}
      </div>
    </div>
  );
});

LeadCard.displayName = "LeadCard";
