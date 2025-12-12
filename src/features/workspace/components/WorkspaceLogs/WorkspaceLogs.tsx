import { useEffect, useState } from "react";
import { PropertyModule } from "@/features/workspace/services/Property.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react";
import { useWorkspaceProperty } from "../../hooks/useWorkspaceProperty";

// const STATUS_COLORS: Record<string, string> = {
//   INFO: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
//   WARNING:
//     "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
//   ERROR: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
//   ACTION: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
//   SYSTEM: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
// };

const STATUS_CONFIG = {
  success: {
    color:
      "bg-green-500/10 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-800",
    icon: CheckCircle,
  },
  error: {
    color:
      "bg-red-500/10 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-800",
    icon: AlertCircle,
  },
  warning: {
    color:
      "bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-800",
    icon: AlertCircle,
  },
  info: {
    color:
      "bg-blue-500/10 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-800",
    icon: FileText,
  },
  default: {
    color: "bg-muted text-muted-foreground border-border",
    icon: FileText,
  },
};

export default function WorkspaceLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [propertyName, setPropertyName] = useState<string>(""); // 🆕 Add state for name
  const [loading, setLoading] = useState(true);
  const { properties } = useWorkspaceProperty();
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await new PropertyModule().getProperty();
        const logsData = response.data.data.logs || [];
        const name = response.data.data.name || "Workspace";

        // Sort logs by createdAt descending
        const sortedLogs = [...logsData].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setLogs(sortedLogs);
        setPropertyName(name);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  console.log(properties);

  return (
    <Card className="max-w-full mx-auto border border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300 mt-5">
      <CardHeader className="pb-3 border-b border-border/50">
        {loading ? (
          <div className="flex items-center space-x-3">
            <Skeleton className="h-5 w-5 rounded-md" />
            <Skeleton className="h-6 w-48" />
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/5">
              <img
                src={properties?.meta?.profile_picture_data?.file_url}
                alt=""
                className="h-15 w-15 object-cover object-left"
              />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">
                {propertyName}'s Activity Logs
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Track all activities and updates
              </p>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-6">
        {loading ? (
          <div className="space-y-5">
            {[...Array(4)].map((_, i) => (
              <div className="flex space-x-4" key={i}>
                <Skeleton className="h-3 w-3 rounded-full mt-2" />
                <div className="space-y-3 flex-1">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex items-center space-x-2 pt-2">
                    <Skeleton className="h-3 w-3" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="p-4 rounded-full bg-muted/50">
              <FileText className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <div>
              <p className="font-medium text-foreground">No logs yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Activities will appear here once available
              </p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-border/50 via-border/30 to-transparent dark:from-border/30 dark:via-border/20" />

              <div className="space-y-6">
                {logs.map((log, index) => {
                  const statusConfig =
                    STATUS_CONFIG[log.status?.toLowerCase()] ||
                    STATUS_CONFIG.default;
                  const StatusIcon = statusConfig.icon;

                  return (
                    <div key={log._id || index} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute left-3 -translate-x-1/2">
                        <div
                          className={cn(
                            "h-3 w-3 rounded-full border-2 border-background",
                            statusConfig.color.includes("green") &&
                              "bg-green-400",
                            statusConfig.color.includes("red") && "bg-red-400",
                            statusConfig.color.includes("yellow") &&
                              "bg-yellow-400",
                            statusConfig.color.includes("blue") &&
                              "bg-blue-400",
                            statusConfig.color.includes("muted") &&
                              "bg-muted-foreground/30"
                          )}
                        />
                      </div>

                      <div className="ml-10">
                        <div className="p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-accent/5 transition-colors duration-200">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                            <div className="flex items-center space-x-2">
                              <StatusIcon className="h-4 w-4" />
                              <h4 className="font-medium text-foreground text-base">
                                {log.title}
                              </h4>
                            </div>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs font-medium px-2.5 py-1 rounded-md border",
                                statusConfig.color
                              )}
                            >
                              {log.status}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                            {log.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground pt-3 border-t border-border/50">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {format(new Date(log.createdAt), "MMM d, yyyy")}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {format(new Date(log.createdAt), "h:mm a")}
                              </span>
                            </div>
                            {log.user && (
                              <div className="text-xs text-muted-foreground/80">
                                By {log.user}
                              </div>
                            )}
                          </div>
                        </div>

                        {index !== logs.length - 1 && (
                          <Separator className="mt-6 opacity-50" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        )}

        {/* Summary footer */}
        {!loading && logs.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-sm">
            <div className="text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">{logs.length}</span>{" "}
              log{logs.length !== 1 ? "s" : ""}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-xs text-muted-foreground">Success</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-red-400" />
                <span className="text-xs text-muted-foreground">Error</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                <span className="text-xs text-muted-foreground">Info</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
