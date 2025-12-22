
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash,
  Eye,
  Paperclip,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import type { Campaign } from "../services/campaign.service";

interface CampaignTableProps {
  campaigns: Campaign[];
  page: number;
  setPage: (page: number) => void;
  limit: number;
  pagination: any;
  isLoading: boolean;
}

function CampaignTable({
  campaigns,
  page,
  setPage,
  limit,
  pagination,
  isLoading,
}: CampaignTableProps) {
  // Extract pagination data
  const paginationData = pagination || {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  const { totalItems, totalPages, hasNextPage, hasPrevPage } = paginationData;

  const handleEdit = (campaign: Campaign) => {
    console.log("Edit campaign:", campaign);
    // Add your edit logic here
  };

  const handleDelete = (campaignId: string) => {
    console.log("Delete campaign:", campaignId);
    // Add your delete logic here
  };

  const handleView = (campaign: Campaign) => {
    console.log("View campaign:", campaign);
    // Add your view logic here
  };

  const handleToggleActive = (campaign: Campaign) => {
    console.log("Toggle active:", campaign);
    // Add your toggle active logic here
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "email":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "sms":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "whatsapp":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
      case "notification":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
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
                <TableHead className="dark:text-gray-200">Type</TableHead>
                <TableHead className="dark:text-gray-200">Org Name</TableHead>
                <TableHead className="dark:text-gray-200">
                  Attachments
                </TableHead>
                <TableHead className="dark:text-gray-200">Status</TableHead>
                <TableHead className="dark:text-gray-200">Created At</TableHead>
                <TableHead className="dark:text-gray-200">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-primary/60">
              {campaigns && campaigns.length > 0 ? (
                campaigns.map((campaign, ind) => (
                  <TableRow key={campaign._id} className="py-2">
                    <TableCell className="dark:text-white px-5 py-6">
                      {ind + 1 + (page - 1) * limit}
                    </TableCell>
                    <TableCell className="dark:text-white py-6 font-medium">
                      {campaign.title}
                    </TableCell>
                    <TableCell className="py-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(
                          campaign.type
                        )}`}
                      >
                        {campaign.type}
                      </span>
                    </TableCell>
                    <TableCell className="dark:text-white py-6 max-w-xs">
                      <p className="truncate" title={campaign.property_id.name}>
                        {campaign.property_id.name}
                      </p>
                    </TableCell>
                    <TableCell className="py-6">
                      {campaign.attachments &&
                      campaign.attachments.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <Paperclip size={14} className="dark:text-gray-400" />
                          <span className="text-sm dark:text-white">
                            {campaign.attachments.length}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm dark:text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="py-6">
                      <button
                        onClick={() => handleToggleActive(campaign)}
                        className="flex items-center gap-1"
                      >
                        {campaign.meta?.is_active ? (
                          <>
                            <ToggleRight
                              size={24}
                              className="text-green-600 dark:text-green-400"
                            />
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                              Active
                            </span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft
                              size={24}
                              className="text-gray-400 dark:text-gray-500"
                            />
                            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                              Inactive
                            </span>
                          </>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="dark:text-white py-6">
                      {formatDate(campaign.createdAt)}
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex gap-2 items-center">
                        <Eye
                          size={18}
                          className="cursor-pointer text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={() => handleView(campaign)}
                        />
                        <Pencil
                          size={18}
                          className="cursor-pointer text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                          onClick={() => handleEdit(campaign)}
                        />
                        <Trash
                          size={18}
                          className="cursor-pointer text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => handleDelete(campaign._id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 dark:text-gray-400"
                  >
                    No campaigns found.
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
          Showing {campaigns?.length || 0} of {totalItems} total campaigns
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

export default CampaignTable;
