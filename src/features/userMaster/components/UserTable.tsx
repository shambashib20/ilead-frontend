import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Eye, Building2 } from "lucide-react";
import type { Workspace } from "../services/User.service";

interface UserTableProps {
  workspaces: (Workspace | null)[];
  page: number;
  setPage: (page: number) => void;
  limit: number;
  pagination: any;
  isLoading: boolean;
}

function UserTable({
  workspaces,
  page,
  setPage,
  pagination,
  isLoading,
}: UserTableProps) {
  // Extract pagination data
  const paginationData = pagination || {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  const { totalItems, totalPages, hasNextPage, hasPrevPage } = paginationData;

  const handleEdit = (user: any) => {
    console.log("Edit user:", user);
    // Add your edit logic here
  };

  const handleDelete = (userId: string) => {
    console.log("Delete user:", userId);
    // Add your delete logic here
  };

  const handleView = (user: any) => {
    console.log("View user:", user);
    // Add your view logic here
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "superadmin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "admin":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "telecaller":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="text-center py-8 dark:text-white">Loading...</div>
      ) : (
        <div className="space-y-6 grid grid-cols-2 gap-4">
          {workspaces && workspaces.length > 0 ? (
            workspaces.map((workspace) => (
              <div
                key={workspace?.property_id}
                className="rounded-sm overflow-hidden shadow-lead"
              >
                {/* Workspace Header */}
                <div className="bg-primary px-5 py-4 border-b dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building2
                        className="text-gray-600 dark:text-gray-300"
                        size={20}
                      />
                      <h3 className="text-lg font-semibold dark:text-white">
                        {workspace?.property_name}
                      </h3>
                    </div>
                    <span className="text-sm text-muted-foreground dark:text-gray-400">
                      {workspace?.totalUsers}{" "}
                      {workspace?.totalUsers === 1 ? "User" : "Users"}
                    </span>
                  </div>
                </div>

                {/* Users Table */}
                {(workspace?.users.length as number) > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-primary/60 hover:bg-primary/80">
                        <TableHead className="dark:text-gray-200 px-5">
                          No.
                        </TableHead>
                        <TableHead className="dark:text-gray-200">
                          Name
                        </TableHead>
                        <TableHead className="dark:text-gray-200">
                          Email
                        </TableHead>
                        <TableHead className="dark:text-gray-200">
                          Phone
                        </TableHead>
                        <TableHead className="dark:text-gray-200">
                          Role
                        </TableHead>
                        <TableHead className="dark:text-gray-200">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-primary/40">
                      {workspace?.users.map((user, ind) => (
                        <TableRow key={user.user_id} className="py-2">
                          <TableCell className="dark:text-white px-5 py-4">
                            {ind + 1}
                          </TableCell>
                          <TableCell className="dark:text-white py-4">
                            {user.name}
                          </TableCell>
                          <TableCell className="dark:text-white py-4">
                            {user.email}
                          </TableCell>
                          <TableCell className="dark:text-white py-4">
                            {user.phone_number}
                          </TableCell>
                          <TableCell className="py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                                user.role
                              )}`}
                            >
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex gap-2 items-center">
                              <Eye
                                size={18}
                                className="cursor-pointer text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                onClick={() => handleView(user)}
                              />
                              <Pencil
                                size={18}
                                className="cursor-pointer text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                                onClick={() => handleEdit(user)}
                              />
                              <Trash
                                size={18}
                                className="cursor-pointer text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                onClick={() => handleDelete(user.user_id)}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="bg-primary/40 px-5 py-8 text-center">
                    <p className="text-sm dark:text-gray-400 italic">
                      No users in this workspace
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="rounded-sm overflow-hidden shadow-lead bg-primary/40 px-5 py-8 text-center">
              <p className="dark:text-gray-400">No workspaces found.</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center bg-primary p-4 rounded-sm mt-4">
        <div className="text-sm text-muted-foreground dark:text-gray-300">
          Showing {workspaces?.length || 0} workspaces ({totalItems} total)
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

export default UserTable;
