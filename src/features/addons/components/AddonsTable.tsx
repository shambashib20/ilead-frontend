import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Eye } from "lucide-react";
import type { Addon } from "../services/addons.services";
import { useModalStore } from "@/store/useModalStore";
import CreateAddon from "./CreateAddon";

interface AddonTableProps {
  addons: Addon[];
  page: number;
  setPage: (page: number) => void;
  limit: number;
  pagination: any;
  isLoading: boolean;
}

function AddonTable({
  addons,
  page,
  setPage,
  limit,
  pagination,
  isLoading,
}: AddonTableProps) {
  // Extract pagination data
  const paginationData = pagination || {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };
  const openModal = useModalStore((state) => state.openModal);
  const setModalTitle = useModalStore((state) => state.setModalTitle);

  const { totalItems, totalPages, hasNextPage, hasPrevPage } = paginationData;

  const handleEditAddon = (addon: Addon) => {
    setModalTitle?.("Edit Addon");
    openModal({
      content: (
        <CreateAddon
          addon={{
            _id: addon._id,
            title: addon.title,
            description: addon.description,
            value: String(addon.value),
            status: addon.status,
          }}
        />
      ),
      type: "form",
    });
  };

  const handleDelete = (addonId: string) => {
    console.log("Delete addon:", addonId);
    // Add your delete logic here
  };

  const handleView = (addon: Addon) => {
    console.log("View addon:", addon);
    // Add your view logic here
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="text-center py-8 dark:text-white">Loading...</div>
      ) : (
        <div className="rounded-sm overflow-hidden shadow-lead">
          <Table>
            <TableHeader className="">
              <TableRow className="bg-primary hover:bg-white dark:hover:bg-primary/80">
                <TableHead className="dark:text-gray-200 px-5">No.</TableHead>
                <TableHead className="dark:text-gray-200">Title</TableHead>
                <TableHead className="dark:text-gray-200">
                  Description
                </TableHead>
                <TableHead className="dark:text-gray-200">Value</TableHead>
                <TableHead className="dark:text-gray-200">Status</TableHead>
                <TableHead className="dark:text-gray-200">Created At</TableHead>
                <TableHead className="dark:text-gray-200">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-primary/60">
              {addons && addons.length > 0 ? (
                addons.map((addon, ind) => (
                  <TableRow key={addon._id} className="py-2">
                    <TableCell className="dark:text-white px-5 py-6">
                      {ind + 1 + (page - 1) * limit}
                    </TableCell>
                    <TableCell className="dark:text-white py-6 font-medium">
                      {addon.title}
                    </TableCell>
                    <TableCell className="dark:text-white py-6 max-w-xs">
                      <p className="truncate" title={addon.description}>
                        {addon.description}
                      </p>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(addon.value)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                          addon.status
                        )}`}
                      >
                        {addon.status}
                      </span>
                    </TableCell>
                    <TableCell className="dark:text-white py-6">
                      {formatDate(addon.createdAt)}
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex gap-2 items-center">
                        <Eye
                          size={18}
                          className="cursor-pointer text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={() => handleView(addon)}
                        />
                        <Pencil
                          size={18}
                          className="cursor-pointer text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                          onClick={() => handleEditAddon(addon)}
                        />
                        <Trash
                          size={18}
                          className="cursor-pointer text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => handleDelete(addon._id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 dark:text-gray-400"
                  >
                    No addons found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center bg-primary p-4 rounded-sm mt-2">
        <div className="text-sm text-muted-foreground dark:text-gray-300">
          Showing {addons?.length || 0} of {totalItems} total addons
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={!hasPrevPage || page === 1}
            variant="outline"
          >
            Prev
          </Button>
          <span className="text-sm dark:text-white">
            Page {page} of {totalPages || 1}
          </span>
          <Button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={!hasNextPage || page === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}

export default AddonTable;
