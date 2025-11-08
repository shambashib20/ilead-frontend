import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_dashboardLayout/whatsapp-automation-rules/insert-update/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mt-8">
      <Card>
        <div className="head  border-b border-gray-200 pb-4">
          <div className="flex justify-between px-6">
            <h3 className="text-foreground text-2xl font-medium">
              Add Whatsapp Automation Rules
            </h3>
            <Button variant={"outline"}>Back</Button>
          </div>
        </div>

        <Tabs defaultValue="lead" className=" mt-3">
          <div className="head-2 px-6 ">
            <div className="border-b border-gray-200  pb-5 ">
              <div>
                <h4 className="text-foreground text-xl font-medium">
                  Select Automation Type
                </h4>
              </div>

              <TabsList className="flex gap-3 bg-transparent p-0 max-w-3xl w-full mt-3 mx-auto">
                <TabsTrigger
                  value="lead"
                  className="flex-1 rounded-md py-3 text-sm font-semibold border-2 border-gray-200 data-[state=active]:border-transparent data-[state=active]:bg-blue-700 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700 hover:bg-purple-100 transitsion-all duration-200 data-[state=active]:[border-image:[none]"
                >
                  Lead Automation
                </TabsTrigger>

                <TabsTrigger
                  value="meeting"
                  className="flex-1 rounded-md py-3 text-sm font-semibold border-2 border-gray-200 data-[state=active]:border-transparent data-[state=active]:bg-blue-700 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700 hover:bg-purple-100 transition-all duration-200 data-[state=active]:[border-image:[none]"
                >
                  Meeting Automation
                </TabsTrigger>

                <TabsTrigger
                  value="invoice"
                  className="flex-1 rounded-md py-3 text-sm font-semibold border-2 border-gray-200 data-[state=active]:border-transparent data-[state=active]:bg-blue-700 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700 hover:bg-purple-100 transition-all duration-200 data-[state=active]:[border-image:[none]"
                >
                  Invoice Automation
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="content mt-3">
            <TabsContent value="lead" className="">
              <div className="flex justify-between px-6">
                <h3 className="text-foreground text-xl font-medium">
                  Select Lead Type
                </h3>
                <Button variant={"outline"}>Back</Button>
              </div>
              <div className="w-full mx-auto">
                <Tabs defaultValue="account" className="">
                  <TabsList className="flex gap-3 bg-transparent p-0 max-w-xl w-full mt-3 mx-auto ">
                    <TabsTrigger
                      value="account"
                      className="flex-1 rounded-md py-3 text-sm font-semibold border-2 border-gray-200 data-[state=active]:border-transparent data-[state=active]:bg-blue-700 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700 hover:bg-purple-100 transitsion-all duration-200 data-[state=active]:[border-image:[none]"
                    >
                      Account
                    </TabsTrigger>
                    <TabsTrigger
                      value="password"
                      className="flex-1 rounded-md py-3 text-sm font-semibold border-2 border-gray-200 data-[state=active]:border-transparent data-[state=active]:bg-blue-700 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700 hover:bg-purple-100 transitsion-all duration-200 data-[state=active]:[border-image:[none]"
                    >
                      Password
                    </TabsTrigger>
                  </TabsList>
                  <div className="px-6 mt-3">
                    <div className=" w-full border-t border-gray-200  ">
                      <TabsContent value="account">
                        Make changes to your account here.
                      </TabsContent>
                      <TabsContent value="password">
                        Change your password here.
                      </TabsContent>
                    </div>
                  </div>
                </Tabs>
              </div>
            </TabsContent>

            <TabsContent value="meeting" className="">
              Manage your meeting automations here.
            </TabsContent>

            <TabsContent value="invoice" className="">
              Set up invoice automations here.
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}
