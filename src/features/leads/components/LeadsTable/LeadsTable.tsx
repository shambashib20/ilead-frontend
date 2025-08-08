import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Lead } from "../../types"; // Adjust if needed
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type Props = {
  leads: Lead[];
  setIsTableView: (val: boolean) => void;
  pagination: Pagination;
  onPageChange: (newPage: number) => void;
};

export default function LeadsTable({ leads, pagination, onPageChange }: Props) {
  const { page, totalPages, hasNextPage, hasPrevPage } = pagination;
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border dark:border-zinc-800 overflow-hidden">
      <div className="overflow-auto max-h-[65vh]">
        <Table className="min-w-full text-sm">
          <TableHeader className="sticky top-0 z-10 bg-muted dark:bg-zinc-800">
            <TableRow>
              <TableHead className="text-left px-4 py-3 text-zinc-700 dark:text-zinc-200">
                Name
              </TableHead>
              <TableHead className="text-left px-4 py-3 text-zinc-700 dark:text-zinc-200">
                Email
              </TableHead>
              <TableHead className="text-left px-4 py-3 text-zinc-700 dark:text-zinc-200">
                Phone
              </TableHead>
              <TableHead className="text-left px-4 py-3 text-zinc-700 dark:text-zinc-200">
                Company
              </TableHead>
              <TableHead className="text-left px-4 py-3 text-zinc-700 dark:text-zinc-200">
                Assigned To
              </TableHead>
              <TableHead className="text-left px-4 py-3 text-zinc-700 dark:text-zinc-200">
                Assigned By
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead, index) => (
              <TableRow
                key={lead._id}
                className={
                  index % 2 === 0
                    ? "bg-white dark:bg-zinc-900"
                    : "bg-muted/50 dark:bg-zinc-800 hover:bg-muted dark:hover:bg-zinc-700"
                }
              >
                <TableCell className="px-4 py-3 font-medium text-zinc-900 dark:text-white">
                  {lead.name}
                </TableCell>
                <TableCell className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                  {lead.email}
                </TableCell>
                <TableCell className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                  {lead.phone_number}
                </TableCell>
                <TableCell className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                  {lead.company_name}
                </TableCell>
                <TableCell className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                  {lead.assigned_to?.name}
                </TableCell>
                <TableCell className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                  {lead.assigned_by?.name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center gap-4 px-6 py-4 bg-muted/30 dark:bg-zinc-800 border-t dark:border-zinc-700">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPrevPage}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <div className="text-sm text-muted-foreground dark:text-zinc-300">
          Page <span className="font-semibold">{page}</span> of{" "}
          <span className="font-semibold">{totalPages}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
