import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";
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
import { Plus, ArrowLeft, Pencil, Trash2, Eye, Paperclip } from "lucide-react";

export const Route = createFileRoute(
  "/_dashboardLayout/general-templates/lead-template/"
)({
  component: RouteComponent,
});

const rows = [
  { id: 1, title: "Test Campaign!", type: "Whatsapp", notes: 0 },
  { id: 2, title: "Nursing Leads 22025", type: "Whatsapp", notes: 2 },
  { id: 3, title: "GNM 1L 25K Discount", type: "Whatsapp", notes: 1 },
  { id: 4, title: "B.sc Nursing 1L 25K Discount", type: "Whatsapp", notes: 1 },
  { id: 5, title: "Gnm Nursing 30% Scholarship", type: "Whatsapp", notes: 1 },
  {
    id: 6,
    title: "B.Pharm Upto 50K For Scholarship",
    type: "Whatsapp",
    notes: 0,
  },
  { id: 7, title: "Gnm Nursing 1L Scholarship", type: "Whatsapp", notes: 1 },
  { id: 8, title: "B.sc Nursing 2L 25k", type: "Whatsapp", notes: 1 },
  { id: 9, title: "Associate", type: "Whatsapp", notes: 0 },
  { id: 10, title: "B.Pharm For WBJEE Students", type: "Whatsapp", notes: 1 },
];

function RouteComponent() {
  const navigate = useNavigate();
  return (
    <section className="mt-7">
      {/* Title + controls */}
      <div className="rounded-xl   ">
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
              onClick={() => {
                navigate({
                  to: "..",
                });
              }}
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
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-primary mt-5 shadow-lead rounded-sm">
          {/* Table */}
          <div className="overflow-hidden rounded-b-xl">
            <table className="w-full  text-sm">
              <thead>
                <tr className=" text-foreground">
                  <Th className="w-16">No.</Th>
                  <Th>Title</Th>
                  <Th className="w-40">Type</Th>
                  <Th className="w-48 text-right pr-6">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => (
                  <tr
                    key={r.id}
                    className="border-b border-gray-300 dark:border-gray-600 last:border-0"
                  >
                    <Td className="text-foreground">{idx + 1}</Td>
                    <Td>
                      <a
                        href="#"
                        className="text-forground font-medium hover:underline"
                      >
                        {r.title}
                      </a>
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
                        <CountBubble value={r.notes} />
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer pagination */}
          <div className="flex flex-col gap-3 border-t bg-background/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="text-sm text-muted-foreground">Rows per page:</div>
            <div className="flex items-center gap-3">
              <Select defaultValue="10">
                <SelectTrigger className="h-8 w-20 border-transparent shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground">1 - 10 of 10</div>

              <div className="ml-2 inline-flex items-center gap-1">
                <PageBtn disabled>{"⏮"}</PageBtn>
                <PageBtn disabled>{"◀"}</PageBtn>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-14 justify-center border-none"
                >
                  1
                </Button>
                <div className="px-1 text-sm text-muted-foreground">of 1</div>

                <PageBtn disabled>{"▶"}</PageBtn>
                <PageBtn disabled>{"⏭"}</PageBtn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
      className={`border-b  border-gray-300 dark:border-gray-500 px-4 py-4 align-middle ${className}`}
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
    <span title={title} className={`${color}`}>
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
}: React.PropsWithChildren<{ disabled?: boolean }>) {
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled}
      className="h-8 w-8 p-0 border-none"
    >
      {children}
    </Button>
  );
}
