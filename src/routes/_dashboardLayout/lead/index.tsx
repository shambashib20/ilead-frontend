import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboardLayout/lead/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full">
      {" "}
      <div className="overflow-x-auto">
        {" "}
        <div className="mt-10 inline-flex space-x-2">
          {" "}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[300px] rounded-lg border shadow bg-white"
            >
              {/* Header */}
              <div className="bg-purple-600 text-white px-4 py-2 rounded-t-lg">
                <h3 className="font-semibold">Column {i + 1}</h3>
              </div>

              {/* Body - list of cards */}
              <div className="p-2 space-y-2 max-h-[500px] overflow-y-auto">
                {[...Array(5)].map((_, j) => (
                  <div
                    key={j}
                    className="bg-gray-100 rounded p-2 shadow text-sm"
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
