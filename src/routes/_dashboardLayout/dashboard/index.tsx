import LeadCard from "@/features/dashboard/components/LeadCard";
import LeadTab from "@/features/dashboard/components/LeadTab";
import type { LeadTabType } from "@/features/dashboard/components/LeadTab/LeadTab";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_dashboardLayout/dashboard/")({
  component: RouteComponent,
});

type DashboardCardType = {
  title: string;
  tabData: LeadTabType;
};

function RouteComponent() {
  // const currentLeads;
  const cardsData: DashboardCardType[] = [
    {
      title: "Today's Lead",
      tabData: {
        content: [
          { label: "New", description: "Leads that are new." },
          { label: "Processing", description: "Leads currently in process." },
          {
            label: "Close-By",
            description: "Leads that are close to conversion.",
          },
        ],
      },
    },
    {
      title: "Today's Task",
      tabData: {
        content: [
          { label: "Today", description: "Tasks not yet started." },
          { label: "Tommorow", description: "Tasks currently happening." },
        ],
      },
    },
    {
      title: "Today's Reminders",
      tabData: {
        content: [
          { label: "Reminders", description: "Today's reminders." },
          { label: "Meetings", description: "Reminders coming soon." },
          { label: "Events", description: "You missed these." },
        ],
      },
    },
  ];
  return (
    <section className="dashboard-sec">
      <div className="stats  ">
        <div className="grid grid-cols-3 gap-7">
          {cardsData.map((card, idx) => (
            <LeadCard key={idx} title={card.title}>
              <LeadTab data={card.tabData} />
            </LeadCard>
          ))}
        </div>
      </div>
      <div className="sticky-notes mt-5">
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
      </div>

      <div className="status mt-5">
        <div className="grid grid-cols-2 gap-7">
          <div className="col">
            <Card>
              <CardHeader>
                <CardTitle>Lead Status</CardTitle>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
          </div>
          <div className="col">
            <Card>
              <CardHeader>
                <CardTitle>Lead Source</CardTitle>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
