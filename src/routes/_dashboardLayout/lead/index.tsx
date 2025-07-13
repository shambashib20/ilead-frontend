import { useLeads } from "@/features/leads/hooks/useLeads";
import type { FilterPayload } from "@/features/leads/services/Leads.service";
import { statusColorMap } from "@/features/leads/utils/constants";
import { createFileRoute, useSearch } from "@tanstack/react-router";
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

export const Route = createFileRoute("/_dashboardLayout/lead/")({
  component: RouteComponent,
});

function RouteComponent() {
  const searchParams = useSearch({ from: "/_dashboardLayout/lead" }) as {
    labelIds?: string;
    assignedTo?: string;
    sourceNames?: string;
    createdByIds?: string;
    search?: string;
    sortBy?: string;
  }; // Adjust route as needed

  // Parse filters from URL search params
  const getFiltersFromSearch = (): FilterPayload => {
    return {
      labelIds: searchParams?.labelIds ? searchParams.labelIds.split(",") : [],
      assignedTo: searchParams?.assignedTo
        ? searchParams.assignedTo.split(",")
        : [],
      sourceNames: searchParams?.sourceNames
        ? searchParams.sourceNames.split(",")
        : [],
      createdByIds: searchParams?.createdByIds
        ? searchParams.createdByIds.split(",")
        : [],
      search: searchParams?.search || "",
      sortBy: searchParams?.sortBy || "",
    };
  };

  const filters = getFiltersFromSearch();
  const { leads, isLoading, statuses } = useLeads(filters);

  if (isLoading || !leads) {
    return <h3>Pending....</h3>;
  }

  return (
    <div className="w-[1000px] mx-auto">
      {" "}
      <div className="overflow-x-auto [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:transparent hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 pb-3">
        {" "}
        <div className="mt-10 inline-flex gap-4">
          {statuses?.length !== 0 &&
            statuses.map((statusItem) => {
              const count = leads.filter(
                (lead) => lead.status._id === statusItem._id
              ).length;

              return (
                <div
                  key={statusItem._id}
                  className="flex-shrink-0 w-[280px] rounded-lg bg-transparent "
                >
                  <div className="px-2 mb-5">
                    <h3
                      style={{
                        backgroundColor:
                          statusColorMap.get(statusItem.title) ?? "gray",
                      }}
                      className={`font-semibold py-2 px-3 rounded text-white flex`}
                    >
                      {statusItem.title}

                      <span className="ms-auto bg-pink-500 h-7 w-7 rounded-full grid place-items-center text-[12px]">
                        {count}
                      </span>
                    </h3>
                  </div>

                  <div className="px-2 space-y-2 max-h-[500px] overflow-y-auto [&::-webkit-scrollbar]:w-[5px]    [&::-webkit-scrollbar-track]:rounded-full   [&::-webkit-scrollbar-track]:transparent   [&::-webkit-scrollbar-thumb]:rounded-full   [&::-webkit-scrollbar-thumb]:transparent hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
                    {leads.map((leads) => {
                      return leads.status._id === statusItem._id ? (
                        <div
                          key={leads._id}
                          className="bg-primary rounded-lg  shadow hover:shadow-lg transition-all"
                        >
                          <div className="pt-5 px-6">
                            <h5 className="bg-red-600 text-white text-[12px] px-3 py-1 rounded inline-block mb-3 ">
                              {leads.reference}
                            </h5>
                            <h4 className="text-white text-[12px] font-medium flex items-center gap-2 mb-2">
                              <User color="blue" size={18} />
                              <span className="">{leads.name}</span>
                            </h4>
                            <h3 className="text-white text-[12px] font-medium flex items-center gap-2 mb-4">
                              <Phone color="green" size={18} />
                              <span>{leads.phone_number}</span>
                            </h3>
                          </div>
                          <ul className="space-y-1  px-6">
                            <li className="text-white text-[12px]  flex items-center gap-1">
                              <span className="font-medium">CD:</span>
                              {leads.createdAt}
                            </li>
                            <li className="text-white text-[12px]  flex items-center gap-1">
                              <span className="font-medium">BY:</span>{" "}
                              {"Test User"}
                            </li>
                            <li className="text-white text-[12px]  flex items-center gap-1">
                              <span className="font-medium">TO:</span>
                              {leads.assigned_to.name}
                            </li>
                          </ul>

                          <ul className=" mt-3 items-center py-3 px-2 border-t border-gray-600 flex gap-1.5 ">
                            <li>
                              <Trash size={16} color="red" />
                            </li>
                            <li>
                              <Tag size={16} color="green" />
                            </li>
                            <li>
                              <TrendingUp size={16} color="black" />
                            </li>
                            <li>
                              <UserPlus size={16} color="blue" />
                            </li>
                            <li>
                              <RefreshCw size={16} color="blue" />
                            </li>
                            <li>
                              <Send size={16} />
                            </li>
                            <li className="ms-auto">
                              <EllipsisVertical size={16} />
                            </li>
                          </ul>
                        </div>
                      ) : (
                        ""
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
