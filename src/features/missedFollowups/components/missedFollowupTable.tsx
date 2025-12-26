import React, { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  Search,
} from "lucide-react";

// Type definitions
type Lead = {
  company_name: string;
  address: string;
  leadId: string;
  name: string;
  phone_number: string;
  email: string;
  status: {
    _id: string;
    title: string;
  };
  assigned_to: {
    _id: string;
    name: string;
    email: string;
  };
  labels: Array<{
    _id: string;
    title: string;
  }>;
  next_followup_date: string;
  comment: string;
  meta: {
    missed_followups_count: Array<{
      days: number;
    }>;
    status?: string;
  };
};

type SortKey = keyof Lead | "missedDays" | "assignedTo" | "statusTitle";

type SortConfig = {
  key: SortKey;
  direction: "asc" | "desc";
} | null;

function MissedFollowupsTable({ data }: { data: Lead[] }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const toggleRow = (leadId: string) => {
    setExpandedRow(expandedRow === leadId ? null : leadId);
  };

  const handleSort = (key: SortKey) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return current.direction === "asc" ? { key, direction: "desc" } : null;
      }
      return { key, direction: "asc" };
    });
  };

  const getSortIcon = (key: SortKey) => {
    if (sortConfig?.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter((lead) => {
      const searchStr = globalFilter.toLowerCase();
      return (
        lead.name.toLowerCase().includes(searchStr) ||
        lead.phone_number.toLowerCase().includes(searchStr) ||
        lead.status.title.toLowerCase().includes(searchStr) ||
        lead.assigned_to.name.toLowerCase().includes(searchStr) ||
        lead.comment.toLowerCase().includes(searchStr)
      );
    });

    if (sortConfig) {
      filtered.sort((a, b) => {
        let aVal: any, bVal: any;

        switch (sortConfig.key) {
          case "missedDays":
            aVal = a.meta.missed_followups_count[0]?.days || 0;
            bVal = b.meta.missed_followups_count[0]?.days || 0;
            break;
          case "assignedTo":
            aVal = a.assigned_to.name;
            bVal = b.assigned_to.name;
            break;
          case "statusTitle":
            aVal = a.status.title;
            bVal = b.status.title;
            break;
          case "next_followup_date":
            aVal = new Date(a.next_followup_date).getTime();
            bVal = new Date(b.next_followup_date).getTime();
            break;
          default:
            aVal = a[sortConfig.key as keyof Lead];
            bVal = b[sortConfig.key as keyof Lead];
        }

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, globalFilter, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const changePageSize = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <div className="w-full p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Missed Follow-ups
          </h1>
          <p className="text-primary-foreground">
            Track and manage leads with overdue follow-ups
          </p>
        </div>

        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search leads..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="bg-primary shadow-lead rounded-lg shadow overflow-hidden">
          <div
            className="overflow-x-auto [&::-webkit-scrollbar]:w-1 
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:transparent
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:transparent hover:[&::-webkit-scrollbar-thumb]:bg-blue-500"
          >
            <table className="w-full">
              <thead className="bg-primary border-b border-gray-300 dark:border-gray-600">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider cursor-pointer hover:bg-primary/50"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      {getSortIcon("name")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider cursor-pointer hover:bg-primary/50"
                    onClick={() => handleSort("phone_number")}
                  >
                    <div className="flex items-center gap-2">
                      Phone
                      {getSortIcon("phone_number")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider cursor-pointer hover:bg-primary/50"
                    onClick={() => handleSort("statusTitle")}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      {getSortIcon("statusTitle")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider cursor-pointer hover:bg-primary/50"
                    onClick={() => handleSort("assignedTo")}
                  >
                    <div className="flex items-center gap-2">
                      Assigned To
                      {getSortIcon("assignedTo")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider cursor-pointer hover:bg-primary/50"
                    onClick={() => handleSort("missedDays")}
                  >
                    <div className="flex items-center gap-2">
                      Days Missed
                      {getSortIcon("missedDays")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider cursor-pointer hover:bg-primary/50"
                    onClick={() => handleSort("next_followup_date")}
                  >
                    <div className="flex items-center gap-2">
                      Follow-up Date
                      {getSortIcon("next_followup_date")}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                    Comment
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 dark:divide-gray-600">
                {currentData.map((lead: Lead) => {
                  const isExpanded = expandedRow === lead.leadId;
                  const days = lead.meta.missed_followups_count[0]?.days || 0;
                  const colorClass =
                    days > 20
                      ? "text-red-600 font-semibold"
                      : days > 10
                        ? "text-orange-600 font-medium"
                        : "text-yellow-600";
                  const statusColorMap: Record<string, string> = {
                    Processing: "bg-blue-100 text-blue-800",
                    Confirm: "bg-green-100 text-green-800",
                    Pending: "bg-yellow-100 text-yellow-800",
                  };

                  return (
                    <React.Fragment key={lead.leadId}>
                      <tr
                        onClick={() => toggleRow(lead.leadId)}
                        className={`hover:bg-white/20 text-foreground transition-colors cursor-pointer ${isExpanded ? "bg-white/10" : ""}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-foreground">
                          <div className="font-medium text-sm">
                            {lead.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-foreground text-sm">
                          {lead.phone_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColorMap[lead.status.title] || "bg-gray-100 text-gray-800"}`}
                          >
                            {lead.status.title}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-foreground text-sm">
                          {lead.assigned_to.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className={colorClass}>{days} days</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-foreground text-sm">
                          {new Date(lead.next_followup_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-foreground text-sm">
                          <div
                            className="max-w-xs truncate"
                            title={lead.comment}
                          >
                            {lead.comment}
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-slate-800/50 border-t-2 border-blue-500/30">
                          <td colSpan={7} className="px-8 py-6">
                            <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm">
                              <div className="flex">
                                <span className="font-semibold text-gray-300 min-w-[140px]">
                                  Customer Name:
                                </span>
                                <span className="text-foreground">
                                  {lead.name}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-semibold text-gray-300 min-w-[140px]">
                                  Email:
                                </span>
                                <span className="text-foreground">
                                  {lead.email || "-"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-semibold text-gray-300 min-w-[140px]">
                                  Mobile:
                                </span>
                                <span className="text-foreground">
                                  {lead.phone_number}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-semibold text-gray-300 min-w-[140px]">
                                  Company:
                                </span>
                                <span className="text-foreground">
                                  {lead.company_name || "-"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-semibold text-gray-300 min-w-[140px]">
                                  Address:
                                </span>
                                <span className="text-foreground">
                                  {lead.address || "-"}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-semibold text-gray-300 min-w-[140px]">
                                  Created By:
                                </span>
                                <span className="text-foreground">-</span>
                              </div>
                              <div className="flex">
                                <span className="font-semibold text-gray-300 min-w-[140px]">
                                  Status:
                                </span>
                                <span className="text-foreground">
                                  {lead.status.title}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-semibold text-gray-300 min-w-[140px]">
                                  Source:
                                </span>
                                <span className="text-foreground">
                                  {lead.meta.status || "-"}
                                </span>
                              </div>
                              <div className="flex col-span-2">
                                <span className="font-semibold text-gray-300 min-w-[140px]">
                                  Comment:
                                </span>
                                <span className="text-foreground">
                                  {lead.comment}
                                </span>
                              </div>
                              <div className="flex col-span-2">
                                <span className="font-semibold text-gray-300 min-w-[140px]">
                                  Labels:
                                </span>
                                <span className="text-foreground">
                                  {lead.labels
                                    .map((label: any) => label.title)
                                    .join(", ")}
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-primary px-6 py-4 border-t border-gray-300 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground">
                  Showing <span className="font-medium">{startIndex + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(endIndex, filteredAndSortedData.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {filteredAndSortedData.length}
                  </span>{" "}
                  results
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronsLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                  Page {currentPage} of {totalPages || 1}
                </span>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronsRight className="w-5 h-5" />
                </button>

                <select
                  value={pageSize}
                  onChange={(e) => changePageSize(Number(e.target.value))}
                  className="ml-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[10, 20, 30, 50].map((size) => (
                    <option key={size} value={size}>
                      Show {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MissedFollowupsTable;
