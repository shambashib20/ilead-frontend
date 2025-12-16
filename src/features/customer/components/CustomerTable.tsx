import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { customerService } from "../services/Customer.service";
import type { Customer } from "../services/Customer.service";
import { Button } from "@/components/ui/button";
import SkeletonTableLoader from "@/components/SkeletonTableLoader";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";

function CustomerTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await customerService.getPaginatedCustomers(page, limit);
      setCustomers(res.data.data.customers);
      const total = res.data.data.pagination.totalItems || 0;
      setTotalPages(Math.ceil(total / limit));
      setTotalCustomers(total);
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <div className=" mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shadow-lead bg-primary p-4 rounded-lg">
        <div className="flex items-center gap-3  ">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-medium text-gray-900 dark:text-white">
              Customers
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your customer relationships
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {totalCustomers}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total Customers
          </div>
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
                  Customer
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
                  Status
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length > 0 ? (
                customers.map((customer, index) => (
                  <TableRow
                    key={customer._id}
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
                            {customer.name?.charAt(0).toUpperCase() || "C"}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {customer.name}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-gray-600 dark:text-gray-300">
                        {customer.email}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-gray-600 dark:text-gray-300 font-mono">
                        {customer.phone_number}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant={
                          customer.meta?.active ? "default" : "secondary"
                        }
                        className={`
                          font-medium px-3 py-1 rounded-full
                          ${
                            customer.meta?.active
                              ? "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                              : "bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                          }
                        `}
                      >
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              customer.meta?.active
                                ? "bg-green-500"
                                : "bg-gray-500"
                            }`}
                          />
                          {customer.meta?.active ? "Active" : "Inactive"}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-gray-600 dark:text-gray-300 font-mono">
                        {customer.meta?.whatsapp || "-"}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Users className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                      <div>
                        <div className="text-lg font-medium text-gray-500 dark:text-gray-400">
                          No customers found
                        </div>
                        <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          Get started by adding your first customer
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {customers.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalCustomers}
            </span>{" "}
            customers
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

export default CustomerTable;
