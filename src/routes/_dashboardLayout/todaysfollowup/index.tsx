import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TodaysFollowupsQueryOptions,
  useTodaysChatFollowUps,
} from "@/features/dashboard/hooks/useTodaysChatFollowUps";
import { useStatus } from "@/features/leads/hooks/useStatus";
import { LeadGridView } from "@/features/todaysLead/components/TodaysLeadGrid";
import TodaysLeadTable from "@/features/todaysLead/components/TodaysLeadTable";
import { useMedia } from "@/hooks/useMedia";
import { createFileRoute } from "@tanstack/react-router";
import { ChartColumnBig, ChevronsDown, List } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_dashboardLayout/todaysfollowup/")({
  component: RouteComponent,
  loader: (opts) => {
    opts.context.queryClient.ensureQueryData(TodaysFollowupsQueryOptions());
  },
});

function RouteComponent() {
  const {
    todaysFollowups,
    totalUpcomingFollowups,
    agentWiseCount,
    isSuperAdmin,
  } = useTodaysChatFollowUps();

  const [expanded, setExpanded] = useState(true);
  const [isTableView, setIsTableView] = useState(false);
  const isMobile = useMedia("(max-width: 767px)");
  const { status } = useStatus();

  return (
    <section className="todays-lead mt-5">
      <div>
        <div className="lead-card">
          <Card className="relative">
            <div
              className={`space-y-2 relative overflow-hidden transition-all duration-500 ${
                expanded ? "h-auto" : "h-12"
              }`}
            >
              <CardHeader className="px-5">
                <div className="flex items-start gap-3 justify-between">
                  <div className="flex items-center gap-3">
                    <div className="views">
                      <ul className="flex items-center rounded-[4px] border border-primary-foreground text-btn-bg dark:border-blue-500">
                        <li>
                          <button
                            className={`p-1.5 border-e border-bg-btn cursor-pointer ${
                              !isTableView ? "bg-blue-500/10" : ""
                            }`}
                            onClick={() => setIsTableView(false)}
                          >
                            <ChartColumnBig
                              size={isMobile ? 14 : 20}
                              className="text-primary-foreground dark:text-blue-500"
                            />
                          </button>
                        </li>
                        <li>
                          <button
                            className={`p-1.5 cursor-pointer ${
                              isTableView ? "bg-blue-500/10" : ""
                            }`}
                            onClick={() => setIsTableView(true)}
                          >
                            <List
                              size={isMobile ? 14 : 20}
                              className="text-primary-foreground dark:text-blue-500"
                            />
                          </button>
                        </li>
                      </ul>
                    </div>
                    <CardTitle className="text-lg md:text-2xl font-medium">
                      Today's Follow-ups
                    </CardTitle>
                  </div>

                  {/* Show total count */}
                  <div className="text-xl text-primary-foreground flex flex-col gap-3 items-end bg-blue-50 dark:bg-primary-foreground/20 p-4 rounded-md">
                    Upcoming Follow Ups{" "}
                    <span className="font-semibold text-3xl">
                      {totalUpcomingFollowups}
                    </span>
                  </div>
                </div>
              </CardHeader>

              {/* Show agent-wise count for SuperAdmin */}
              {isSuperAdmin && agentWiseCount.length > 0 && expanded && (
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {agentWiseCount.map((agent) => (
                      <div
                        key={agent.agent_id}
                        className="bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-800"
                      >
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {agent.agent_name}:
                        </span>
                        <span className="ml-2 text-sm font-bold text-blue-600 dark:text-blue-400">
                          {agent.lead_count}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </div>
            <Button
              onClick={() => setExpanded((prev) => !prev)}
              className="rounded-full absolute left-2/4 -translate-x-2/4 -bottom-5 z-30"
              size="icon"
            >
              <ChevronsDown
                className={`transition-transform duration-300 ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </Button>
          </Card>
        </div>

        <div className="lead-view mt-8">
          <Card>
            <CardContent>
              {isTableView ? (
                <div>
                  <TodaysLeadTable data={todaysFollowups as any} />
                </div>
              ) : (
                <LeadGridView leads={todaysFollowups} status={status} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
