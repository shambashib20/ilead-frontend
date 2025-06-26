import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboardLayout/lead/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-[1000px] mx-auto">
      {" "}
      <div className="overflow-x-auto">
        {" "}
        <div className="mt-10 inline-flex ">
          {" "}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[300px] rounded-lg bg-transparent "
            >
              {/* Header */}
              <div className="  px-4 rounded-t-lg rounded-md">
                <h3 className="font-semibold py-2 px-3 bg-purple-600 text-white">
                  Column {i + 1}
                </h3>
              </div>

              {/* Body - list of cards */}
              <div className=" px-4 space-y-2 max-h-[500px] overflow-y-auto">
                {[...Array(5)].map((_, j) => (
                  <div
                    key={j}
                    className="bg-primary rounded p-2 shadow text-sm "
                  >
                    <p className="font-medium">Name: User {j + 1}</p>
                    <p>Phone: 91XXXXXXX{j}</p>
                    <p className="text-xs">Address: Some Street</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
