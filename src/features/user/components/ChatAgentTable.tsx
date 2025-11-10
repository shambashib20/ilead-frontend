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
import SkeletonTableLoader from "@/components/SkeletonTableLoader";
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
      //console.error("Failed to fetch Employee's", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [page]);

  const openCreateUserModal = () => {
    const { openModal, setModalTitle, setModalSize } = useModalStore.getState();
    openModal({
      content: <CreateUserModal />,
      type: "form",
    });
    setModalTitle?.("Create User");
    setModalSize?.("md");
  };

  return (
    <div className=" mt-10">
      {/* Header */}
      <div className="flex items-center justify-between bg-primary p-4 mb-6 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Employee's
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your team of Employee's
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
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
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <UserPlus className="h-4 w-4" />
            Create Employee's
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-primary overflow-hidden">
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
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center">
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
