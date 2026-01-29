import { createFileRoute, useRouter } from "@tanstack/react-router";
import WorkspaceDetailsCard from "@/features/workspace/components/WorkspaceDetails/WorkspaceDetailsCard";
import { workspacePropertyQueryOptions } from "@/features/workspace/hooks/useWorkspaceProperty";
import { useEffect, useRef } from "react";
import { paymentService } from "@/features/payment/services/payment.service";
export const Route = createFileRoute("/_dashboardLayout/workspace-details/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(workspacePropertyQueryOptions());
  },
});
function RouteComponent() {
  const router = useRouter();
  const hasTriggeredPayment = useRef(false);

  const params = new URLSearchParams(window.location.search);
  const planId = params.get("plan");

  useEffect(() => {
    if (!planId || planId === "free") return;
    if (hasTriggeredPayment.current) return;

    hasTriggeredPayment.current = true;

    const startPayment = async () => {
      try {
        const res = await paymentService.startPayment({
          packageId: planId,
        });
        if (res?.status === "SUCCESS" && res.data?.payment_link) {
          console.log("[subscribe:success]", res);
          window.open(res.data.payment_link, "_blank");
        } else {
          console.error("[subscribe:failure]", res);
          // You might want to show a user-friendly error message here
        }
      } catch (err) {
        console.error("Payment initiation failed", err);
      }
    };

    startPayment();
  }, [planId]);

  return <WorkspaceDetailsCard />;
}
