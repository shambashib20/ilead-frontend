import { useMemo, useState, type JSX, useEffect } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { Edit, Trash2, Copy } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAutomations } from "../../hooks/useAutomation";

/**
 * Table row type
 */
type Row = {
  id: number;
  automationType: string;
  status: string;
  label: string;
  deviceType: string;
  template: string;
  enabled: boolean;
};

const columnHelper = createColumnHelper<Row>();

export default function WhatsappAutomationResult(): JSX.Element {
  const page = 1;
  const limit = 10;
  const { automations, pagination, isLoading } = useAutomations(page, limit);

  // Map API data → table rows
  const apiRows: Row[] = useMemo(
    () =>
      automations.map((a, index) => {
        const firstRule = a.rules?.[0];

        return {
          id:
            ((pagination?.currentPage ?? 1) - 1) *
              (pagination?.limit ?? limit) +
            (index + 1),
          automationType: a.type === "LEAD_AUTOMATION" ? "Lead" : a.type,
          status:
            firstRule?.status_id == null
              ? "-"
              : typeof firstRule.status_id === "string"
                ? firstRule.status_id
                : (firstRule.status_id.title ?? "-"),
          label:
            firstRule?.label_id == null
              ? "-"
              : typeof firstRule.label_id === "string"
                ? firstRule.label_id
                : (firstRule.label_id.title ?? "-"),
          deviceType: firstRule?.device_type?.replace(/_/g, " ") ?? "-",
          template:
            firstRule?.template_id == null
              ? "-"
              : typeof firstRule.template_id === "string"
                ? firstRule.template_id
                : (firstRule.template_id.title ?? "-"),
          enabled: !!a.meta?.is_active,
        };
      }),
    [automations, pagination, limit]
  );

  const [data, setData] = useState<Row[]>([]);

  useEffect(() => {
    setData(apiRows);
  }, [apiRows]);

  const columns = useMemo<ColumnDef<Row, any>[]>(
    () => [
      columnHelper.accessor("id", {
        header: "No.",
        cell: (c) => <span className="block w-[50px]">{c.getValue()}</span>,
      }),
      columnHelper.accessor("automationType", {
        header: "Type",
        cell: (c) => <span className="block w-[90px]">{c.getValue()}</span>,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (c) => <span className="block w-[120px]">{c.getValue()}</span>,
      }),
      columnHelper.accessor("label", {
        header: "Label",
        cell: (c) => (
          <span className="truncate block w-[180px]">{c.getValue()}</span>
        ),
      }),
      columnHelper.accessor("deviceType", {
        header: "Device",
        cell: (c) => <span className="block w-[120px]">{c.getValue()}</span>,
      }),
      columnHelper.accessor("template", {
        header: "Template",
        cell: (c) => (
          <span className="text-purple-600 hover:underline cursor-pointer block w-[200px] truncate">
            {c.getValue()}
          </span>
        ),
      }),
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const r = row.original;

          const onEdit = () => console.log("edit", r.id);

          const onClone = () => {
            const nextId =
              data.length > 0 ? Math.max(...data.map((x) => x.id)) + 1 : 1;
            const cloned = {
              ...r,
              id: nextId,
              template: `${r.template} (copy)`,
            };
            setData((d) => [cloned, ...d]);
          };

          const onDelete = () => {
            if (!confirm("Are you sure you want to delete this automation?"))
              return;
            setData((d) => d.filter((x) => x.id !== r.id));
          };

          return (
            <div className="flex items-center">
              <Button
                size="sm"
                variant="ghost"
                className="p-1"
                onClick={onEdit}
              >
                <Edit size={14} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="p-1"
                onClick={onClone}
              >
                <Copy size={14} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="p-1 text-red-500 hover:bg-red-50"
                onClick={onDelete}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          );
        },
      },
    ],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <Card className="bg-primary shadow rounded-md p-4">
        <span className="text-sm text-gray-500">Loading automations...</span>
      </Card>
    );
  }

  return (
    <Card className="bg-primary shadow rounded-md p-0 overflow-hidden">
      <div className="overflow-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#173b78] hover:[&::-webkit-scrollbar-thumb]:bg-[#2554a5]">
        <table className="min-w-full divide-y">
          <thead className="bg-primary">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left px-3 py-3 text-[12px] text-foreground font-medium"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header as any,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="bg-primary divide-y">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-3 py-4 text-[12px] text-gray-700 dark:text-gray-200 align-top"
                  >
                    {flexRender(
                      cell.column.columnDef.cell as any,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}

            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No records to display
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t dark:border-gray-700 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {pagination
            ? `${(pagination.currentPage - 1) * pagination.limit + 1} - ${
                (pagination.currentPage - 1) * pagination.limit + data.length
              } of ${pagination.totalItems}`
            : `1 - ${data.length} of ${data.length}`}
        </div>
      </div>
    </Card>
  );
}
