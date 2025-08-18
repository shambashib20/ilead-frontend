import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Select from "react-select";
import { Input } from "@/components/ui/input";

import { chatAgentService } from "@/features/leads/services/ChatAgents.service";
import { sourceStatsService } from "@/features/leads/services/LeadsModule.service";

interface Props {
  showMenu: boolean;
  startDate: string;
  endDate: string;
  selectedAgent: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onAgentChange: (value: string) => void;
}

const LeadSourceChart: React.FC<Props> = ({
  showMenu,
  startDate,
  endDate,
  selectedAgent,
  onStartDateChange,
  onEndDateChange,
  onAgentChange,
}) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [series, setSeries] = useState<number[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  const fetchChartData = async () => {
    if (!selectedAgent) return;

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

  return (
    <>
      {showMenu && (
        <div
          className="flex flex-col gap-4 mt-4 mb-6 p-4 border rounded-lg max-w-md mx-auto 
                        bg-white dark:bg-gray-900 
                        border-gray-200 dark:border-gray-700"
        >
          <label className="text-sm font-bold text-gray-700 dark:text-gray-200">
            Start Date
          </label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
          />

          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
            End Date
          </label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
          />

          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Select Agent
          </label>
          <Select
            options={agents.map((agent) => ({
              value: agent._id,
              label: agent.name,
            }))}
            onChange={(option) => onAgentChange(option?.value || "")}
            placeholder="Select Agent"
            className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
          />

          <button
            onClick={fetchChartData}
            className="mt-2 px-4 py-2 
                       bg-blue-600 text-white rounded-md 
                       hover:bg-blue-700 transition 
                       dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      )}

      {hasFetched && series.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
          No leads found
        </p>
      ) : (
        series.length > 0 && (
          <Chart
            options={{
              chart: {
                type: "donut",
              },
              labels,
              legend: {
                position: "bottom",
                labels: {
                  colors: ["#374151", "#d1d5db"], // gray-700 for light, gray-300 for dark
                },
              },
              tooltip: {
                theme: "dark", // auto switches tooltip to dark
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
                        color: "var(--tw-prose-body, #111827)",
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
              },
            }}
            series={series}
            type="donut"
            width="100%"
          />
        )
      )}
    </>
  );
};

export default LeadSourceChart;
