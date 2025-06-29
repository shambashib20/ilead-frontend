import {
  currentLabelsQueryOptions,
  useGetCurrentLeads,
} from "@/features/leads/hooks/useGetCurrentLeads";
import { useLeadsStatus } from "@/features/leads/hooks/useLeadsStatus";
import { statusColorMap } from "@/features/leads/utils/constants";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboardLayout/lead/")({
  component: RouteComponent,
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData(currentLabelsQueryOptions());
  },
});

function RouteComponent() {
  const { lables, isLoading } = useGetCurrentLeads();
  const { status } = useLeadsStatus();
  console.log(lables);

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="w-[1000px] mx-auto">
      {" "}
      <div className="overflow-x-auto">
        {" "}
        <div className="mt-10 inline-flex gap-4">
          {status.data.length !== 0 &&
            status.data.map((statusItem) => {
              const isConfirm = statusItem.title.toLowerCase() === "confirm";

              return (
                <div
                  key={statusItem._id}
                  className="flex-shrink-0 w-[310px] rounded-lg bg-transparent"
                >
                  <div className="px-4 mb-5">
                    <h3
                      className={`font-semibold py-2 px-3 rounded text-white ${
                        "bg-[" +
                        (statusColorMap.get(statusItem.title) || "gray") +
                        "]"
                      }`}
                    >
                      {statusItem.title}
                    </h3>
                  </div>

                  <div className="px-4 space-y-2 max-h-[500px] overflow-y-auto">
                    {isConfirm ? (
                      lables.data.slice(0, 10).map((label) => (
                        <div
                          key={label._id}
                          className="bg-primary rounded-lg p-3 shadow hover:shadow-lg transition-all"
                        >
                          <h4 className="text-sm font-medium">{label.title}</h4>
                          <p className="text-xs text-gray-500">
                            {label.description}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 italic">No leads</p>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
