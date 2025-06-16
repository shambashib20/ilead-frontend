import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LeadOptions from "@/features/leads/components/LeadOptions";
import LeadSearch from "@/features/leads/components/LeadSearch";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ChevronsDown } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_dashboardLayout/lead")({
  component: RouteComponent,
});

function RouteComponent() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      <section className="leads-sec mt-7">
        <Card className="relative">
          <div
            className={`space-y-2 relative overflow-hidden transition-all duration-500 ${expanded ? "h-auto" : "h-12"}`}
          >
            <CardHeader className="px-5">
              <LeadOptions />
            </CardHeader>
            <CardContent>
              <LeadSearch />
            </CardContent>
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

        <Outlet />
      </section>
    </div>
  );
}
