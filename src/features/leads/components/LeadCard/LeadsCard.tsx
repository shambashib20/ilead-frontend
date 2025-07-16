import { memo } from "react";
import {
  EllipsisVertical,
  Phone,
  RefreshCw,
  Send,
  Tag,
  Trash,
  TrendingUp,
  User,
  UserPlus,
} from "lucide-react";
import type { Lead } from "@/features/leads/types";

interface LeadCardProps {
  lead: Lead;
}

const CARD_ACTIONS = [
  { icon: Trash, color: "red", label: "Delete" },
  { icon: Tag, color: "green", label: "Tag" },
  { icon: TrendingUp, color: "black", label: "Trend" },
  { icon: UserPlus, color: "blue", label: "Add User" },
  { icon: RefreshCw, color: "blue", label: "Refresh" },
  { icon: Send, color: "white", label: "Send" },
] as const;

export const LeadCard = memo(({ lead }: LeadCardProps) => {
  // Convert String objects to primitive strings to avoid React rendering issues
  const assignedToName = lead.assigned_to.name;
  const leadName = String(lead.name);
  const phoneNumber = String(lead.phone_number);
  const createdAt = String(lead.createdAt);
  const assignedBy = String(lead.assigned_by || "Test User");

  return (
    <div className="bg-primary rounded-lg shadow hover:shadow-lg transition-all">
      <div className="pt-5 px-6">
        <span className="bg-red-600 text-white text-xs px-3 py-1 rounded inline-block mb-3">
          {lead?.labels[0]?.title || "No Label"}
        </span>

        <div className="text-white text-xs font-medium flex items-center gap-2 mb-2">
          <User color="blue" size={18} />
          <span>{leadName}</span>
        </div>

        <div className="text-white text-xs font-medium flex items-center gap-2 mb-4">
          <Phone color="green" size={18} />
          <span>{phoneNumber}</span>
        </div>
      </div>

      <div className="space-y-1 px-6">
        <div className="text-white text-xs flex items-center gap-1">
          <span className="font-medium">CD:</span>
          <span>{createdAt}</span>
        </div>
        <div className="text-white text-xs flex items-center gap-1">
          <span className="font-medium">BY:</span>
          <span>{assignedBy}</span>
        </div>
        <div className="text-white text-xs flex items-center gap-1">
          <span className="font-medium">TO:</span>
          <span>{assignedToName}</span>
        </div>
      </div>

      <div className="mt-3 items-center py-3 px-2 border-t border-gray-600 flex gap-1.5">
        {CARD_ACTIONS.map(({ icon: Icon, color, label }) => (
          <button
            key={label}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title={label}
          >
            <Icon size={16} color={color} />
          </button>
        ))}
        <button className="ms-auto p-1 hover:bg-gray-700 rounded transition-colors">
          <EllipsisVertical size={16} />
        </button>
      </div>
    </div>
  );
});

LeadCard.displayName = "LeadCard";
