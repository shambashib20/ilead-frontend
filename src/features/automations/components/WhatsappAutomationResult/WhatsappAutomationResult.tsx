import { useMemo, useState, type JSX } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";

import { Edit, Trash2, Copy } from "lucide-react";

/* shadcn UI components - adjust import paths if you scaffolded differently */
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

/**
 * Mock data type and rows - replace with your API data
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

const MOCK_DATA: Row[] = [
  {
    id: 1,
    automationType: "Lead",
    status: "New",
    label: "Nursing Leads 2025",
    deviceType: "Staff Device",
    template: "Nursing Leads 22025",
    enabled: true,
  },
  {
    id: 2,
    automationType: "Lead",
    status: "New",
    label: "GNM 1L 25K Discount",
    deviceType: "Staff Device",
    template: "GNM 1L 25K Discount",
    enabled: true,
  },
  {
    id: 3,
    automationType: "Lead",
    status: "New",
    label: "B.sc Nursing 1L 25K Discount",
    deviceType: "Staff Device",
    template: "B.sc Nursing 1L 25K Discount",
    enabled: true,
  },
  {
    id: 4,
    automationType: "Lead",
    status: "New",
    label: "Gnm Nursing 30% Scholarship",
    deviceType: "Staff Device",
    template: "Gnm Nursing 30% Scholarship",
    enabled: true,
  },
  {
    id: 5,
    automationType: "Lead",
    status: "New",
    label: "B.Pharm Upto 50K",
    deviceType: "Staff Device",
    template: "B.Pharm Upto 50K For ...",
    enabled: true,
  },
  {
    id: 6,
    automationType: "Lead",
    status: "New",
    label: "Gnm Nursing 1L Scholarship",
    deviceType: "Staff Device",
    template: "Gnm Nursing 1L Scholarship",
    enabled: true,
  },
  {
    id: 7,
    automationType: "Lead",
    status: "New",
    label: "B.sc Nursing 2L 25k",
    deviceType: "Staff Device",
    template: "B.sc Nursing 2L 25k",
    enabled: true,
  },
  {
    id: 8,
    automationType: "Lead",
    status: "New",
    label: "B.Pharm For WBJEE Students",
    deviceType: "Staff Device",
    template: "B.Pharm For WBJEE Students",
    enabled: true,
  },
  {
    id: 9,
    automationType: "Lead",
    status: "New",
    label: "Associate",
    deviceType: "Staff Device",
    template: "Associate",
    enabled: true,
  },
];

/**
 * Form filter shape
 */

const columnHelper = createColumnHelper<Row>();

export default function WhatsappAutomationResult(): JSX.Element {
  const [data, setData] = useState<Row[]>(MOCK_DATA);

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
                  // optimistic local toggle - replace with API call
                  setData((d) =>
                    d.map((r) => (r.id === row.id ? { ...r, enabled: !!v } : r))
                  );
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
            // open drawer/modal or navigate to edit page
            console.log("edit", r.id);
            // placeholder: show dialog? navigate? implement per your app
          };
          const onClone = () => {
            // clone locally for demo
            const nextId = Math.max(...data.map((x) => x.id)) + 1;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Watch form changes: whenever a filter changes, auto-apply (debounced)

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
          1 - {data.length} of {data.length}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost">{"<<"}</Button>
          <Button variant="ghost">{"<"}</Button>
          <input
            className="w-12 text-center rounded border px-2 py-1 bg-transparent text-sm text-gray-700 dark:text-gray-200"
            value={1}
            readOnly
          />
          <Button variant="ghost">{">"}</Button>
          <Button variant="ghost">{">>"}</Button>
        </div>
      </div>
    </Card>
  );
}
