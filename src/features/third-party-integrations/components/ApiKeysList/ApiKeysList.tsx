import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApiKeys } from "../../hooks/useApiKeys";
import type { ApiKey } from "../../services/PropertyApiKey.service";
import {
  KeyRound,
  Copy,
  Check,
  MapPin,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Activity,
} from "lucide-react";
import { differenceInDays, format, isPast } from "date-fns";

function getExpiryMeta(expiryAt: string): {
  label: string;
  variant: "destructive" | "secondary" | "outline";
  className: string;
  urgent: boolean;
} {
  const expiry = new Date(expiryAt);
  const daysLeft = differenceInDays(expiry, new Date());

  if (isPast(expiry)) {
    return {
      label: "Expired",
      variant: "destructive",
      className: "bg-red-500/15 text-red-500 border-red-500/30",
      urgent: true,
    };
  }
  if (daysLeft <= 30) {
    return {
      label: `Expires in ${daysLeft}d`,
      variant: "secondary",
      className: "bg-orange-500/15 text-orange-500 border-orange-500/30",
      urgent: true,
    };
  }
  return {
    label: `${daysLeft}d left`,
    variant: "outline",
    className: "bg-green-500/15 text-green-500 border-green-500/30",
    urgent: false,
  };
}

function ApiKeyRow({ apiKey }: { apiKey: ApiKey }) {
  const [copied, setCopied] = useState(false);
  const expiry = getExpiryMeta(apiKey.expiry_at);
  const usagePercent = Math.min(
    Math.round((apiKey.usage_count / apiKey.usage_limit) * 100),
    100
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey.value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      {/* Top row: title + status badges */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-0.5">
          <p className="font-medium text-sm text-foreground">{apiKey.title}</p>
          <p className="text-xs text-muted-foreground">{apiKey.description}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {expiry.urgent && (
            <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />
          )}
          <Badge className={`text-xs border ${expiry.className}`}>
            {expiry.label}
          </Badge>
          <Badge
            className={`text-xs border ${
              apiKey.status === "ACTIVE"
                ? "bg-green-500/15 text-green-600 border-green-500/30"
                : "bg-gray-500/15 text-gray-500 border-gray-500/30"
            }`}
          >
            {apiKey.status}
          </Badge>
        </div>
      </div>

      {/* Key value + copy */}
      <div className="flex items-center gap-2 bg-muted rounded-md px-3 py-2">
        <span className="font-mono text-xs flex-1 truncate text-muted-foreground select-all">
          {apiKey.value}
        </span>
        <button
          onClick={handleCopy}
          className="shrink-0 p-1 rounded hover:bg-background transition-colors"
          title="Copy API key"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Meta row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
        {/* Deployment */}
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>
            Deployed on:{" "}
            <span
              className="font-medium text-foreground"
              style={{ color: apiKey.label?.meta?.color_code ?? undefined }}
            >
              {apiKey.label?.title ?? apiKey.label_id}
            </span>
          </span>
        </div>

        {/* Expiry date */}
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span>
            Expires:{" "}
            <span
              className={`font-medium ${expiry.urgent ? "text-orange-500" : "text-foreground"}`}
            >
              {format(new Date(apiKey.expiry_at), "MMM d, yyyy")}
            </span>
          </span>
        </div>

        {/* Usage */}
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 shrink-0" />
          <span>
            Usage:{" "}
            <span className="font-medium text-foreground">
              {apiKey.usage_count}/{apiKey.usage_limit}
            </span>
          </span>
        </div>
      </div>

      {/* Usage progress bar */}
      <div className="space-y-1">
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              usagePercent >= 90
                ? "bg-red-500"
                : usagePercent >= 70
                  ? "bg-orange-500"
                  : "bg-green-500"
            }`}
            style={{ width: `${usagePercent}%` }}
          />
        </div>
        {usagePercent >= 80 && (
          <p className="text-xs text-orange-500 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {usagePercent === 100
              ? "Usage limit reached — key needs replacement"
              : `${usagePercent}% of usage limit consumed`}
          </p>
        )}
      </div>

      {/* Replacement warning */}
      {(expiry.urgent || usagePercent >= 80) && (
        <p className="text-xs rounded-md bg-orange-500/10 text-orange-600 border border-orange-500/20 px-3 py-2">
          ⚠ This key needs to be replaced soon.{" "}
          {isPast(new Date(apiKey.expiry_at))
            ? "It has already expired."
            : `It expires on ${format(new Date(apiKey.expiry_at), "MMM d, yyyy")}.`}
        </p>
      )}
    </div>
  );
}

export default function ApiKeysList() {
  const { apiKeys, isLoading, error, refetch } = useApiKeys();

  return (
    <Card className="mt-10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl font-semibold">
              Active API Keys
            </CardTitle>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => refetch()}
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          All API keys active in your workspace — including where they're
          deployed and when they expire.
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading && (
          <div className="flex items-center justify-center py-10 text-muted-foreground text-sm gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" /> Loading API keys...
          </div>
        )}

        {error && (
          <div className="text-sm text-red-500 py-4 text-center">
            Failed to load API keys.{" "}
            <button
              className="underline"
              onClick={() => refetch()}
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && apiKeys.length === 0 && (
          <div className="text-center py-10 text-muted-foreground text-sm">
            No API keys found in your workspace.
          </div>
        )}

        {apiKeys.map((key) => (
          <ApiKeyRow key={key.value} apiKey={key} />
        ))}
      </CardContent>
    </Card>
  );
}
