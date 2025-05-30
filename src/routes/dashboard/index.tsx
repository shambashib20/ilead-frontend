import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
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
        <div className="grid grid-cols-3">
          <div className="col">card</div>
          <div className="col">card</div>
          <div className="col">card</div>
        </div>
      </div>
    </section>
  );
}
