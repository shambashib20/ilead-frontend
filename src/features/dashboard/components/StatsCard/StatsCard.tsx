import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

type StatsCardProps = {
  title: string;
  count: number;
  completedCount?: number;
  completedLabel?: string;
  completedPercent?: number;
  icon: LucideIcon;
  iconColor?: string;
};

export function StatsCard({
  title,
  count,
  completedCount = 0,
  completedLabel = "Completed",
  completedPercent = 0,
  icon: Icon,
  iconColor = "text-blue-500",
}: StatsCardProps) {
  return (
    <Card className="p-4 bg-primary flex flex-col gap-3">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className={`w-8 h-8 ${iconColor}`} />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
            <h2 className="text-2xl font-bold text-foreground">{count}</h2>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Bottom row */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500 dark:text-gray-400">
          {completedCount} {completedLabel}
        </span>
        <span className="font-semibold text-orange-400">
          {completedPercent.toFixed(2)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
        <div
          className="bg-orange-400 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(completedPercent, 100)}%` }}
        />
      </div>
    </Card>
  );
}

export default StatsCard;
