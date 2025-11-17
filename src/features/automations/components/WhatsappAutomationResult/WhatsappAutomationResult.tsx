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
  // 👉 fetch from API
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
            (pagination?.currentPage ?? 1 - 1) * (pagination?.limit ?? limit) +
            (index + 1),
          automationType: "Lead", // or derive from a.type / a.lead_type if you want
          status: firstRule?.status_id ?? "-",
          label: firstRule?.label_id ?? "-",
          deviceType: firstRule?.device_type ?? "-",
          template: firstRule?.template_id ?? "-",
          enabled: !!a.meta?.is_active,
        };
      }),
    [automations, pagination, limit]
  );

  // Local state for optimistic changes / clone / delete
  const [data, setData] = useState<Row[]>([]);

  // sync when API data changes
  useEffect(() => {
    setData(apiRows);
  }, [apiRows]);

  const columns = useMemo<ColumnDef<Row, any>[]>(
    () => [
      columnHelper.accessor("id", {
        header: "No.",
        cell: (c) => <span className="block w-[70px]">{c.getValue()}</span>,
      }),
      columnHelper.accessor("automationType", {
        header: "Automation Type",
        cell: (c) => <span className="block w-[150px]">{c.getValue()}</span>,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (c) => <span className="block w-[100px]">{c.getValue()}</span>,
      }),
      columnHelper.accessor("label", {
        header: "Label",
        cell: (c) => (
          <span className="truncate block w-[220px]">{c.getValue()}</span>
        ),
      }),
      columnHelper.accessor("deviceType", {
        header: "Device Type",
        cell: (c) => <span className="block w-[170px]">{c.getValue()}</span>,
      }),
      columnHelper.accessor("template", {
        header: "Template",
        cell: (c) => (
          <a className="text-purple-600 hover:underline cursor-pointer block w-[200px] truncate ">
            {c.getValue()}
          </a>
        ),
      }),
      columnHelper.accessor("enabled", {
        header: "Automation Status",
        cell: (info) => {
          const val = info.getValue() as boolean;
          const row = info.row.original;
          return (
            <div className="block w-[150px]">
              <Switch
                checked={val}
                onCheckedChange={(v) => {
                  // still local optimistic toggle for now
                  setData((d) =>
                    d.map((r) => (r.id === row.id ? { ...r, enabled: !!v } : r))
                  );
                  // later: call API to enable/disable automation
                }}
                aria-label={`Toggle automation for ${row.template}`}
              />
            </div>
          );
        },
      }),
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const r = row.original;
          const onEdit = () => {
            console.log("edit", r.id);
          };
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
            if (
              !confirm("Are you sure you want to delete this automation rule?")
            )
              return;
            setData((d) => d.filter((x) => x.id !== r.id));
          };

          return (
            <div className="flex items-center ">
              <Button
                size="sm"
                variant="ghost"
                className="p-1"
                onClick={onEdit}
                title="Edit"
              >
                <Edit size={14} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="p-1"
                onClick={onClone}
                title="Clone"
              >
                <Copy size={14} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="p-1 text-red-500 hover:bg-red-50"
                onClick={onDelete}
                title="Delete"
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
      <div
        className="overflow-auto    [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-[#fff]
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-[#173b78] hover:[&::-webkit-scrollbar-thumb]:bg-[#2554a5]"
      >
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
        <div className="flex items-center gap-2">
          <Button variant="ghost">{"<<"}</Button>
          <Button variant="ghost">{"<"}</Button>
          <input
            className="w-12 text-center rounded border px-2 py-1 bg-transparent text-sm text-gray-700 dark:text-gray-200"
            value={pagination?.currentPage ?? 1}
            readOnly
          />
          <Button variant="ghost">{">"}</Button>
          <Button variant="ghost">{">>"}</Button>
        </div>
      </div>
    </Card>
  );
}
