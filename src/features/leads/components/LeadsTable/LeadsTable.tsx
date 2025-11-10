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

import { useModalStore } from "@/store/useModalStore";
import { useTheme } from "@/contexts/ThemeProvider";
import { getCardActions } from "@/utils/cardActions";
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
  const { openModal, setModalTitle, setData, setModalSize } = useModalStore();
  const role =
    typeof window !== "undefined"
      ? (localStorage.getItem("role") ?? undefined)
      : undefined;
  const actions = getCardActions(role);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const statusColors = Array.from(statusColorMap.values());
  const { theme } = useTheme();
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await statusService.status();
        setStatuses(res.data.data);
      } catch (err) {
        //console.error("Failed to load statuses:", err);
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
      //console.error(err);

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
    <div className="rounded-sm shadow-sm  overflow-hidden mt-10">
      <div className="overflow-auto max-h-[65vh]">
        <Table className="min-w-full text-sm bg-primary">
          <TableHeader className="sticky top-0 z-10  hover:bg-primary">
            <TableRow className="hover:bg-primary">
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
              <TableHead className="text-left px-4 py-3 text-zinc-700 dark:text-zinc-200">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead, index) => (
              <>
                <TableRow key={lead._id}>
                  <TableCell className="px-4 py-3 text-zinc-700 dark:text-zinc-300 font-medium">
                    {(page - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell
                    className="text-right"
                    onClick={() => toggleExpand(lead._id)}
                  >
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
                      className="border-none outline-none text-sm w-30 "
                    >
                      <option value="" disabled className="bg-primary">
                        Select status
                      </option>
                      {statuses.map((status) => (
                        <option
                          key={status._id}
                          value={status._id}
                          className="bg-primary"
                        >
                          {status.title}
                        </option>
                      ))}
                    </select>
                  </TableCell>

                  <TableCell>
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
                            <Icon
                              size={16}
                              color={theme === "dark" ? color : dark}
                            />
                            {label === "Lead Follow Up" && (
                              <span className="absolute -top-1 -right-1 bg-gray-300 dark:bg-gray-800 text-black dark:text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                                {lead.follow_ups?.length ?? 0}
                              </span>
                            )}
                          </div>
                        </button>
                      )
                    )}
                  </TableCell>
                </TableRow>

                {expandedRowId === lead._id && (
                  <TableRow className="bg-zinc-50 dark:bg-card">
                    <TableCell colSpan={7} className="p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                        {/* Lead Name */}
                        <div className="flex gap-2">
                          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                            Lead Name :
                          </h4>
                          <p className="text-zinc-700 dark:text-zinc-300">
                            {lead.name || "N/A"}
                          </p>
                        </div>

                        {/* Email */}
                        <div className="flex gap-2">
                          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                            Email
                          </h4>
                          <p className="text-zinc-700 dark:text-zinc-300">
                            {lead.email || "N/A"}
                          </p>
                        </div>

                        {/* Phone Number */}
                        <div className="flex gap-2">
                          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                            Phone Number
                          </h4>
                          <p className="text-zinc-700 dark:text-zinc-300">
                            {lead.phone_number || "N/A"}
                          </p>
                        </div>

                        {/* Labels */}
                        <div className="flex gap-2">
                          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                            Labels
                          </h4>
                          {lead.labels?.length ? (
                            <div className="flex flex-wrap gap-2">
                              {lead.labels.map((label, idx) => {
                                const bgColor =
                                  statusColors[idx % statusColors.length];
                                return (
                                  <span
                                    key={label._id || label.title}
                                    style={{ backgroundColor: bgColor }}
                                    className="text-white text-xs px-3 py-1 rounded-full"
                                  >
                                    {label.title}
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="bg-gray-600 text-white text-xs px-3 py-1 rounded-full">
                              No Label
                            </span>
                          )}
                        </div>

                        {/* Created By */}
                        <div className="flex gap-2">
                          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                            Created By :
                          </h4>
                          <p className="text-zinc-700 dark:text-zinc-300">
                            {lead.assigned_by?.name || "N/A"}
                          </p>
                        </div>

                        {/* Reference */}
                        <div className="flex gap-2">
                          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                            Reference :
                          </h4>
                          <p className="text-zinc-700 dark:text-zinc-300">
                            {lead.reference || "N/A"}
                          </p>
                        </div>

                        {/* Comment */}
                        <div className="sm:col-span-2  flex gap-2">
                          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                            Comment
                          </h4>
                          <p className="text-zinc-700 dark:text-zinc-300">
                            {lead.comment || "N/A"}
                          </p>
                        </div>

                        {/* Address */}
                        <div className="sm:col-span-2  flex gap-2">
                          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                            Address
                          </h4>
                          <p className="text-zinc-700 dark:text-zinc-300">
                            {lead.address || "N/A"}
                          </p>
                        </div>
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
              <option key={size} value={size} className="bg-primary">
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
