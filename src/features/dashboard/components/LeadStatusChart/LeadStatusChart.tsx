import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Card, CardContent } from "@/components/ui/card";
import Select from "react-select";
import { Input } from "@/components/ui/input";

import { chatAgentService } from "@/features/leads/services/ChatAgents.service";
import { statsService } from "@/features/leads/services/LeadsModule.service";

const LeadStatusChart = () => {
  const [labels, setLabels] = useState<string[]>([]);
  const [series, setSeries] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>("");

  const fetchChartData = async () => {
    if (!selectedAgent) return;

    try {
      const res = await statsService.getLeadsAccordingToStatus({
        startDate,
        endDate,
        agentId: selectedAgent,
      });
      const response = res.data.data;
      setLabels(
        Array.isArray(response.labels)
          ? response.labels.map((status: any) => status.name ?? String(status))
          : []
      );
      setSeries(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch chart data:", err);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await chatAgentService.chatAgents(); // Adjust this based on your actual API
      setAgents(res.data.data);
    } catch (err) {
      console.error("Failed to fetch agents:", err);
    }
  };

  useEffect(() => {
    fetchAgents();
    fetchChartData();
  }, [startDate, endDate, selectedAgent]);

  return (
    <Card>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
          <Select
            options={agents.map((agent) => ({
              value: agent._id,
              label: agent.name,
            }))}
            onChange={(option) => setSelectedAgent(option?.value || "")}
            placeholder="Select Agent"
          />
        </div>

        <Chart
          options={{
            chart: {
              type: "donut",
            },
            labels,
            legend: {
              position: "bottom",
            },
            tooltip: {
              y: {
                formatter: (val: number) => `${Math.round(val)}`,
              },
            },
            dataLabels: {
              formatter: function (val: number) {
                return `${Math.round(val)}%`;
              },
            },
          }}
          series={series}
          type="donut"
          width="100%"
        />
      </CardContent>
    </Card>
  );
};

export default LeadStatusChart;
