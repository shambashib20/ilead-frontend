import { useQuery } from "@tanstack/react-query";
import { useWorkspaceProperty } from "@/features/workspace/hooks/useWorkspaceProperty";
import { useWapmonkeyDevices } from "../../hooks/useWapmonkeyDevices";
import { chatAgentService } from "@/features/leads/services/ChatAgents.service";
import { format } from "date-fns";
import { RefreshCw, Wifi, WifiOff, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SkeletonTableLoader from "@/components/SkeletonTableLoader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function WapMonkeyDevicesTable() {
  const { properties } = useWorkspaceProperty();
  const apiKey = properties?.meta?.wapmonkey_api_key as string | undefined;

  const {
    data: devicesData,
    isLoading: isDevicesLoading,
    error: devicesError,
    refetch,
    isFetching,
  } = useWapmonkeyDevices(apiKey);

  const { data: agentsData, isLoading: isAgentsLoading } = useQuery({
    queryKey: ["agents"],
    queryFn: () => chatAgentService.chatAgents(),
    staleTime: 5 * 60 * 1000,
  });

  const agents = agentsData?.data?.data ?? [];
  const allDevices = devicesData?.data ?? [];

  const agentNameSet = new Set(
    agents.map((a) => a.name.trim().toLowerCase())
  );

  const matchedDevices = allDevices.filter((d) =>
    agentNameSet.has(d.device_name.trim().toLowerCase())
  );

  const isLoading = isDevicesLoading || isAgentsLoading;

  if (!apiKey) {
    return (
      <div className="bg-white dark:bg-primary shadow-lead p-4 rounded-lg text-sm text-gray-500 dark:text-gray-400">
        No WapMonkey API key configured. Please add your API key above.
      </div>
    );
  }

  return (
    <div className="mt-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-primary shadow-lead p-4 mb-6 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
            <Smartphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
              WhatsApp Device Status
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing devices assigned to telecallers on this platform
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {matchedDevices.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Devices
            </div>
          </div>
          <Button
            size="icon"
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh devices"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-lg shadow-lead bg-primary overflow-hidden">
        {isLoading ? (
          <div className="p-8">
            <SkeletonTableLoader />
          </div>
        ) : devicesError ? (
          <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
            Failed to load devices.{" "}
            <button className="underline text-blue-600 dark:text-blue-400" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-primary">
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4">
                  Telecaller
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4">
                  Mobile No.
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4">
                  Device ID
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4">
                  Last Updated
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matchedDevices.length > 0 ? (
                matchedDevices.map((device, index) => (
                  <TableRow
                    key={device.d_id}
                    className={`border-b border-gray-100 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30 ${
                      index % 2 === 0
                        ? "bg-white dark:bg-primary/40"
                        : "bg-gray-50/50 dark:bg-gray-800/20"
                    }`}
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {device.device_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {device.device_name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 font-mono text-gray-600 dark:text-gray-300">
                      +{device.mobile_no}
                    </TableCell>
                    <TableCell className="py-4">
                      {device.device_status === "Connected" ? (
                        <Badge className="bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 flex items-center gap-1 w-fit">
                          <Wifi className="h-3 w-3" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800 flex items-center gap-1 w-fit">
                          <WifiOff className="h-3 w-3" />
                          {device.device_status}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-4 text-gray-600 dark:text-gray-300">
                      {device.d_id}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <div className="text-gray-600 dark:text-gray-300 text-sm">
                          {format(new Date(device.updated_at), "MMM d, yyyy")}
                        </div>
                        <div className="text-gray-400 dark:text-gray-500 text-xs">
                          {format(new Date(device.updated_at), "hh:mm a")}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Smartphone className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                      <div className="text-lg font-medium text-gray-500 dark:text-gray-400">
                        No matching devices found
                      </div>
                      <div className="text-sm text-gray-400 dark:text-gray-500">
                        No WapMonkey devices matched to your platform's telecallers
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
