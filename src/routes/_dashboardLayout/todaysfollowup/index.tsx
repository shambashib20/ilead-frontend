import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  todaysLeadQueryOptions,
  useTodaysLead,
} from "@/features/dashboard/hooks/useTodaysLead";
import { useStatus } from "@/features/leads/hooks/useStatus";
import type { Lead } from "@/features/leads/types";
import { LeadGridView } from "@/features/todaysLead/components/TodaysLeadGrid";
import TodaysLeadTable from "@/features/todaysLead/components/TodaysLeadTable";
import { useMedia } from "@/hooks/useMedia";
import { createFileRoute } from "@tanstack/react-router";
import { ChartColumnBig, ChevronsDown, List } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_dashboardLayout/todaysfollowup/")({
  component: RouteComponent,
  loader: (opts) => {
    opts.context.queryClient.ensureQueryData(todaysLeadQueryOptions());
  },
});

function RouteComponent() {
  const { newLeads } = useTodaysLead();
  const [expanded, setExpanded] = useState(true);
  const [isTableView, setIsTableView] = useState(false);
  const isMobile = useMedia("(max-width: 767px)");
  const { status } = useStatus();

  console.log(newLeads);
  console.log(status);

  return (
    <section className="todays-lead">
      <div>
        <div className="lead-card">
          <Card className="relative">
            <div
              className={`space-y-2 relative overflow-hidden transition-all duration-500 ${expanded ? "h-auto" : "h-12"}`}
            >
              <CardHeader className="px-5">
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
                    Leads
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent></CardContent>
            </div>
            <Button
              onClick={() => setExpanded((prev) => !prev)}
              className="rounded-full absolute left-2/4 -translate-x-2/4 -bottom-5 z-30"
              size="icon"
            >
              <ChevronsDown
                className={`transition-transform duration-300 ${
                  expanded ? "rotate-180" : ""
                }
                 `}
              />
            </Button>
          </Card>
        </div>
        <div className="lead-view  mt-8">
          <Card>
            <CardContent>
              {isTableView ? (
                <div>
                  <TodaysLeadTable data={newLeads as Lead[]} />
                </div>
              ) : (
                <LeadGridView leads={newLeads} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
