import { memo } from "react";
import LeadCard from "../LeadCard";
import { statusColorMap } from "@/features/leads/utils/constants";
import type { Lead, Status } from "@/features/leads/types";

interface StatusColumnProps {
  status: Status;
  leads: Lead[];
  leadCount: number;
}

export const StatusColumn = memo(
  ({ status, leads, leadCount }: StatusColumnProps) => {
    // Filter leads that belong to this status
    const statusLeads = leads.filter((lead) => lead.status._id === status._id);
    const backgroundColor = statusColorMap.get(status.title) ?? "gray";

    // Convert status title to string to ensure safe rendering
    const statusTitle = String(status.title);

    return (
      <div className="flex-shrink-0 w-[280px] rounded-lg bg-transparent">
        <div className="px-2 mb-5">
          <h3
            style={{ backgroundColor }}
            className="font-semibold py-2 px-3 rounded text-white flex items-center"
          >
            {statusTitle}
            <span className="ms-auto bg-pink-500 h-7 w-7 rounded-full grid place-items-center text-xs">
              {leadCount}
            </span>
          </h3>
        </div>

        <div
          className="px-2 space-y-2 max-h-[500px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:bg-[#fff]
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-[#173b78] hover:[&::-webkit-scrollbar-thumb]:bg-[#2554a5]"
        >
          {statusLeads.map((lead) => (
            <LeadCard key={lead._id} lead={lead} />
          ))}
        </div>
      </div>
    );
  }
);

StatusColumn.displayName = "StatusColumn";
