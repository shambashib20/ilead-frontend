import type { Lead } from "@/features/leads/types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";

import { User, Mail, MapPin, Phone } from "lucide-react";
import { useModalStore } from "@/store/useModalStore";
import { LeadDetail } from "@/features/leads/components/LeadModals";
import type { KeyboardEvent } from "react";

export type LeadTabType = {
  content: {
    label: string;
    description: string;
    leads?: Lead[];
    length?: number;
  }[];
};

function isEnterOrSpace(e: KeyboardEvent) {
  return e.key === "Enter" || e.key === " ";
}

export function LeadTab({ data }: { data: LeadTabType }) {
  const firstValue = data?.content?.[0]?.label ?? "tab0";

  const { setModalTitle, setData, setModalSize, openModal } = useModalStore();

  function handleModal({ _id, rayId }: { _id: string; rayId?: string }) {
    if (!_id) return;
    setModalTitle?.("Lead Details");
    setData?.({ _id, rayId: rayId ?? "" });
    setModalSize?.("lg");
    openModal({
      content: <LeadDetail />,
      type: "action" as const,
    });
  }

  return (
    <Tabs defaultValue={firstValue}>
      <TabsList
        className="flex justify-between text-center  p-2"
        role="tablist"
        aria-label="Lead tabs"
      >
        {data.content.map((item) => (
          <TabsTrigger
            key={item.label}
            value={item.label}
            className="pb-2 text-[10px] text-center md:text-[14px]"
            role="tab"
            aria-selected={false}
          >
            <span className="flex items-center justify-center text-center gap-2">
              <span>{item.label}</span>
              {typeof item.length === "number" && (
                <span className="bg-pink-600 text-white font-bold md:h-5 md:w-5 h-4 w-4 rounded-full grid text-[12px] place-content-center">
                  {item.length}
                </span>
              )}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {data.content.map((item) => (
        <TabsContent key={item.label} value={item.label} className="px-4 py-0">
          {item.leads && item.leads.length > 0 ? (
            <ul
              className="space-y-2 max-h-[300px] overflow-y-auto pt-4
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-track]:rounded-full
                [&::-webkit-scrollbar-track]:bg-[#fff]
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-[#173b78] hover:[&::-webkit-scrollbar-thumb]:bg-[#2554a5]"
            >
              {item.leads.map((lead) => {
                // require id and name for the list item to be meaningful
                const leadId = lead?._id;
                const leadName = lead?.name?.trim();
                if (!leadId || !leadName) return null;

                const onActivate = () =>
                  handleModal({ _id: leadId, rayId: lead?.meta?.ray_id });

                const onKeyDown = (e: KeyboardEvent<HTMLLIElement>) => {
                  if (isEnterOrSpace(e)) {
                    e.preventDefault();
                    onActivate();
                  }
                };

                return (
                  <li
                    key={leadId}
                    role="button"
                    tabIndex={0}
                    onClick={onActivate}
                    onKeyDown={onKeyDown}
                    className="border border-gray-200 dark:border-gray-700 ms-[20px] ps-6 relative p-3 shadow-sm space-y-1 hover:cursor-pointer dark:hover:bg-amber-50/5"
                    aria-label={`Open lead ${leadName} details`}
                  >
                    {/* Avatar - prefer a safe Tailwind value */}
                    <div
                      className="h-9 w-9 rounded-full border bg-white text-black grid place-content-center absolute -left-4 -top-4"
                      aria-hidden
                    >
                      {leadName.charAt(0).toUpperCase()}
                    </div>

                    {/* Name */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 font-medium text-[14px]">
                        <User className="w-4 h-4 text-gray-600 dark:text-gray-200" />
                        <span>{leadName}</span>
                      </div>
                    </div>

                    {/* Phone */}
                    {lead.phone_number && (
                      <div className="text-gray-600 flex items-center text-base">
                        <Phone
                          size={16}
                          className="text-gray-600 dark:text-gray-200"
                        />
                        <p className="ml-1 font-medium text-[12px] text-gray-600 dark:text-gray-200">
                          {lead.phone_number}
                        </p>
                      </div>
                    )}

                    {/* Email */}
                    {lead.email && (
                      <div className="text-sm flex items-center gap-1">
                        <Mail
                          size={16}
                          className="text-gray-600 dark:text-gray-200"
                        />
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
                      <div className="text-[12px]">
                        Comments: {lead.comment}
                      </div>
                    )}

                    {/* Reference */}
                    {lead.reference && (
                      <div className="text-[12px] text-gray-600 dark:text-gray-200">
                        Ref: {lead.reference}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-[10px] sm:text-sm text-gray-800 dark:text-gray-200 text-center">
              No leads in this tab.
            </p>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export default LeadTab;
