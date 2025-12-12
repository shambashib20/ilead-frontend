import { Input } from "@/components/ui/input";
import { chatAgentService } from "@/features/leads/services/ChatAgents.service";
import { statsService } from "@/features/leads/services/LeadsModule.service";
import Select from "react-select";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@/contexts/ThemeProvider";
import { getData } from "@/utils/localStorage";

export const statusColorMap = new Map<string, string>([
  ["New", "#056681"],
  ["Processing", "#3a3285"],
  ["Agent", "#fac940"],
  ["Confirm", "#486e03"],
  ["H.S 2025", "#659b03"],
  ["Switch Off/ Out of Service", "#c62f2f"],
  ["RNR", "#fb8f13"],
  ["Fees Issue", "#dfb9b9"],
  ["Distance Issue", "#1f34d1"],
  ["Close-By", "#659b03"],
  ["Campus Visit", "#fac940"],
  ["Seat booking", "#a05a5a"],
  ["Others Course", "#486e03"],
  ["JOB Enquiry", "#056681"],
  ["Male Nursing", "#959a44"],
  ["Cancel", "#e60023"],
]);

interface Props {
  showMenu: boolean;
  closeMenu: () => void;
  startDate: string;
  endDate: string;
  selectedAgent: string;

  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onAgentChange: (value: string) => void;
  onSetAgent: (value: string) => void;
}

const LeadStatusChart: React.FC<Props> = ({
  showMenu,
  closeMenu,
  startDate,
  endDate,
  selectedAgent,
  onStartDateChange,
  onEndDateChange,
  onAgentChange,
  onSetAgent,
}) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [series, setSeries] = useState<number[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { theme } = useTheme();
  const user = getData("user");
  const fetchChartData = async () => {
    if (!selectedAgent) return;

    setIsLoading(true);
    try {
      const res = await statsService.getLeadsAccordingToStatus({
        startDate,
        endDate,
        agentId: user?.role === "Superadmin" ? selectedAgent : user?._id,
      });
      const response = res.data.data;
      setLabels(
        Array.isArray(response.labels)
          ? response.labels.map((status: any) => status.name ?? String(status))
          : []
      );
      setSeries(Array.isArray(response.data) ? response.data : []);
      setHasFetched(true);
    } catch (err) {
      console.error("Failed to fetch chart data:", err);
      setHasFetched(true);
    } finally {
      setIsLoading(false);
      closeMenu();
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await chatAgentService.chatAgents();
      setAgents(res.data.data);
    } catch (err) {
      console.error("Failed to fetch agents:", err);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // Auto-fetch data when agent is selected and dates are set
  useEffect(() => {
    if (selectedAgent && startDate && endDate) {
      fetchChartData();
    }
  }, [selectedAgent, startDate, endDate]);

  return (
    <div className="relative w-full">
      {showMenu && (
        <div
          className="
  flex flex-col gap-5 mt-4 mb-6 p-4 
  border border-gray-100 dark:border-border rounded-lg shadow-md 
  w-[90%] max-w-full md:w-[350px]
  bg-white dark:bg-[#1a2e4f]
  mx-auto 
  absolute
  left-2/4
  -translate-x-2/4
  top-[-40px]
  right-0
  md:mx-0 md:-translate-x-28 md:right-6 md:-top-10
  z-30
"
        >
          <div className="grid grid-cols-2 gap-4 items-start">
            <div className="flex flex-col gap-2">
              <label className="text-sm   font-medium text-gray-700 dark:text-gray-200">
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="bg-transparent dark:bg-transparent cursor-pointer  "
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                End Date
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="bg-transparent dark:bg-transparent cursor-pointer"
              />
            </div>
          </div>

          {user.role === "Superadmin" && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Select Agent
              </label>
              <Select
                options={agents.map((agent) => ({
                  value: agent._id,
                  label: agent.name,
                }))}
                value={
                  agents.find((agent) => agent._id === selectedAgent)
                    ? {
                        value: selectedAgent,
                        label: agents.find(
                          (agent) => agent._id === selectedAgent
                        )?.name,
                      }
                    : null
                }
                onChange={(option: any) => {
                  onAgentChange(option?.value || "");
                  onSetAgent(option.label);
                }}
                placeholder="Select Agent"
                className="react-select-container  "
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: theme === "dark" ? "#1a2e4f" : "#fff",
                    borderColor: theme === "dark" ? "#284678" : "#ddd",
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor:
                      theme === "dark" ? "rgb(55 65 81)" : "#fff",
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused
                      ? theme === "dark"
                        ? "rgb(75 85 99)"
                        : "#ddd"
                      : theme === "dark"
                        ? "rgb(55 65 81)"
                        : "#fff",
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: "rgb(243 244 246)",
                  }),
                  input: (base) => ({
                    ...base,
                    color: "rgb(243 244 246)",
                    cursor: "pointer",
                  }),
                }}
              />
            </div>
          )}

          <button
            onClick={fetchChartData}
            disabled={isLoading}
            className="mt-2 px-4 py-2 
                       bg-blue-600 text-white rounded-md 
                       hover:bg-blue-700 transition 
                       dark:bg-blue-500 dark:hover:bg-blue-600
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Apply Filters"}
          </button>
        </div>
      )}

      <div className="w-full mt-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : hasFetched && series.length === 0 ? (
          <div className="text-center py-12  rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No leads found for the selected criteria
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Try adjusting your filters or date range
            </p>
          </div>
        ) : series.length > 0 ? (
          <div className=" p-4 rounded-lg shadow">
            <Chart
              options={{
                chart: {
                  type: "donut",
                  foreColor: "#6B7280",
                },
                labels,
                colors: labels.map(
                  (label) => statusColorMap.get(label) || "#999999"
                ),
                legend: {
                  position: "bottom",
                  labels: { colors: ["#6B7280"] },
                },
                tooltip: {
                  theme: "dark",
                  y: { formatter: (val: number) => `${val} leads` },
                },
                plotOptions: {
                  pie: {
                    donut: {
                      labels: {
                        show: true,
                        total: {
                          show: true,
                          label: "Total Leads",
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#6B7280",
                          formatter: () =>
                            series
                              .reduce((sum, val) => sum + val, 0)
                              .toString(),
                        },
                      },
                    },
                  },
                },
                dataLabels: {
                  style: { colors: ["#fff"] },
                  dropShadow: {
                    enabled: true,
                    top: 1,
                    left: 1,
                    blur: 1,
                    opacity: 0.45,
                  },
                },
                responsive: [
                  {
                    breakpoint: 480,
                    options: {
                      chart: { width: 300 },
                      legend: { position: "bottom" },
                    },
                  },
                ],
              }}
              series={series}
              type="donut"
              width="100%"
            />
          </div>
        ) : (
          <div className="h-20 md:h-25  my-2  flex flex-col gap-3 justify-center items-center">
            <h5 className="text-base md:text-2xl ">No Lead Found</h5>
            <h6 className="text-lg">0</h6>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadStatusChart;
