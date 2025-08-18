import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Lead } from "../../types";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import { formatDateTime } from "../../utils/formatTime";
import { useEffect, useState } from "react";
import { statusService } from "../../services/Status.service";
import { LeadsModule, type Status } from "../../services/LeadsModule.service";
import Swal from "sweetalert2";

import { statusColorMap } from "../../utils/constants";
const leadsApi = new LeadsModule();

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type Props = {
  leads: Lead[];
  setIsTableView: (val: boolean) => void;
  pagination: Pagination;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  onStatusChange?: (leadId: string, statusId: string) => void;
};

export default function LeadsTable({
  leads,
  pagination,
  onPageChange,
  onLimitChange,
}: Props) {
  const { page, limit, totalPages, hasNextPage, hasPrevPage } = pagination;
  const [statuses, setStatuses] = useState<Status[]>([]);

  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const statusColors = Array.from(statusColorMap.values());
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await statusService.status();
        setStatuses(res.data.data);
      } catch (err) {
        console.error("Failed to load statuses:", err);
      }
    };

    fetchStatuses();
  }, []);

  const handleStatusChange = async (leadId: string, newStatusId: string) => {
    try {
      await leadsApi.updateLeadStatus({ leadId, statusId: newStatusId });

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: "The lead's status was updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      // Optionally: refetch leads if needed
      // await fetchLeads();
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Could not update the lead's status. Please try again.",
      });
    }
  };

  const toggleExpand = (leadId: string) => {
    setExpandedRowId(expandedRowId === leadId ? null : leadId);
  };

  return (
    <div className="rounded-2xl shadow-sm border dark:border-zinc-800 overflow-hidden mt-10">
      <div className="overflow-auto max-h-[65vh]">
        <Table className="min-w-full text-sm">
          <TableHeader className="sticky top-0 z-10">
            <TableRow>
              <TableHead className="text-left px-4 py-3 text-zinc-700 dark:text-zinc-200">
                S/N
              </TableHead>
              <TableHead className="px-4 py-3"></TableHead>
              <TableHead className="text-left px-4 py-3 text-zinc-700 dark:text-zinc-200">
                Customer Name
              </TableHead>
              <TableHead className="text-left px-4 py-3 text-zinc-700 dark:text-zinc-200">
                Created On
              </TableHead>

              <TableHead className="text-left px-4 py-3 text-zinc-700 dark:text-zinc-200">
                Phone
              </TableHead>

              <TableHead className="text-left px-4 py-3 text-zinc-700 dark:text-zinc-200">
                Assigned To
              </TableHead>
              <TableHead className="text-left px-4 py-3 text-zinc-700 dark:text-zinc-200">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead, index) => (
              <>
                <TableRow key={lead._id} onClick={() => toggleExpand(lead._id)}>
                  <TableCell className="px-4 py-3 text-zinc-700 dark:text-zinc-300 font-medium">
                    {(page - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell className="text-right">
                    {expandedRowId === lead._id ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium text-zinc-900 dark:text-white">
                    {lead.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium text-zinc-900 dark:text-white">
                    {formatDateTime(lead.createdAt)}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-zinc-900 dark:text-white">
                    {lead.phone_number}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-zinc-900 dark:text-white">
                    {lead.assigned_to?.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-zinc-900 dark:text-white">
                    <select
                      value={lead.status?._id || ""}
                      onChange={(e) =>
                        handleStatusChange(lead._id, e.target.value)
                      }
                      className="border-none outline-none text-sm"
                    >
                      <option value="" disabled>
                        Select status
                      </option>
                      {statuses.map((status) => (
                        <option key={status._id} value={status._id}>
                          {status.title}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                </TableRow>

                {expandedRowId === lead._id && (
                  <TableRow className="bg-zinc-50 dark:bg-zinc-900">
                    <TableCell colSpan={7} className="p-4">
                      <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                        <div>
                          <strong>Lead Name:</strong>{" "}
                          <strong>{lead.name || "N/A"}</strong>
                        </div>
                        <div>
                          <strong>Email:</strong>{" "}
                          <strong>{lead.email || "N/A"}</strong>
                        </div>
                        <div>
                          <strong>Phone Number:</strong>{" "}
                          <strong>{lead.phone_number || "N/A"}</strong>
                        </div>
                        <div>
                          <strong>Labels:</strong>{" "}
                          {lead.labels?.length > 0 ? (
                            lead.labels.map((label, idx) => {
                              const bgColor =
                                statusColors[idx % statusColors.length];
                              return (
                                <span
                                  key={label._id || label.title}
                                  style={{ backgroundColor: bgColor }}
                                  className="text-white text-xs px-3 mr-2 py-1 rounded inline-block"
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
                        <div>
                          <strong>Created By:</strong>{" "}
                          {lead.assigned_by?.name || "N/A"}
                        </div>
                        <div>
                          <strong>Reference:</strong> {lead.reference || "N/A"}
                        </div>
                        <div>
                          <strong>Comment:</strong> {lead.comment || "N/A"}
                        </div>
                        <div>
                          <strong>Address:</strong> {lead.address || "N/A"}
                        </div>
                        {/* <div>
                          <strong>Notes:</strong> {lead.notes || "No notes"}
                        </div> */}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center gap-4 px-6 py-4  border-t dark:border-zinc-700">
        {/* Left side: navigation buttons */}
        <div className="flex items-center gap-4">
          <Button
            size="sm"
            disabled={!hasPrevPage}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="text-sm text-muted-foreground dark:text-zinc-300">
            Page <span className="font-semibold">{page}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </div>
        </div>

        {/* Middle: Showing count */}
        <div className="text-sm text-muted-foreground dark:text-zinc-300">
          Showing <span className="font-semibold">{leads.length}</span> items
          out of <span className="font-semibold">{pagination.total}</span>
        </div>

        {/* Right: Items per page */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="limit"
            className="text-sm text-muted-foreground dark:text-zinc-300"
          >
            Items per page:
          </label>
          <select
            id="limit"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="bg-transparent border rounded px-2 py-1 text-sm"
          >
            {[5, 10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <Button
            size="sm"
            disabled={!hasNextPage}
            onClick={() => onPageChange(page + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
