import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Eye } from "lucide-react";

interface ClientTableProps {
  clients: any[];
  page: number;
  setPage: (page: number) => void;
  limit: number;
  pagination: any;
  isLoading: boolean;
}

function ClientTable({
  clients,
  page,
  setPage,
  limit,
  pagination,
  isLoading,
}: ClientTableProps) {
  // Extract pagination data
  const paginationData = pagination || {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  const { totalItems, totalPages, hasNextPage, hasPrevPage } = paginationData;

  const handleEdit = (client: any) => {
    console.log("Edit client:", client);
    // Add your edit logic here
  };

  const handleDelete = (clientId: string) => {
    console.log("Delete client:", clientId);
    // Add your delete logic here
  };

  const handleView = (client: any) => {
    console.log("View client:", client);
    // Add your view logic here
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {isLoading ? (
        <div className="text-center py-8 dark:text-white">Loading...</div>
      ) : (
        <div className="rounded-sm overflow-hidden shadow-lead">
          <Table>
            <TableHeader className="">
              <TableRow className="bg-primary hover:bg-white dark:hover:bg-primary/80">
                <TableHead className="dark:text-gray-200 px-5">No.</TableHead>
                <TableHead className="dark:text-gray-200">Name</TableHead>
                <TableHead className="dark:text-gray-200">Email</TableHead>
                <TableHead className="dark:text-gray-200">Mobile</TableHead>
                <TableHead className="dark:text-gray-200">Status</TableHead>
                <TableHead className="dark:text-gray-200">Created At</TableHead>
                <TableHead className="dark:text-gray-200">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-primary/60">
              {clients && clients.length > 0 ? (
                clients.map((client: any, ind: number) => (
                  <TableRow key={client._id} className="py-2">
                    <TableCell className="dark:text-white px-5 py-6">
                      {ind + 1 + (page - 1) * limit}
                    </TableCell>
                    <TableCell className="dark:text-white py-6">
                      {client.name}
                    </TableCell>
                    <TableCell className="dark:text-white py-6">
                      {client.email}
                    </TableCell>
                    <TableCell className="dark:text-white py-6">
                      {client.mobile_number}
                    </TableCell>
                    <TableCell className="py-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          client.status === "new"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : client.status === "active"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        }`}
                      >
                        {client.status}
                      </span>
                    </TableCell>
                    <TableCell className="dark:text-white py-6">
                      {formatDate(client.createdAt)}
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex gap-2 items-center">
                        <Eye
                          size={18}
                          className="cursor-pointer text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={() => handleView(client)}
                        />
                        <Pencil
                          size={18}
                          className="cursor-pointer text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                          onClick={() => handleEdit(client)}
                        />
                        <Trash
                          size={18}
                          className="cursor-pointer text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => handleDelete(client._id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 dark:text-gray-400"
                  >
                    No clients found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex justify-between items-center bg-primary p-4 rounded-sm mt-2">
        <div className="text-sm text-muted-foreground dark:text-gray-300">
          Showing {clients?.length || 0} of {totalItems} total clients
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

export default ClientTable;
