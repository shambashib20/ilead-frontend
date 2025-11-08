import { pricingPlansQueryOptions } from "@/features/payment/hooks/usePricingPlans";
import { createFileRoute } from "@tanstack/react-router";

import { pricingAddonsQueryOptions } from "@/features/payment/hooks/usePricingAddons";
import Packages365 from "@/features/payment/components/365Packages/365Packages";
import AddonsPackages from "@/features/payment/components/365Addons";

export const Route = createFileRoute("/_dashboardLayout/add-package/")({
  component: RouteComponent,
  loader: (opts) => {
    opts.context.queryClient.ensureQueryData(pricingPlansQueryOptions());
    opts.context.queryClient.ensureQueryData(pricingAddonsQueryOptions());
  },
});

function RouteComponent() {
  return (
    <>
      <Packages365 />
      <AddonsPackages />
    </>
  );
}

export default RouteComponent;
