// StatusCard.tsx
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useModalStore } from "@/store/useModalStore";
import { Pencil, Trash } from "lucide-react";
import CreateStatusForm from "./CreateStatusForm";
import Swal from "sweetalert2";
import SkeletonTableLoader from "@/components/SkeletonTableLoader";
import { Input } from "@/components/ui/input";
import { useStatus } from "../hooks/useStatus";
import { useDeleteStatus } from "../hooks/useDeleteStatus";

function StatusCard() {
  const [page, setPage] = useState(1);
  const { status, isLoading } = useStatus(page, 10);

  const totalItems = status.pagination.total;
  const totalPages = status.pagination.totalPages;

  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const setModalSize = useModalStore((state) => state.setModalSize);
  const setModalTitle = useModalStore((state) => state.setModalTitle);
  const { deleteStatus } = useDeleteStatus();

  const [search, setSearch] = useState("");

  const filteredStatuses = useMemo(() => {
    const pageItems = status?.statuses ?? [];
    const q = (search ?? "").toString().trim().toLowerCase();
    if (!q) return pageItems;
    return pageItems.filter((s: any) => {
      const candidates = [
        s?.title,
        s?.description,
        s?.meta?.color_code,
        s?._id,
      ];
      for (const c of candidates) {
        if (typeof c === "string" && c.toLowerCase().includes(q)) return true;
      }
      // fallback
      try {
        return JSON.stringify(s).toLowerCase().includes(q);
      } catch {
        return false;
      }
    });
  }, [status, search]);

  const handleOpenCreateModal = () => {
    setModalTitle?.("Add Status");
    setModalSize?.("sm");
    openModal({
      content: (
        <div className="px-2">
          <CreateStatusForm />
        </div>
      ),
      type: "info",
      customActions: (
        <div>
          <Button variant={"destructive"} onClick={() => closeModal()}>
            Close
          </Button>
        </div>
      ),
    });
  };

  const handleEdit = (status: any) => {
    setModalTitle?.("Edit Status");
    setModalSize?.("sm");
    openModal({
      content: (
        <div className="px-2">
          <CreateStatusForm status={status} />
        </div>
      ),
      type: "info",
      customActions: (
        <div>
          <Button variant={"destructive"} onClick={() => closeModal()}>
            Close
          </Button>
        </div>
      ),
    });
  };

  const handleDelete = async (statusId: string) => {
    // console.log(labelId);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the Status (hard delete)!.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await deleteStatus(statusId);
        // await fetchData();
        // Swal.fire("Deleted!", "The status has been deleted!", "success");
      } catch (error) {
        // console.error("Delete failed:", error);
        Swal.fire("Error!", "Failed to delete the status.", "error");
      }
    }
  };

  return (
    <div className="mt-10 space-y-4">
      <div className="flex items-center justify-between bg-primary px-3 py-3 rounded-sm shadow-lead">
        <h2 className="text-xl font-semibold dark:text-white">Status List</h2>
        <div className="flex items-center gap-5">
          <Input
            placeholder="Search"
            className="dark:placeholder:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSearch("");
            }}
          />
          <Button onClick={() => handleOpenCreateModal()}>+</Button>
        </div>
      </div>
      {isLoading ? (
        <SkeletonTableLoader />
      ) : (
        <div className="rounded-sm shadow-lead ">
          <Table>
            <TableHeader className="bg-primary">
              <TableRow>
                <TableHead className="dark:text-gray-200 ps-4">No</TableHead>
                <TableHead className="dark:text-gray-200">Title</TableHead>

                <TableHead className="dark:text-gray-200">
                  Description
                </TableHead>
                <TableHead className="dark:text-gray-200">Status</TableHead>
                <TableHead className="dark:text-gray-200">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-primary/50">
              {filteredStatuses.length > 0 ? (
                filteredStatuses.map((st: any, ind: any) => (
                  <TableRow key={st._id}>
                    <TableCell className="dark:text-white ps-6 py-6 ">
                      {ind + 1 + (page - 1)}
                    </TableCell>
                    <TableCell className="dark:text-white py-6">
                      <span
                        className=" px-3 py-2 rounded-md"
                        style={{
                          backgroundColor: st?.meta?.color_code
                            ? st?.meta?.color_code
                            : "#777",
                          color: "#fff",
                        }}
                      >
                        {st.title}
                      </span>
                    </TableCell>

                    <TableCell className="dark:text-white py-6">
                      {st.description}
                    </TableCell>

                    <TableCell className="dark:text-white py-6">
                      <Badge
                        variant={st.meta?.is_active ? "default" : "secondary"}
                        className={
                          st.meta?.is_active
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-gray-500 hover:bg-gray-600 text-white"
                        }
                      >
                        {st.meta?.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    <TableCell className="flex gap-2 items-center">
                      {st.meta?.is_editable && (
                        <>
                          <Pencil
                            size={18}
                            className="cursor-pointer text-blue-600 hover:text-blue-800"
                            onClick={() => handleEdit(st)}
                          />
                          <Trash
                            size={18}
                            className="cursor-pointer text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(st._id)}
                          />
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center  dark:text-white py-6"
                  >
                    No statuses found on this page.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground dark:text-gray-300">
          Showing {filteredStatuses.length} of {totalItems} total statuses
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Prev
          </Button>
          <span className="text-sm dark:text-white">
            Page {page} of {totalPages}
          </span>
          <Button
            onClick={() => setPage(Math.min(page + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default StatusCard;
