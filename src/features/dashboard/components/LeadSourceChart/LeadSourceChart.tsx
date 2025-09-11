import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Select from "react-select";
import { Input } from "@/components/ui/input";

import { chatAgentService } from "@/features/leads/services/ChatAgents.service";
import { sourceStatsService } from "@/features/leads/services/LeadsModule.service";

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

const LeadSourceChart: React.FC<Props> = ({
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

  const fetchChartData = async () => {
    if (!selectedAgent) return;

    setIsLoading(true);
    try {
      const res = await sourceStatsService.getLeadsAccordingToSource({
        startDate,
        endDate,
        agentId: selectedAgent,
      });
      const response = res.data.data;
      setLabels(
        Array.isArray(response.sources)
          ? response.sources.map((status: any) => status.name ?? String(status))
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
          className="flex flex-col gap-3 p-4 border rounded-lg w-[350px] 
                      bg-white dark:bg-gray-800 
                      border-gray-200 dark:border-gray-700 shadow-lg
                      absolute right-5 -top-10 z-10 "
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                End Date
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-700"
              />
            </div>
          </div>

          <div className="space-y-2">
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
                      label: agents.find((agent) => agent._id === selectedAgent)
                        ?.name,
                    }
                  : null
              }
              onChange={(option: any) => {
                onAgentChange(option?.value || "");
                onSetAgent(option?.label || "");
              }}
              placeholder="Select Agent"
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "rgb(55 65 81)",
                  borderColor: "rgb(75 85 99)",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "rgb(55 65 81)",
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused
                    ? "rgb(75 85 99)"
                    : "rgb(55 65 81)",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "rgb(243 244 246)",
                }),
                input: (base) => ({
                  ...base,
                  color: "rgb(243 244 246)",
                }),
              }}
            />
          </div>

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

      <div className="w-full pt-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : hasFetched && series.length === 0 ? (
          <div className="h-64 flex flex-col gap-3 justify-center items-center rounded-lg">
            <h5 className="text-2xl font-medium text-gray-700 dark:text-gray-300">
              No Leads Found
            </h5>
            <h6 className="text-lg text-gray-500 dark:text-gray-400">0</h6>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Try adjusting your filters or date range
            </p>
          </div>
        ) : series.length > 0 ? (
          <div className="bg-primary p-4 rounded-lg shadow">
            <Chart
              options={{
                chart: {
                  type: "donut",
                  foreColor: "#6B7280",
                },
                labels,
                legend: {
                  position: "bottom",
                  labels: {
                    colors: ["#6B7280"],
                  },
                },
                tooltip: {
                  theme: "dark",
                  y: {
                    formatter: (val: number) => `${val} leads`,
                  },
                },
                plotOptions: {
                  pie: {
                    donut: {
                      labels: {
                        show: true,
                        total: {
                          show: true,
                          label: "Leads Source",
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#6B7280",
                          formatter: () => {
                            const total = series.reduce(
                              (sum, val) => sum + val,
                              0
                            );
                            return `${total}`;
                          },
                        },
                      },
                    },
                  },
                },
                dataLabels: {
                  formatter: (val: number) => `${Math.round(val)}%`,
                  style: {
                    colors: ["#fff"],
                  },
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
                      chart: {
                        width: 200,
                      },
                      legend: {
                        position: "bottom",
                      },
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
          <div className="h-40  my-2 flex flex-col gap-3 justify-center items-center">
            <h5 className="text-2xl">No Lead Found</h5>
            <h6 className="text-lg">0</h6>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadSourceChart;
