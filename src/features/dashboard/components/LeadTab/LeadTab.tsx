import type { Lead } from "@/features/leads/types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";

import { User, Mail, MapPin, Phone } from "lucide-react";

export type LeadTabType = {
  content: {
    label: string;
    description: string;
    leads?: Lead[];
    length?: number;
  }[];
};
function LeadTab({ data }: { data: LeadTabType }) {
  const firstValue = data.content[0]?.label || "tab0";

  return (
    <Tabs defaultValue={firstValue}>
      <TabsList className="flex space-x-2 p-2">
        {data.content.map((item, index) => (
          <TabsTrigger key={index} value={item.label} className="pb-2">
            {item.label}{" "}
            {item.length !== undefined && (
              <span className="bg-pink-600 text-white h-5 w-5 rounded-full inline-flex items-center justify-center">
                {item.length}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      {data.content.map((item, index) => (
        <TabsContent key={index} value={item.label} className="px-4 py-0">
          {item.leads && item.leads.length > 0 ? (
            <ul
              className="space-y-2 max-h-[300px] overflow-y-auto pt-4 [&::-webkit-scrollbar]:w-1.5 
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:bg-[#fff]
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-[#173b78] hover:[&::-webkit-scrollbar-thumb]:bg-[#2554a5]"
            >
              {item.leads.map(
                (lead) =>
                  lead.name && ( // 🔑 top-level guard, skip whole li if no name
                    <li
                      key={lead._id}
                      className="border-s border-gray-200 dark:border-gray-200 ms-[20px] ps-6 relative p-3 shadow-sm space-y-1"
                    >
                      {/* Avatar */}
                      <div className="h-9 w-9 rounded-full border bg-white text-black grid place-content-center absolute -left-4.5 -top-4 ">
                        {lead.name.charAt(0).toUpperCase()}
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
                  )
              )}
            </ul>
          ) : (
            <p className="text-sm text-gray-200 text-center">
              No leads in this tab.
            </p>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export default LeadTab;
