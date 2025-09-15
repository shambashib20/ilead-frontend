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
  const [refreshKey, setRefreshKey] = useState(0);

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
    setModalTitle?.("Create Label ");
    openModal({
      content: (
        <CreateLabelForm onSuccess={() => setRefreshKey((k) => k + 1)} />
      ),
      type: "form",
    });
  };

  const handleEdit = (label: Lables) => {
    openModal({
      content: (
        <div className="pt-6 px-4">
          <h2 className="text-lg font-semibold mb-4">Edit Label</h2>
          <CreateLabelForm
            labelToEdit={label}
            onSuccess={() => setRefreshKey((k) => k + 1)}
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
        <div className="bg-primary rounded-sm  ">
          <Table>
            <TableHeader className="">
              <TableRow className="hover:bg-primary">
                <TableHead className="dark:text-gray-200  ">No.</TableHead>
                <TableHead className="dark:text-gray-200 ">Title</TableHead>

                <TableHead className="dark:text-gray-200">Actions</TableHead>
                <TableHead className="dark:text-gray-200 ">
                  Allocated Users
                </TableHead>
                {/* <TableHead className="dark:text-gray-200">Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-4 text-gray-500"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : label.length > 0 ? (
                label.map((label, ind) => (
                  <TableRow key={label._id}>
                    <TableCell className="  dark:text-background  ">
                      {ind + 1}
                    </TableCell>
                    <TableCell className="dark:text-background">
                      <span className="bg-gray-100 px-4 py-2 rounded-sm">
                        {label.title}
                      </span>
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
                    <TableCell className="dark:text-background">
                      {label?.meta?.assigned_agents?.length > 0 ? (
                        <ul className="flex items-center -space-x-5">
                          {label.meta.assigned_agents.map((item, index) => (
                            <li
                              key={index}
                              className="border border-gray-200 rounded-full p-1 bg-white"
                            >
                              <span className="bg-gray-300 h-8 w-8 rounded-full grid place-content-center font-semibold">
                                {item?.agent_id?.name?.charAt(0) ?? "?"}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No staffs allocated
                        </p>
                      )}
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
