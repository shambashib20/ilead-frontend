import { createFileRoute } from "@tanstack/react-router";
import {
  labelsQueryOptions,
  useLabels,
} from "@/features/labels/hooks/useLables";
import SkeletonTableLoader from "@/components/SkeletonTableLoader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash, UserPlus } from "lucide-react";
import { useState } from "react";
import CreateLabelForm from "@/features/labels/components/CreateLabelForm";
import { useModalStore } from "@/store/useModalStore";
// import type { Lables } from "@/features/labels/services/Label.service";
import { useDeleteLabel } from "@/features/labels/hooks/useDeleteLead";
import Swal from "sweetalert2";
import AssignUsersForm from "@/features/labels/components/AssignUsersForm";
import { AgentsQueryOptions } from "@/features/leads/hooks/useChatAgents";

export const Route = createFileRoute("/_dashboardLayout/label/")({
  component: RouteComponent,
  loader: (opts) => {
    opts.context.queryClient.ensureQueryData(labelsQueryOptions());
    opts.context.queryClient.ensureQueryData(AgentsQueryOptions());
  },
});

function RouteComponent() {
  const limit = 10;
  const [page, setPage] = useState(1);
  const { labels, isLoading } = useLabels(page, limit);
  const { deleteLabel } = useDeleteLabel();
  const totalItems = labels.pagination.totalItems;
  const totalPages = labels.pagination.totalPages;
  const openModal = useModalStore((state) => state.openModal);
  const setModalTitle = useModalStore((state) => state.setModalTitle);

  const handleCreateModal = () => {
    setModalTitle?.("Create Label ");
    openModal({
      content: <CreateLabelForm />,
      type: "form",
    });
  };

  const handleEdit = (label: any) => {
    openModal({
      content: (
        <div className="pt-6 px-4">
          <h2 className="text-lg font-semibold mb-4">Edit Label</h2>
          <CreateLabelForm label={label} />
        </div>
      ),
      type: "form",
    });
  };

  const handleUserAssign = async (labelId: string, chatAgents: any) => {
    setModalTitle?.("Create Label ");
    openModal({
      content: <AssignUsersForm selectedId={labelId} users={chatAgents} />,
      type: "form",
    });
  };

  const handleDelete = async (labelId: string) => {
    // console.log(labelId);
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
        await deleteLabel(labelId);
        // await fetchData();
        // Swal.fire("Deleted!", "The status has been deleted!", "success");
      } catch (error) {
        // console.error("Delete failed:", error);
        Swal.fire("Error!", "Failed to delete the status.", "error");
      }
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between bg-primary px-3 py-3 rounded-sm">
        <h2 className="text-xl font-semibold dark:text-white">Label List</h2>
        <div className="flex items-center gap-5">
          <Input placeholder="Search" className="dark:placeholder:text-white" />
          <Button onClick={handleCreateModal}>+</Button>
        </div>
      </div>
      {isLoading ? (
        <SkeletonTableLoader />
      ) : (
        <div className="bg-primary rounded-sm  ">
          <Table>
            <TableHeader className="">
              <TableRow className="hover:bg-primary">
                <TableHead className="dark:text-gray-200">No.</TableHead>
                <TableHead className="dark:text-gray-200 ">Title</TableHead>

                <TableHead className="dark:text-gray-200">Actions</TableHead>
                <TableHead className="dark:text-gray-200 ">
                  Allocated Users
                </TableHead>
                {/* <TableHead className="dark:text-gray-200">Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-4 text-gray-500"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : labels?.labels?.length > 0 ? (
                labels?.labels.map((label, ind) => (
                  <TableRow key={label._id}>
                    <TableCell className="  dark:text-background  ">
                      {ind + 1}
                    </TableCell>
                    <TableCell className="dark:text-background">
                      <span
                        style={{
                          background: label.meta?.color_code,
                          color: label.meta?.color_code && "#fff",
                        }}
                        className={`bg-gray-100 px-4 py-2 rounded-sm `}
                      >
                        {label.title}
                      </span>
                    </TableCell>

                    <TableCell className="flex gap-2 items-center">
                      {label?.meta?.is_editable && (
                        <Pencil
                          size={18}
                          className="cursor-pointer text-blue-600 hover:text-blue-800"
                          onClick={() => handleEdit(label)}
                        />
                      )}
                      {label?.meta?.is_editable && (
                        <Trash
                          size={18}
                          className="cursor-pointer text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(label._id)}
                        />
                      )}

                      <UserPlus
                        size={18}
                        className="cursor-pointer text-purple-600 hover:text-purple-800"
                        onClick={() =>
                          handleUserAssign(
                            label?._id,
                            label?.meta?.assigned_agents
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className="dark:text-background">
                      {Array.isArray(label?.meta?.assigned_agents) &&
                      label.meta.assigned_agents.length > 0 ? (
                        <ul className="flex items-center -space-x-5">
                          {label.meta.assigned_agents.map((item, index) => (
                            <li
                              title={item.agent_id?.name}
                              key={index}
                              className="border border-gray-200 rounded-full p-1 bg-white hover:scale-130 transition hover:relative hover:z-50"
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
          Showing {labels?.labels.length} of {totalItems} total labels
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
            Prev
          </Button>
          <span className="text-sm dark:text-white">
            Page {page} of {totalPages}
          </span>
          <Button onClick={() => setPage(page + 1)} disabled={page === 0}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
