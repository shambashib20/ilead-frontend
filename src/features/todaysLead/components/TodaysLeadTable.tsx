import { cn } from "@/lib/utils";
import { useState } from "react";
import { usePagination } from "../hooks/usePagination";
import type { Lead } from "@/features/leads/types";

function StatusBadge({ title }: { title: string }) {
  const colors: Record<string, string> = {
    New: "bg-blue-100 text-blue-600",
    Confirm: "bg-green-100 text-green-600",
    Cancel: "bg-red-100 text-red-600",
  };

  return (
    <span
      className={cn(
        "px-2 py-1 rounded text-xs font-medium",
        colors[title] ?? "bg-gray-100 text-gray-600"
      )}
    >
      {title}
    </span>
  );
}

function TodaysLeadTable({ data }: { data: Lead[] }) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const { page, setPage, totalPages, paginatedData } = usePagination(data, 10);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-3">S/N</th>
            <th className="p-3">Customer Name</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Assigned To</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((lead, idx) => {
            const isOpen = expandedRow === lead._id;

            return (
              <>
                {/* ROW */}
                <tr key={lead._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{(page - 1) * 10 + idx + 1}</td>

                  <td className="p-3 font-medium">
                    <button
                      onClick={() => setExpandedRow(isOpen ? null : lead._id)}
                      className="hover:underline"
                    >
                      {lead.name}
                    </button>
                  </td>

                  <td className="p-3">{lead.phone_number}</td>

                  <td className="p-3">{lead.assigned_to?.name ?? "—"}</td>

                  <td className="p-3">
                    <StatusBadge title={lead.status?.title} />
                  </td>

                  <td className="p-3 flex gap-2">
                    <button className="text-blue-500">📞</button>
                    <button className="text-green-500">💬</button>
                    <button className="text-orange-500">🔄</button>
                  </td>
                </tr>

                {/* EXPANDED */}
                {isOpen && (
                  <tr className="bg-gray-50 border-t">
                    <td colSpan={6} className="p-4 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <b>Email:</b> {lead.email ?? "N/A"}
                        </div>
                        <div>
                          <b>Reference:</b> {lead.reference}
                        </div>
                        <div className="col-span-2">
                          <b>Labels:</b>{" "}
                          {lead.labels.map((l: any) => (
                            <span
                              key={l._id}
                              className="inline-block mr-2 px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs"
                            >
                              {l.title}
                            </span>
                          ))}
                        </div>
                        <div className="col-span-2 text-gray-600">
                          <b>Comment:</b> {lead.comment}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex items-center justify-between p-4 text-sm">
        <span>
          Page {page} of {totalPages}
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
          >
            Previous
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodaysLeadTable;
