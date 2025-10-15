import type { ReportGroup } from "../../types";

export const REPORTS: ReportGroup = {
  heading: "General Reports",
  sections: [
    {
      title: "Lead",
      links: [
        // { label: "Status Wise Report", to: "reports-lead-status" },
        {
          label: "Lead Status Report",
          to: "lead-status",
        },
        {
          label: "Lead Source Report",
          to: "lead-source",
        },
        // { label: "Source Wise Report", to: "reports-lead-source" },
        // { label: "Label Wise Report", to: "reports-lead-label" },
        {
          label: "Lead Label Report",
          to: "lead-label",
        },
        // {
        //   label: "Staff & Label Wise Lead Status Report",
        //   to: "reports-lead-staff-label-status",
        // },
      ],
    },
    // {
    //   title: "Task",
    //   links: [
    //     { label: "Status Wise Report", to: "reports-task-status" },
    //     // { label: "Label Wise Report", to: "reports-task-label" },
    //     { label: "Priority Wise Report", to: "reports-task-priority" },
    //     { label: "Delay Task Report", to: "reports-task-delay" },
    //   ],
    // },
    // {
    //   title: "Invoice",
    //   links: [
    //     {
    //       label: "Invoice Created By Report",
    //       to: "reports-invoice-created-by",
    //     },
    //     { label: "Invoice Type Wise Report", to: "reports-invoice-type" },
    //     {
    //       label: "Invoice GST Or Non-GST Wise Report",
    //       to: "reports-invoice-gst",
    //     },
    //   ],
    // },
    // {
    //   title: "Staff",
    //   links: [
    //     { label: "Staff Attendance Report", to: "reports-staff-attendance" },
    //   ],
    // },
    // {
    //   title: "SOP",
    //   links: [{ label: "Staff Wise SOP Report", to: "reports-sop-staff-wise" }],
    // },
  ],
};
