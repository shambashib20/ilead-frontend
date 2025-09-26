import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  archivedLeadsQueryptions,
  useArchivedLeads,
} from "@/features/leads/hooks/useArchivedLeads";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Trash } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_dashboardLayout/lead-trash")({
  component: RouteComponent,
  loader: (ctx) => {
    ctx.context.queryClient.ensureQueryData(archivedLeadsQueryptions());
  },
});

export default function RouteComponent() {
  // hook manages its own page/limit state
  const {
    archivedLeads,
    pagination,
    page,
    limit,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    isLoading,
    isFetching,
    refetch,
    prefetchNext,
  } = useArchivedLeads(1, 10);

  useEffect(() => {
    if (pagination.hasNextPage) {
      prefetchNext();
    }
  }, [page, pagination.hasNextPage, prefetchNext]);

  useEffect(() => {
    if (
      !isLoading &&
      archivedLeads.length === 0 &&
      pagination.totalItems === 0
    ) {
      // optional: no-op or inform user
    }
  }, [isLoading, archivedLeads.length, pagination.totalItems]);

  // UI states
  const empty = !isLoading && archivedLeads.length === 0;

  return (
    <div className="mt-5 space-y-4">
      <div className="flex items-center justify-between bg-primary px-8 py-4 rounded-md">
        <h3 className="text-2xl text-foreground font-medium">Lead Trash</h3>
        <div>
          <Button
            size={"icon"}
            variant={"destructive"}
            title="Empty trash (bulk)"
          >
            <Trash />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center bg-foreground/10 px-8 py-3 rounded-md">
        <h6 className="text-foreground font-semibold">
          Leads older than 15 days are auto-deleted
        </h6>
      </div>

      <div className="bg-primary p-4 rounded-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Showing{" "}
              {Math.max(
                0,
                (pagination.currentPage - 1) * pagination.limit +
                  (archivedLeads.length ? 1 : 0)
              )}{" "}
              to{" "}
              {Math.max(
                0,
                (pagination.currentPage - 1) * pagination.limit +
                  archivedLeads.length
              )}{" "}
              of {pagination.totalItems}
            </span>
            {isFetching && (
              <span className="text-sm italic text-muted-foreground">
                Updating…
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">Per page</span>
            <Select
              onValueChange={(v) => setLimit(Number(v))}
              value={String(limit)}
            >
              <SelectTrigger className="w-[96px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: limit }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                </TableRow>
              ))
            ) : empty ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium">No archived leads</h4>
                    <p className="text-sm text-muted-foreground">
                      Nothing to show. Try reloading.
                    </p>
                    <div className="mt-3">
                      <Button onClick={() => refetch()}>Reload</Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              archivedLeads.map((lead) => (
                <TableRow key={lead._id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{lead.name || "—"}</span>
                      <span className="text-xs text-muted-foreground">
                        {lead.reference || ""}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>{lead.company_name || "—"}</TableCell>

                  <TableCell>{lead.phone_number || "—"}</TableCell>

                  <TableCell>{lead.email || "—"}</TableCell>

                  <TableCell>
                    {lead.createdAt
                      ? format(new Date(lead.createdAt), "dd MMM yyyy")
                      : "—"}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toast("Restore not implemented")}
                      >
                        Restore
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => toast("Delete now not implemented")}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={!pagination.hasPrevPage || isFetching}
            >
              <ChevronLeft />
            </Button>

            <div className="flex items-center gap-2 px-3">
              <span className="text-sm">Page</span>
              <Input
                aria-label="current page"
                className="w-16 text-center"
                value={String(pagination.currentPage)}
                onChange={(e) => {
                  const v = Number(e.target.value || 1);
                  if (!Number.isNaN(v)) setPage(v);
                }}
              />
              <span className="text-sm">of {pagination.totalPages || 1}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={!pagination.hasNextPage || isFetching}
            >
              <ChevronRight />
            </Button>
          </div>

          <div>
            <Button onClick={() => refetch()} disabled={isFetching}>
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
