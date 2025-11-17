import WhatsappAutomationFilter from "@/features/automations/components/WhatsappAutomationFilter";
import WhatsappAutomationResult from "@/features/automations/components/WhatsappAutomationResult";
import { automationsQueryOptions } from "@/features/automations/hooks/useAutomation";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_dashboardLayout/whatsapp-automation-rules/"
)({
  component: RouteComponent,
  loader: (ctx) => {
    ctx.context.queryClient.ensureQueryData(automationsQueryOptions());
  },
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
