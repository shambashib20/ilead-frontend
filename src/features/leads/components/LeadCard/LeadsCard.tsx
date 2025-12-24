import { memo } from "react";
import { Phone, User, AlertCircle } from "lucide-react";
import type { Lead } from "@/features/leads/types";
import { useModalStore } from "@/store/useModalStore";
import { LeadDetail } from "../LeadModals";
import { useTheme } from "@/contexts/ThemeProvider";
import { getCardActions } from "@/utils/cardActions";
import { getData } from "@/utils/localStorage";
import { cn } from "@/lib/utils";

interface LeadCardProps {
  lead: Lead & { missedFollowup?: boolean; missedCount?: number };
}

export const LeadCard = memo(({ lead }: LeadCardProps) => {
  const assignedToName = lead.assigned_to.name || "";
  const leadName = String(lead.name);
  const phoneNumber = String(lead.phone_number);
  const createdAt = String(lead.createdAt || "");
  const assignedBy = String(lead?.assigned_by?.name || "");
  const nfd = lead.follow_ups?.[0]?.next_followup_date
    ? new Date(lead.follow_ups?.[0]?.next_followup_date)
        .toLocaleString()
        .split(",")[0]
    : "-";
  const { openModal, setModalTitle, setData, setModalSize } = useModalStore();
  const user =
    typeof window !== "undefined" ? (getData("user") ?? undefined) : undefined;
  const actions = getCardActions(user.role);
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        "rounded-lg shadow hover:shadow-lg transition-all relative",
        lead.missedFollowup
          ? "bg-red-600/15 dark:bg-red-800/80 text-white border-2 border-red-500"
          : "bg-white dark:bg-primary text-white"
      )}
    >
      {/* Missed Follow-up Badge */}
      {lead.missedFollowup && lead.missedCount && lead.missedCount > 0 && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="relative">
            <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800">
              <span className="text-xs font-bold">{lead.missedCount}</span>
            </div>
            <AlertCircle
              className="absolute -bottom-1 -right-1 text-red-600 bg-white rounded-full"
              size={14}
            />
          </div>
        </div>
      )}

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
          {/* Missed Follow-up Alert Banner (Optional) */}
          {lead.missedFollowup && (
            <div className="mb-3 px-3 py-2 bg-red-100 dark:bg-red-900/30 border border-red-400 rounded flex items-center gap-2">
              <AlertCircle
                size={16}
                className="text-red-600 dark:text-red-400"
              />
              <span className="text-xs font-medium text-red-800 dark:text-red-200">
                {lead.missedCount} Missed Follow-up
                {lead?.missedCount || 0 > 1 ? "s" : ""}
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-3">
            {lead.labels?.length > 0 ? (
              lead.labels.map((label) => {
                return (
                  <span
                    key={label._id || label.title}
                    style={{
                      backgroundColor: label.meta?.color_code || "gray",
                    }}
                    className="text-xs px-3 py-1 rounded"
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

          <div className="text-gray-800 dark:text-white text-xs flex items-center gap-1">
            <span className="font-medium">NFD:</span>
            <span>{nfd}</span>
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
      </div>
    </div>
  );
});

LeadCard.displayName = "LeadCard";
