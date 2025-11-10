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

import { useState } from "react";
import { Pencil, Tag, Trash } from "lucide-react";
import CreateLabelForm from "./CreateLabelForm";
import Swal from "sweetalert2";
import SkeletonTableLoader from "@/components/SkeletonTableLoader";
import { Input } from "@/components/ui/input";

function LabelCard() {
  const [label, setLables] = useState<Lables[]>([]);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [totalLables, setTotalLables] = useState(0);
  const openModal = useModalStore((state) => state.openModal);
  // const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await labelService.getPaginatedLables(page, limit);
      setLables(res.data.data.labels);
      const total = res.data.data.pagination.totalItems || 0;
      setTotalPages(Math.ceil(total / limit));
      setTotalLables(total);
    } catch (err) {
      //console.error("Error fetching statuses:", err);
    } finally {
      setLoading(false);
    }
  };

  const setModalTitle = useModalStore((state) => state.setModalTitle);

  const handleOpenCreateModal = () => {
    setModalTitle?.("Create Label ");
    openModal({
      content: <CreateLabelForm />,
      type: "form",
    });
  };

  const handleEdit = () => {
    openModal({
      content: (
        <div className="pt-6 px-4">
          <h2 className="text-lg font-semibold mb-4">Edit Label</h2>
          <CreateLabelForm
          // labelToEdit={label}
          // onSuccess={() => setRefreshKey((k) => k + 1)}
          />
        </div>
      ),
      type: "form",
      // customActions: <></>,
    });
  };

  const handleDelete = async (labelId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the label (hard delete)!.",
      // icon: "warning",
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
        //console.error("Delete failed:", error);
        Swal.fire("Error!", "Failed to delete the status.", "error");
      }
    }
  };

  // useEffect(() => {
  //   fetchData();
  // }, [page, refreshKey]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between bg-primary px-3 py-3 rounded-sm">
        <h2 className="text-xl font-semibold dark:text-white">Label List</h2>
        <div className="flex items-center gap-5">
          <Input placeholder="Search" className="dark:placeholder:text-white" />
          <Button onClick={handleOpenCreateModal}>+</Button>
        </div>
      </div>
      {loading ? (
        <SkeletonTableLoader />
      ) : (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4 w-20">
                  No.
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4">
                  Title
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4">
                  Allocated Users
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4 w-32">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex justify-center">
                      <SkeletonTableLoader />
                    </div>
                  </TableCell>
                </TableRow>
              ) : label.length > 0 ? (
                label.map((label, ind) => (
                  <TableRow
                    key={label._id}
                    className={`border-b border-gray-100 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30 ${
                      ind % 2 === 0
                        ? "bg-white dark:bg-gray-900"
                        : "bg-gray-50/50 dark:bg-gray-800/20"
                    }`}
                  >
                    <TableCell className="py-4">
                      <div className="text-gray-600 dark:text-gray-300 font-medium">
                        {ind + 1 + (page - 1) * limit}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 px-3 py-2 rounded-md text-sm font-medium border border-blue-200 dark:border-blue-800">
                        {label.title}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      {label?.meta?.assigned_agents?.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center -space-x-2">
                            {label.meta.assigned_agents
                              .slice(0, 3)
                              .map((item, index) => (
                                <div
                                  key={index}
                                  className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900"
                                >
                                  <span className="text-white text-xs font-medium">
                                    {item?.agent_id?.name
                                      ?.charAt(0)
                                      ?.toUpperCase() || "?"}
                                  </span>
                                </div>
                              ))}
                          </div>
                          {label.meta.assigned_agents.length > 3 && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              +{label.meta.assigned_agents.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                          No staff allocated
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit()}
                          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(label._id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Tag className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                      <div>
                        <div className="text-lg font-medium text-gray-500 dark:text-gray-400">
                          No labels found
                        </div>
                        <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          Get started by creating your first label
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex justify-between items-center bg-primary p-4 rounded-sm">
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
