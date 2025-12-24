import { LeadDetail } from "@/features/leads/components/LeadModals";
import type { Lead } from "@/features/leads/services/LeadsModule.service";
import { useModalStore } from "@/store/useModalStore";
import { Mail, MapPin, Phone, User } from "lucide-react";

export default function UpcomingFollowUpsList({ leads }: { leads: Lead[] }) {
  const { setModalTitle, setData, setModalSize, openModal } = useModalStore();

  function handleModal({ _id, rayId }: { _id: string; rayId?: string }) {
    setModalTitle?.("Lead Details");
    setData?.({ _id, rayId });
    setModalSize?.("lg");
    openModal({
      content: <LeadDetail />,
      type: "action" as const,
    });
  }

  if (!leads || leads.length === 0) {
    return (
      <p className="text-[10px] sm:text-sm text-gray-800 dark:text-gray-200 text-center">
        No upcoming follow-ups.
      </p>
    );
  }

  return (
    <ul
      className="space-y-2 max-h-[300px] overflow-y-auto pt-2
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-[#fff]
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-[#173b78] hover:[&::-webkit-scrollbar-thumb]:bg-[#2554a5]"
    >
      {leads.map((lead) => (
        <li
          key={lead._id}
          className="border-s border-gray-200 dark:border-gray-200 ms-[20px] ps-6  relative p-3 shadow-sm space-y-1 dark:hover:bg-amber-50/5 cursor-pointer mt-3"
          onClick={() => handleModal({ _id: lead._id })}
        >
          {/* Avatar */}
          <div className="h-9 w-9 rounded-full border bg-white text-black grid place-content-center absolute -left-4 -top-4">
            {lead.name?.charAt(0).toUpperCase()}
          </div>

          {/* Name */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 font-medium text-[14px]">
              <User className="w-4 h-4 text-gray-600 dark:text-gray-200" />
              {lead.name}
            </div>
          </div>

          {/* Phone */}
          {lead.phone_number && (
            <div className="text-gray-600 flex items-center text-base">
              <Phone size={16} className="text-gray-600 dark:text-gray-200" />
              <p className="ml-1 font-medium text-[12px] text-gray-600 dark:text-gray-200">
                {lead.phone_number}
              </p>
            </div>
          )}

          {/* Email */}
          {lead.email && (
            <div className="text-sm flex items-center gap-1">
              <Mail size={16} className="text-gray-600 dark:text-gray-200" />
              <span className="text-[12px]">{lead.email}</span>
            </div>
          )}

          {/* Address */}
          {lead.address && (
            <div className="text-sm flex items-center gap-1">
              <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-200" />
              <span className="text-[12px]">{lead.address}</span>
            </div>
          )}

          {/* Comments */}
          {lead.comment && (
            <div className="text-[12px]">Comments: {lead.comment}</div>
          )}

          {/* Reference */}
          {lead.reference && (
            <div className="text-[12px] text-gray-600 dark:text-gray-200">
              Ref: {lead.reference}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
