import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMissedFollowUps } from "@/features/leads/hooks/useMissedFollowUp";
import { format } from "date-fns";
import { useState } from "react";

function FollowUp() {
  const { missedFollowUps, isLoading } = useMissedFollowUps();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  if (isLoading) return <p>Loading...</p>;
  if (!missedFollowUps?.data?.length) return <p>No missed follow-ups</p>;

  return (
    <Table>
      <TableCaption>Missed Follow-ups</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead>Customer Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Assign To</TableHead>
          <TableHead>Mobile</TableHead>
          <TableHead>Follow Up Date</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {missedFollowUps.data.map((item, index) => {
          const isExpanded = expandedRow === item.leadId;

          return (
            <>
              <TableRow
                key={item.leadId}
                className="cursor-pointer"
                onClick={() => setExpandedRow(isExpanded ? null : item.leadId)}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.status?.title || "-"}</TableCell>
                <TableCell>{item.assigned_to?.name || "-"}</TableCell>
                <TableCell>{item.mobile || "-"}</TableCell>
                <TableCell>
                  {item.next_followup_date
                    ? format(
                        new Date(item.next_followup_date),
                        "dd-MM-yyyy HH:mm"
                      )
                    : "-"}
                </TableCell>
              </TableRow>

              {isExpanded && (
                <TableRow className="bg-primary">
                  <TableCell colSpan={6}>
                    <div className="p-1 text-sm space-y-2">
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                        <div className="flex">
                          <span className="font-semibold w-32">
                            Customer Name:
                          </span>
                          <span>{item.name}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-32">Email:</span>
                          <span>{item.email || "-"}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-32">Mobile:</span>
                          <span>{item.mobile || "-"}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-32">Company:</span>
                          <span>{item.company_name || "-"}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-32">Address:</span>
                          <span>{item.address || "-"}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-32">
                            Created By:
                          </span>
                          <span>{item.createdBy?.name || "-"}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-32">Status:</span>
                          <span>{item.status?.title || "-"}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-32">Source:</span>
                          <span>{item.meta?.source?.title || "-"}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-32">Comment:</span>
                          <span>{item.comment || "-"}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-32">Labels:</span>
                          <span>
                            {item.labels?.length
                              ? item.labels.map((l) => l.title).join(", ")
                              : "No Labels"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default FollowUp;
