import LeadCard from "@/features/dashboard/components/LeadCard";
import LeadTab from "@/features/dashboard/components/LeadTab";
import type { LeadTabType } from "@/features/dashboard/components/LeadTab/LeadTab";
import { Card, CardTitle } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import type { Lead } from "@/features/leads/types";
import { dashboardLeads } from "@/features/leads/services/HomePage.service";
import LeadStatusChart from "@/features/dashboard/components/LeadStatusChart/LeadStatusChart";
import { Menu } from "lucide-react";
import LeadSourceChart from "@/features/dashboard/components/LeadSourceChart/LeadSourceChart";
import SkeletonLoader from "@/components/SkeletonLoader";
import { SkeletonLoaderCol } from "@/components/SkeletonLoader/SkeletonLoader";
import { missedFollowUpsQueryOptions } from "@/features/leads/hooks/useMissedFollowUp";
import {
  StatusQueryOptions,
  useStatus,
} from "@/features/leads/hooks/useStatus";
import { getData } from "@/utils/localStorage";
import {
  TodaysChatAgentsFollowupsQueryOptions,
  useTodaysChatFollowUps,
} from "@/features/dashboard/hooks/useTodaysChatFollowUps";
import UpcomingFollowUpsList from "@/features/dashboard/components/UpcommingFollowUpList/UpcommingFollowUpList";
import { useOverdueFollowUps } from "@/features/dashboard/hooks/useOverdueFollowUps";
import { useUser } from "@/features/auth/hooks/useUser";

export const Route = createFileRoute("/_dashboardLayout/dashboard/")({
  component: RouteComponent,
  loader: (opts) => {
    opts.context.queryClient.ensureQueryData(missedFollowUpsQueryOptions());
    opts.context.queryClient.ensureQueryData(StatusQueryOptions());
    opts.context.queryClient.ensureQueryData(
      TodaysChatAgentsFollowupsQueryOptions()
    );
  },
});

type DashboardCardType = {
  title: string;
  mode: "tab" | "simple";
  tabData?: LeadTabType; // only when mode === "tab"
  component?: React.ReactNode; // only when mode === "simple"
};

