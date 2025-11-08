import WhatsappAutomationFilter from "@/features/automations/components/WhatsappAutomationFilter";
import WhatsappAutomationResult from "@/features/automations/components/WhatsappAutomationResult";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_dashboardLayout/whatsapp-automation-rules/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="mt-5 space-y-6">
        <WhatsappAutomationFilter />
        <WhatsappAutomationResult />
      </div>
    </div>
  );
}
