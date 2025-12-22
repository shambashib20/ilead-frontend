import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Features from "@/features/packagesMaster/components/Features";
import Packages from "@/features/packagesMaster/components/Packages";
import { packagesQueryOptions } from "@/features/packagesMaster/hooks/usePackages";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_masterLayout/masterpannel/packages/")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(packagesQueryOptions());
  },
});

function RouteComponent() {
  return (
    <section className="mt-4 space-y-5">
      <div className="sec-head p-5 shadow-lead bg-primary ">
        <h3 className="text-xl text-foreground font-semibold ">
          Package Management
        </h3>
      </div>
      <div className="p-5 shadow-lead bg-primary">
        <Tabs defaultValue="packages">
          <TabsList>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>
          <TabsContent value="packages">
            <Packages />
          </TabsContent>
          <TabsContent value="features">
            <Features />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