function RouteComponent() {
  // const currentLeads;
  const [leadData, setLeadData] = useState<{
    leads_in_new: Lead[];
    leads_in_processing: Lead[];
  } | null>(null);
  const user = useUser();

  const [showMenu, setShowMenu] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(
    () => user.data?._id ?? ""
  );
  const [agent, setagent] = useState(() => user?.data.name ?? "");
  const [agent2, setagent2] = useState(() => user?.data.name ?? "");
  const { status } = useStatus();
  const [showSourceMenu, setShowSourceMenu] = useState(false);
  const [sourceStartDate, sourceSetStartDate] = useState("");
  const [sourceEndDate, sourceSetEndDate] = useState("");
  const [sourceSelectedAgent, sourceSetSelectedAgent] = useState(
    () => user?.data._id ?? ""
  );

  const { todaysFollowups } = useTodaysChatFollowUps();
  const { overdueFollowups } = useOverdueFollowUps();

  // useEffect(() => {
  //   leadsServoceModule.overdueFollowUps().then((data) => console.log(data));
  // }, []);

  useEffect(() => {
    dashboardLeads
      .getTodayLeads()
      .then((res) =>
        setLeadData({
          leads_in_new: res.data.data.leads_in_new.map((lead: any) => ({
            ...lead,
            title: lead.title ?? "",
            assigned_to: lead.assigned_to ?? "",
            status: lead.status ?? "",
            assigned_by: lead.assigned_by ?? "",
            labels: lead.labels ?? [],
          })),
          leads_in_processing: res.data.data.leads_in_processing.map(
            (lead: any) => ({
              ...lead,
              title: lead.title ?? "",
              assigned_to: lead.assigned_to ?? "",
              status: lead.status ?? "",
              assigned_by: lead.assigned_by ?? "",
              labels: lead.labels ?? [],
            })
          ),
        })
      )
      .catch((err) => console.error("Lead API Error:", err));
  }, []);

  const cardsData: DashboardCardType[] = useMemo(
    () => [
      {
        title: "Today's Lead",
        mode: "tab",
        tabData: {
          content: [
            {
              label: `New`,
              description: "Leads that are new.",
              leads: leadData?.leads_in_new ?? [],
              length: leadData?.leads_in_new?.length ?? 0,
            },
            {
              label: `Processing`,
              description: "Leads currently in process.",
              leads: leadData?.leads_in_processing ?? [],
              length: leadData?.leads_in_processing?.length ?? 0,
            },
            {
              label: "Close-By",
              description: "Leads that are close to conversion.",
              leads: [],
              length: 0,
            },
          ],
        },
      },
      user?.data?.role === "Superadmin"
        ? {
            title: "Today's Task",
            mode: "tab",
            tabData: {
              content: [
                {
                  label: "Today",
                  description: "Tasks not yet started.",
                  length: 0,
                },
                {
                  label: "Tomorrow",
                  description: "Tasks scheduled for tomorrow.",
                  length: 0,
                },
              ],
            },
          }
        : {
            title: "Upcoming Follow Ups",
            mode: "simple",
            component: (
              <UpcomingFollowUpsList leads={todaysFollowups?.data ?? []} />
            ),
          },

      user?.data?.role === "Superadmin"
        ? {
            title: "Today's Reminders",
            mode: "tab",
            tabData: {
              content: [
                {
                  label: "Reminders",
                  description: "Today's reminders.",
                  length: 0,
                },
                {
                  label: "Meetings",
                  description: "Today's meetings.",
                  length: 0,
                },
                { label: "Events", description: "Missed events.", length: 0 },
              ],
            },
          }
        : {
            title: "Missed Follow Ups",
            mode: "simple",
            component: (
              <UpcomingFollowUpsList leads={overdueFollowups?.data ?? []} />
            ),
          },
    ],
    [leadData, user?.data?.role]
  );

  // const allowedRoles = ["Admin", "Superadmin"];
  // const hasAccess = allowedRoles.includes(user?.role);

  const legendItems = useMemo(() => {
    const items = status?.data ?? [];
    return items.map((item: any) => ({
      id: item._id,
      title: item.title,
      color: item.meta?.color_code ?? "#444",
    }));
  }, [status?.data]);

  // const legendItems = [
  //   { label: "New", color: "#2563eb" }, // blue
  //   { label: "Processing", color: "#10b981" }, // green
  //   { label: "Close-by", color: "#facc15" }, // yellow
  //   { label: "Confirm", color: "#ef4444" }, // red
  //   { label: "Cancel", color: "#8b5cf6" }, // purple

  //   { label: "Campus Visit", color: "#3b82f6" },
  //   { label: "Seat booking", color: "#f97316" },
  //   { label: "Male Nursing", color: "#eab308" },
  //   { label: "Distance Issue", color: "#14b8a6" },
  //   { label: "Fees Issue", color: "#f43f5e" },
  //   { label: "RNR", color: "#a855f7" },
  //   { label: "Switch Off / Out Of Service", color: "#22c55e" },
  //   { label: "JOB Enquiry", color: "#0ea5e9" },
  //   { label: "Others Course", color: "#6b7280" },
  //   { label: "H.S 2025", color: "#ec4899" },
  //   { label: "Agent", color: "#f59e0b" },
  // ];

  if (!leadData)
    return (
      <>
        <SkeletonLoader />
        <SkeletonLoaderCol />
      </>
    );

  return (
    <section className="dashboard-sec">
      {/* {error && <div className="text-sm text-red-500 mb-3 px-2">{error}</div>} */}
      <div className="stats  ">
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4">
          {cardsData.map((card) => (
            <LeadCard key={card.title} title={card.title}>
              {card.mode === "tab" && card.tabData ? (
                <LeadTab data={card.tabData} />
              ) : (
                card.component
              )}
            </LeadCard>
          ))}
        </div>
      </div>
      {/* <div className="sticky-notes mt-5">
        <h3 className="text-lg font-medium pb-0 ">Sticky Notes</h3>
        <Card className="mt-2">
          <CardContent className="text-center space-y-3 py-3">
            <Button>
              {" "}
              <Plus /> Add Notes
            </Button>
            <p className="text-sm">There are No Records to display</p>
          </CardContent>
        </Card>
      </div> */}

      <div className="status mt-5">
        <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
          <div className="col">
            <Card className="pt-3 sm:pt-5 relative ">
              <div className="flex justify-between items-center px-3 sm:px-6">
                <CardTitle className="text-[16px] sm:text-lg">
                  Lead Status
                </CardTitle>
                <button
                  className="p-2 rounded-md hover:bg-primary transition"
                  onClick={() => setShowMenu((prev) => !prev)}
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
              <div className="px-3 sm:px-6">
                <h3 className="font-semibold mb-1 text-[12px]">
                  {!!startDate &&
                    !!endDate &&
                    `  FROM ${startDate} to ${endDate}`}
                </h3>
                {agent !== "" && (
                  <h4 className="bg-blue-300/20 p-1 px-2 text-[10px] text-puple-300 dark:text-blue-50  font-semibold rounded w-fit">
                    {agent}
                  </h4>
                )}
              </div>

              <LeadStatusChart
                showMenu={showMenu}
                closeMenu={() => setShowMenu(false)}
                startDate={startDate}
                endDate={endDate}
                selectedAgent={selectedAgent}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onAgentChange={setSelectedAgent}
                onSetAgent={setagent}
              />

              <div className="px-4 sm:px-6 pb-0">
                <div className=" flex gap-3 md:gap-5 justify-center flex-wrap text-[10px] md:text-[11px] sm:text-xs ">
                  {legendItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-1 ">
                      <span
                        className="inline-block w-2 h-2 md:w-4 md:h-4  rounded-full border border-white"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="dark:text-gray-200 text-gray-800  ">
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="col">
            <Card className="pt-3 sm:pt-5">
              <div className="flex justify-between items-center px-3 sm:px-6">
                <CardTitle className="text-[16px] sm:text-base">
                  Lead Source
                </CardTitle>
                <button
                  className="p-2 rounded-md hover:bg-primary transition"
                  onClick={() => setShowSourceMenu((prev) => !prev)}
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
              <div className="px-3 sm:px-6">
                <h3 className="font-semibold mb-1 text-[12px]">
                  {!!sourceStartDate &&
                    !!sourceEndDate &&
                    `  FROM ${sourceStartDate} to ${sourceEndDate}`}
                </h3>
                {agent2 !== "" && (
                  <h4 className="bg-blue-300/20 p-1 px-2 text-[10px] text-puple-300 dark:text-blue-50  font-semibold rounded w-fit">
                    {agent2}
                  </h4>
                )}
              </div>
              <LeadSourceChart
                showMenu={showSourceMenu}
                closeMenu={() => setShowSourceMenu(false)}
                startDate={sourceStartDate}
                endDate={sourceEndDate}
                selectedAgent={sourceSelectedAgent}
                onStartDateChange={sourceSetStartDate}
                onEndDateChange={sourceSetEndDate}
                onAgentChange={sourceSetSelectedAgent}
                onSetAgent={setagent2}
              />
              <div className="px-4 sm:px-6 pb-2">
                <div className=" flex gap-3 md:gap-5 justify-center flex-wrap text-[10px] md:text-[11px] sm:text-xs  ">
                  {legendItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-1 ">
                      <span
                        className="inline-block w-2 h-2 md:w-4 md:h-4  rounded-full border border-white"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="dark:text-gray-200 text-gray-800  ">
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
