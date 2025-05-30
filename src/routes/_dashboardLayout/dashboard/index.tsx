import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboardLayout/dashboard/")({
  component: RouteComponent,
  // loader: ({ context }) => {
  //   context.queryClient.ensureQueryData({
  //     queryKey: ["dashboardData"],
  //     queryFn: async () => {
  //       // Simulate fetching data
  //       return new Promise((resolve) => {
  //         setTimeout(() => resolve({ message: "Dashboard data loaded" }), 1000);
  //       });
  //     },
  //   });
  // },
});

function RouteComponent() {
  // const { data, isLoading } = useSuspenseQuery({
  //   queryKey: ["dashboardData"],
  //   queryFn: async () => {
  //     // Simulate fetching data
  //     return new Promise((resolve) => {
  //       setTimeout(() => resolve({ message: "Dashboard data loaded" }), 1000);
  //     });
  //   },
  // });

  // const data = useL();
  // console.log("Data loaded:", data);
  return (
    <section className="dashboard-sec">
      <div className="stats">
        <div className="grid grid-cols-3 gap-8">
          <div className="col">
            <Card className="py-2">
              <CardHeader className="border-b pt-1 [.border-b]:pb-1 text-center">
                <CardTitle className="font-medium pb-1">
                  Today's Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          </div>
          <div className="col">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
                <CardAction>Card Action</CardAction>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          </div>
          <div className="col">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
                <CardAction>Card Action</CardAction>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
