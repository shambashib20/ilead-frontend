import {
  Table,
  TableBody,
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
    <Table className="">
      {/* <TableCaption>Missed Follow-ups</TableCaption> */}
      <TableHeader className="bg-[#3062be] dark:bg-[#203e74] rounded-none">
        <TableRow>
          <TableHead className=" text-white">No.</TableHead>
          <TableHead className=" text-white">Customer Name</TableHead>
          <TableHead className=" text-white">Status</TableHead>
          <TableHead className="text-white">Assign To</TableHead>
          {/* <TableHead>Mobile</TableHead> */}
          <TableHead className="text-white">Follow Up Date</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {missedFollowUps.data.map((item, index) => {
          const isExpanded = expandedRow === item.leadId;

          return (
            <>
              <TableRow
                key={item.leadId}
                className="cursor-pointer bg-blue-900/20 hover:bg-blue-900/30 text-bg-blue-900 font-semibold  dark:text-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50"
                onClick={() => setExpandedRow(isExpanded ? null : item.leadId)}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.status?.title || "-"}</TableCell>
                <TableCell>{item.assigned_to?.name || "-"}</TableCell>
                {/* <TableCell>{"-"}</TableCell> */}
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
                  <TableCell colSpan={5}>
                    <div className="p-4 text-sm space-y-2 bg-gray-200 dark:bg-gray-50/5 m-2 rounded-[5px]">
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
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
                          <span>{item.phone_number || "-"}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-32">Company:</span>
                          <span>{item.company_name || "-"}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-32">Address:</span>
                          <span>{item.company_name || "-"}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-32">
                            Created By:
                          </span>
                          <span>{"-"}</span>
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
