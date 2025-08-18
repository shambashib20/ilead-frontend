import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { labelService } from "@/features/leads/services/Lable.service";
import { useModalStore } from "@/store/useModalStore";
import type { Lables } from "@/features/leads/services/Lable.service";

import { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";
import CreateLabelForm from "./CreateLabelForm";
import Swal from "sweetalert2";

function LabelCard() {
  const [label, setLables] = useState<Lables[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [totalLables, setTotalLables] = useState(0);
  const openModal = useModalStore((state) => state.openModal);
  const [refreshKey] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await labelService.getPaginatedLables(page, limit);
      setLables(res.data.data.labels);
      const total = res.data.data.pagination.totalItems || 0;
      setTotalPages(Math.ceil(total / limit));
      setTotalLables(total);
    } catch (err) {
      console.error("Error fetching statuses:", err);
    } finally {
      setLoading(false);
    }
  };

  const setModalTitle = useModalStore((state) => state.setModalTitle);

  const handleOpenCreateModal = () => {
    setModalTitle?.("Create Labelv ");
    openModal({
      content: <CreateLabelForm />,
      type: "form",
    });
  };

  const handleEdit = (label: Lables) => {
    openModal({
      content: (
        <>
          <h2 className="text-lg font-semibold mb-4">Edit Label</h2>
          <CreateLabelForm refreshStatuses={fetchData} labelToEdit={label} />
        </>
      ),
      type: "form",
      customActions: <></>,
    });
  };

  const handleDelete = async (labelId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the label (hard delete)!.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await labelService.deleteLabel({ labelId });
        await fetchData();
        Swal.fire("Deleted!", "The status has been deleted!", "success");
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire("Error!", "Failed to delete the status.", "error");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, refreshKey]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold dark:text-white">Label List</h2>
        <Button onClick={handleOpenCreateModal}>Add New Label</Button>
      </div>

      <div className="rounded-md border dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="dark:text-gray-200">Title</TableHead>
              <TableHead className="dark:text-gray-200">Description</TableHead>
              <TableHead className="dark:text-gray-200">Actions</TableHead>
              {/* <TableHead className="dark:text-gray-200">Actions</TableHead> */}
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
            ) : label.length > 0 ? (
              label.map((label) => (
                <TableRow key={label._id}>
                  <TableCell className="dark:text-gray-100">
                    {label.title}
                  </TableCell>
                  <TableCell className="dark:text-gray-100">
                    {label.description}
                  </TableCell>

                  <TableCell className="flex gap-2 items-center">
                    <Pencil
                      size={18}
                      className="cursor-pointer text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(label)}
                    />

                    <Trash
                      size={18}
                      className="cursor-pointer text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(label._id)}
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
                  No statuses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground dark:text-gray-300">
          Showing {label.length} of {totalLables} total labels
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

export default LabelCard;
