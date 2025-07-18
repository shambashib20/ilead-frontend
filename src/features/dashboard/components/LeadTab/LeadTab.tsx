import type { Lead } from "@/features/leads/types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";

export type LeadTabType = {
  content: {
    label: string;
    description: string;
    leads?: Lead[];
  }[];
};
function LeadTab({ data }: { data: LeadTabType }) {
  const firstValue = data.content[0]?.label || "tab0";

  return (
    <Tabs defaultValue={firstValue}>
      <TabsList className="flex space-x-2 p-2">
        {data.content.map((item, index) => (
          <TabsTrigger key={index} value={item.label}>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {data.content.map((item, index) => (
        <TabsContent key={index} value={item.label} className="px-4 py-2">
          {item.leads && item.leads.length > 0 ? (
            <ul className="space-y-3">
              {item.leads.map((lead) => (
                <li
                  key={lead._id}
                  className="border border-gray-200 dark:border-gray-700 rounded-md p-3 shadow-sm"
                >
                  <div className="font-medium text-base">Name: {lead.name}</div>
                  <div className="font-medium text-base">
                    Company Name: {lead.company_name}
                  </div>
                  <div className="text-sm">
                    📞{" "}
                    <span className="font-medium text-base">
                      {lead.phone_number}
                    </span>
                  </div>
                  <div className="text-sm">
                    Email: <span className="text-base">{lead.email}</span>
                  </div>
                  <div className="text-base">
                    Location :<span className="text-base">{lead?.address}</span>
                  </div>
                  <div className="text-base mt-1 italic">“{lead.comment}”</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Ref: {lead.reference}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No leads in this tab.</p>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export default LeadTab;
