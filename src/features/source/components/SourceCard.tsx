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
import { Pencil, Trash } from "lucide-react";
import Swal from "sweetalert2";
import SkeletonTableLoader from "@/components/SkeletonTableLoader";

function SourceCard() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [totalSources, setTotalSources] = useState(0);
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
      // type: "form",
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
      // type: "form",
    });
  };

  const handleDelete = async (sourceId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the source (hard delete)!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
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

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold dark:text-white">Source List</h2>
        <Button onClick={handleOpenCreateModal}>Add New Source</Button>
      </div>
      {loading ? (
        <SkeletonTableLoader />
      ) : (
        <div className=" border dark:border-gray-700">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="dark:text-gray-200">Title</TableHead>
                <TableHead className="dark:text-gray-200">
                  Description
                </TableHead>
                <TableHead className="dark:text-gray-200">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-4 dark:text-gray-300"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : sources.length > 0 ? (
                sources.map((source) => (
                  <TableRow key={source._id}>
                    <TableCell className="dark:text-gray-100">
                      {source.title}
                    </TableCell>
                    <TableCell className="dark:text-gray-100">
                      {source.description}
                    </TableCell>

                    <TableCell className="flex gap-2 items-center">
                      <Pencil
                        size={18}
                        className="cursor-pointer text-blue-600 hover:text-blue-800"
                        onClick={() => handleEdit(source)}
                      />

                      <Trash
                        size={18}
                        className="cursor-pointer text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(source._id)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-4 dark:text-gray-400"
                  >
                    No sources found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground dark:text-gray-300">
          Showing {sources.length} of {totalSources} total sources
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
            Prev
          </Button>
          <span className="text-sm dark:text-white">
            Page {page} of {totalPages}
          </span>
          <Button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SourceCard;
