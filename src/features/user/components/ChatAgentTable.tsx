import { useEffect, useState } from "react";
import {
  chatAgentService,
  type Pagination,
  type Agent,
} from "@/features/leads/services/ChatAgents.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useModalStore } from "@/store/useModalStore";
import CreateUserModal from "./CreateUserModal";
import DeactivateUserModal from "./DeactivateUserModal";
import SkeletonTableLoader from "@/components/SkeletonTableLoader";
import Swal from "sweetalert2";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Mail,
  Phone,
  Calendar,
  UserPlus,
} from "lucide-react";

function ChatAgentTable() {
  const [chatAgents, setChatAgents] = useState<Agent[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [totalStatuses, setTotalStatuses] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const { pushModal } = useModalStore.getState();

  const [toggling, setToggling] = useState<string | null>(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await chatAgentService.fetchPaginatedChatAgents(page, limit);
      const total = res.data.data.pagination.total || 0;
      setTotalPages(Math.ceil(total / limit));
      setChatAgents(res.data.data.chatAgents);
      setPagination(res.data.data.pagination);
      setTotalStatuses(total);
    } catch (err) {
      console.error("Failed to fetch Employee's", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [page]);

  const openCreateUserModal = () => {
    pushModal({
      content: <CreateUserModal />,
      type: "form",
      title: "Create User",
      size: "md",
    });
  };

  const isActive = (agent: Agent) => agent.meta?.is_active !== false;

  const handleDeactivateSuccess = (agentId: string) => {
    setChatAgents((prev) =>
      prev.map((a) =>
        a._id === agentId ? { ...a, meta: { ...a.meta, is_active: false } } : a
      )
    );
  };

  const handleToggle = (agent: Agent) => {
    if (isActive(agent)) {
      pushModal({
        title: `Deactivate ${agent.name}`,
        type: "form",
        size: "sm",
        submitLabel: "Deactivate",
        content: (
          <DeactivateUserModal
            agent={agent}
            onSuccess={handleDeactivateSuccess}
          />
        ),
      });
    } else {
      Swal.fire({
        title: "Activate user?",
        text: `Re-activate ${agent.name}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Activate",
      }).then(async (result) => {
        if (!result.isConfirmed) return;
        try {
          setToggling(agent._id);
          await chatAgentService.toggleActiveStatus(agent._id, true);
          setChatAgents((prev) =>
            prev.map((a) =>
              a._id === agent._id ? { ...a, meta: { ...a.meta, is_active: true } } : a
            )
          );
          Swal.fire({ icon: "success", title: "User activated", timer: 1200, showConfirmButton: false });
        } catch (err: any) {
          Swal.fire("Error", err?.message || "Failed to activate user", "error");
        } finally {
          setToggling(null);
        }
      });
    }
  };

  return (
    <div className=" mt-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-primary shadow-lead p-4 mb-6 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
              Employee's
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your team of Employee's
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalStatuses}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Agents
            </div>
          </div>
          <Button
            onClick={openCreateUserModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Create Employee's</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-lg shadow-lead bg-primary overflow-hidden">
        {loading ? (
          <div className="p-8">
            <SkeletonTableLoader />
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-primary">
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4">
                  Employee's
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Created At
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chatAgents.length > 0 ? (
                chatAgents.map((agent, index) => (
                  <TableRow
                    key={agent._id}
                    className={`border-b border-gray-100 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30 ${
                      index % 2 === 0
                        ? "bg-white dark:bg-primary/40"
                        : "bg-gray-50/50 dark:bg-gray-800/20"
                    }`}
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {agent.name?.charAt(0).toUpperCase() || "A"}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {agent.name}
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 text-xs"
                          >
                            Telecaller
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-gray-600 dark:text-gray-300">
                        {agent.email}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-gray-600 dark:text-gray-300 font-mono">
                        {agent.phone_number || "-"}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <div className="text-gray-600 dark:text-gray-300 text-sm">
                          {new Date(agent.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-gray-400 dark:text-gray-500 text-xs">
                          {new Date(agent.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {isActive(agent) ? (
                        <Badge className="bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <button
                        onClick={() => handleToggle(agent)}
                        disabled={toggling === agent._id}
                        className={`relative inline-flex h-7 w-14 flex-shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                          isActive(agent) ? "bg-green-500" : "bg-gray-400 dark:bg-gray-600"
                        }`}
                        title={isActive(agent) ? "Click to deactivate" : "Click to activate"}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ${
                            isActive(agent) ? "translate-x-7" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Users className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                      <div>
                        <div className="text-lg font-medium text-gray-500 dark:text-gray-400">
                          No Employee's found
                        </div>
                        <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          Get started by creating your first chat agent
                        </div>
                      </div>
                      <Button
                        onClick={openCreateUserModal}
                        className="mt-2 flex items-center gap-2"
                      >
                        <UserPlus className="h-4 w-4" />
                        Create Employee's
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {pagination && totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {chatAgents.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalStatuses}
            </span>{" "}
            Employee's
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-2"
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
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 dark:text-gray-400"
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
              className="flex items-center gap-2"
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

export default ChatAgentTable;
