// SourceCard.tsx
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { sourceService } from "@/features/leads/services/Source.service";
import { useModalStore } from "@/store/useModalStore";
import type { Source } from "@/features/leads/services/Source.service";

import { useEffect, useState } from "react";
import CreateSourceForm from "./CreateSourceForm";
import {
  Pencil,
  Trash,
  Plus,
  Search,
  SignalHigh,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";
import SkeletonTableLoader from "@/components/SkeletonTableLoader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

function SourceCard() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [totalSources, setTotalSources] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await sourceService.getPaginatedSources(page, limit);
      setSources(res.data.data.sources);
      const total = res.data.data.pagination.totalItems || 0;
      setTotalPages(Math.ceil(total / limit));
      setTotalSources(total);
    } catch (err) {
      console.error("Error fetching sources:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch sources",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const setModalTitle = useModalStore((state) => state.setModalTitle);

  const handleOpenCreateModal = () => {
    setModalTitle?.("Create Source");
    openModal({
      content: (
        <CreateSourceForm
          onSuccess={() => {
            setRefreshKey((prev) => prev + 1);
            closeModal();
          }}
        />
      ),
    });
  };

  const handleEdit = (source: Source) => {
    setModalTitle?.("Edit Source");
    openModal({
      content: (
        <CreateSourceForm
          sourceToEdit={source}
          onSuccess={() => {
            setRefreshKey((prev) => prev + 1);
            closeModal();
          }}
        />
      ),
    });
  };

  const handleDelete = async (sourceId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the source (hard delete)!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await sourceService.deleteSource({ sourceId });
        setRefreshKey((prev) => prev + 1);
        Swal.fire({
          title: "Deleted!",
          text: "The source has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error: any) {
        Swal.fire({
          title: "Error!",
          text: error.response?.data?.message || "Failed to delete the source.",
          icon: "error",
        });
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, refreshKey]);

  const filteredSources = sources.filter(
    (source) =>
      source.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-primary px-4 py-4 rounded-lg mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <SignalHigh className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sources
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your lead sources
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="text-right hidden sm:block">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalSources}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Sources
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 dark:placeholder:text-gray-400 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              />
            </div>
            <Button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Source</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        {loading ? (
          <div className="p-8">
            <SkeletonTableLoader />
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-primary">
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4">
                  Source
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4">
                  Description
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4 w-32">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-primary/50">
              {filteredSources.length > 0 ? (
                filteredSources.map((source, index) => (
                  <TableRow
                    key={source._id}
                    className={`border-b border-gray-100 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30 `}
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {source.title?.charAt(0).toUpperCase() || "S"}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {source.title}
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 text-xs mt-1"
                          >
                            Source
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-gray-600 dark:text-gray-300 max-w-md">
                        {source.description || (
                          <span className="text-gray-400 dark:text-gray-500 italic">
                            No description provided
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(source)}
                          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(source._id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <SignalHigh className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                      <div>
                        <div className="text-lg font-medium text-gray-500 dark:text-gray-400">
                          {searchQuery
                            ? "No matching sources found"
                            : "No sources found"}
                        </div>
                        <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          {searchQuery
                            ? "Try adjusting your search"
                            : "Get started by creating your first source"}
                        </div>
                      </div>
                      {!searchQuery && (
                        <Button
                          onClick={handleOpenCreateModal}
                          className="mt-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="h-4 w-4" />
                          Add Source
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {filteredSources.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalSources}
            </span>{" "}
            sources
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-2 border-gray-300 dark:border-gray-600"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 ${
                      page === pageNum
                        ? "bg-blue-600 text-white border-blue-600"
                        : "text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="flex items-center gap-2 border-gray-300 dark:border-gray-600"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SourceCard;
