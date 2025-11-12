import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  ArrowLeft,
  Pencil,
  Trash2,
  Eye,
  Paperclip,
} from "lucide-react";
import {
  campaignQueryOptions,
  useCampaigns,
} from "@/features/templates/hooks/useCampaigns";

// Define the route
export const Route = createFileRoute(
  "/_dashboardLayout/general-templates/lead-template/"
)({
  component: RouteComponent,
  loader: (opts) => {
    opts.context.queryClient.ensureQueryData(campaignQueryOptions());
  },
});

function RouteComponent() {
  const navigate = useNavigate();

  // pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // fetch campaigns
  const { campaigns, isLoading, pagination } = useCampaigns(page, limit);

  // handlers
  const handlePrev = () => {
    if (pagination?.hasPrevPage) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (pagination?.hasNextPage) setPage((p) => p + 1);
  };

  const handleLimitChange = (value: string) => {
    setLimit(Number(value));
    setPage(1);
  };
console.log(campaigns)
  return (
    <section className="mt-7">
      {/* Title + controls */}
      <div className="rounded-xl">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between bg-primary shadow-lead rounded-sm">
          <h1 className="text-2xl font-semibold tracking-tight">
            Lead Template
          </h1>

          <div className="flex items-center gap-2">
            <div className="relative w-72 max-w-full">
              <Input placeholder="Search..." className="pl-3" />
            </div>

            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate({ to: ".." })}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            <Button
              className="gap-2"
              onClick={() =>
                navigate({
                  to: "/general-templates/lead-template/add-template",
                })
              }
            >
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        </div>

        <div className="bg-primary mt-5 shadow-lead rounded-sm">
          {/* Table */}
          <div className="overflow-hidden rounded-b-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-foreground">
                  <Th className="w-16">No.</Th>
                  <Th>Title</Th>
                  <Th className="w-40">Type</Th>
                  <Th className="w-48 text-right pr-6">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Loading campaigns...
                    </td>
                  </tr>
                ) : campaigns?.length ? (
                  campaigns.map((r, idx) => (
                    <tr
                      key={r._id}
                      className="border-b border-gray-300 dark:border-gray-600 last:border-0"
                    >
                      <Td className="text-foreground">
                        {(page - 1) * limit + (idx + 1)}
                      </Td>

                      <Td>
                        <span className="font-medium text-foreground hover:underline cursor-pointer">
                          {r.title}
                        </span>
                      </Td>

                      <Td>
                        <Badge className="bg-emerald-700 hover:bg-emerald-700 dark:text-white">
                          {r.type}
                        </Badge>
                      </Td>

                      <Td className="pr-6">
                        <div className="flex items-center justify-end gap-3">
                          <IconPill color="text-amber-500" title="Edit">
                            <Pencil className="h-4 w-4" />
                          </IconPill>

                          <IconPill color="text-rose-600" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </IconPill>

                          <IconPill color="text-emerald-600" title="Preview">
                            <Eye className="h-4 w-4" />
                          </IconPill>

                          <IconPill color="text-violet-600" title="Attachments">
                            <Paperclip className="h-4 w-4" />
                          </IconPill>

                          <CountBubble
                            value={
                              Object.keys(r.meta.variable_map || {}).length
                            }
                          />
                        </div>
                      </Td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No campaigns found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer pagination */}
          <div className="flex flex-col gap-3 border-t bg-background/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="text-sm text-muted-foreground">Rows per page:</div>

            <div className="flex items-center gap-3">
              <Select
                defaultValue={String(limit)}
                onValueChange={handleLimitChange}
              >
                <SelectTrigger className="h-8 w-20 border-transparent shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground">
                {pagination
                  ? `${(page - 1) * limit + 1} - ${Math.min(
                      page * limit,
                      pagination.totalItems
                    )} of ${pagination.totalItems}`
                  : "—"}
              </div>

              <div className="ml-2 inline-flex items-center gap-1">
                <PageBtn onClick={() => setPage(1)} disabled={page === 1}>
                  ⏮
                </PageBtn>

                <PageBtn onClick={handlePrev} disabled={!pagination?.hasPrevPage}>
                  ◀
                </PageBtn>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-14 justify-center border-none"
                >
                  {page}
                </Button>

                <div className="px-1 text-sm text-muted-foreground">
                  of {pagination?.totalPages || 1}
                </div>

                <PageBtn onClick={handleNext} disabled={!pagination?.hasNextPage}>
                  ▶
                </PageBtn>

                <PageBtn
                  onClick={() =>
                    pagination && setPage(pagination.totalPages)
                  }
                  disabled={page === pagination?.totalPages}
                >
                  ⏭
                </PageBtn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------- Reusable UI Components ------------------- */

function Th({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <th
      className={`border-b border-gray-300 dark:border-gray-500 px-4 py-3 text-left font-medium text-foreground ${className}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <td
      className={`border-b border-gray-300 dark:border-gray-500 px-4 py-4 align-middle ${className}`}
    >
      {children}
    </td>
  );
}

function IconPill({
  children,
  color,
  title,
}: React.PropsWithChildren<{ color: string; title?: string }>) {
  return (
    <span
      title={title}
      className={`cursor-pointer hover:opacity-80 transition-colors duration-150 ${color}`}
    >
      {children}
    </span>
  );
}

function CountBubble({ value }: { value: number }) {
  return (
    <span className="grid h-7 min-w-7 place-items-center rounded-full bg-muted text-xs text-foreground/80 px-2">
      {value}
    </span>
  );
}

function PageBtn({
  children,
  disabled,
  onClick,
}: React.PropsWithChildren<{ disabled?: boolean; onClick?: () => void }>) {
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled}
      onClick={onClick}
      className="h-8 w-8 p-0 border-none"
    >
      {children}
    </Button>
  );
}
