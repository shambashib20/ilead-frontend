import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Eye, Activity } from "lucide-react";
import type { Property } from "../services/workspaceMaster.service";

interface WorkspaceTableProps {
  properties: Property[];
  page: number;
  setPage: (page: number) => void;
  limit: number;
  pagination: any;
  isLoading: boolean;
}

function WorkspaceTable({
  properties,
  page,
  setPage,
  limit,
  pagination,
  isLoading,
}: WorkspaceTableProps) {
  // Extract pagination data
  const paginationData = pagination || {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  const { totalItems, totalPages, hasNextPage, hasPrevPage } = paginationData;

  const handleEdit = (property: Property) => {
    console.log("Edit workspace:", property);
    // Add your edit logic here
  };

  const handleDelete = (propertyId: string) => {
    console.log("Delete workspace:", propertyId);
    // Add your delete logic here
  };

  const handleView = (property: Property) => {
    console.log("View workspace:", property);
    // Add your view logic here
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadgeColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const calculateUsagePercentage = (property: Property) => {
    if (!property.usage_limits || property.usage_limits === 0) return 0;
    const percentage =
      ((property.usage_count || 0) / property.usage_limits) * 100;
    return Math.min(percentage, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
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
                <TableHead className="dark:text-gray-200">Name</TableHead>
                <TableHead className="dark:text-gray-200">
                  Description
                </TableHead>
                <TableHead className="dark:text-gray-200">Usage</TableHead>
                <TableHead className="dark:text-gray-200">Status</TableHead>
                <TableHead className="dark:text-gray-200">Created At</TableHead>
                <TableHead className="dark:text-gray-200">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-primary/60">
              {properties && properties.length > 0 ? (
                properties.map((property, ind) => {
                  const usagePercentage = calculateUsagePercentage(property);
                  return (
                    <TableRow key={property._id} className="py-2">
                      <TableCell className="dark:text-white px-5 py-6">
                        {ind + 1 + (page - 1) * limit}
                      </TableCell>
                      <TableCell className="dark:text-white py-6 font-medium">
                        {property.name}
                      </TableCell>
                      <TableCell className="dark:text-white py-6 max-w-xs">
                        <p className="truncate" title={property.description}>
                          {property.description || "No description"}
                        </p>
                      </TableCell>
                      <TableCell className="py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Activity
                              size={14}
                              className="dark:text-gray-400"
                            />
                            <span className="text-sm dark:text-white">
                              {property.usage_count || 0} /{" "}
                              {property.usage_limits || 0}
                            </span>
                          </div>
                          {property.usage_limits && (
                            <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getUsageColor(
                                  usagePercentage
                                )}`}
                                style={{ width: `${usagePercentage}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-6">
                        {property.status ? (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                              property.status
                            )}`}
                          >
                            {property.status}
                          </span>
                        ) : (
                          <span className="text-sm dark:text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="dark:text-white py-6">
                        {formatDate(property.createdAt)}
                      </TableCell>
                      <TableCell className="py-6">
                        <div className="flex gap-2 items-center">
                          <Eye
                            size={18}
                            className="cursor-pointer text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            onClick={() => handleView(property)}
                          />
                          <Pencil
                            size={18}
                            className="cursor-pointer text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                            onClick={() => handleEdit(property)}
                          />
                          <Trash
                            size={18}
                            className="cursor-pointer text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            onClick={() => handleDelete(property._id)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 dark:text-gray-400"
                  >
                    No workspaces found.
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
          Showing {properties?.length || 0} of {totalItems} total workspaces
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
            Page {page} of {totalPages || 10}
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

export default WorkspaceTable;
