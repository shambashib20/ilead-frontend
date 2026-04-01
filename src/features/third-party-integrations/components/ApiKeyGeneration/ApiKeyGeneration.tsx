import { useState } from "react";
import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { labelService } from "@/features/leads/services/Lable.service";
import type { Label as LeadLabel } from "@/features/leads/types";
import { useGenerateApiKey } from "../../hooks/useGenerateApiKey";
import { useUser } from "@/features/auth/hooks/useUser";
import { KeyRound, Copy, Check, Lock, HelpCircle } from "lucide-react";

export default function ApiKeyGeneration() {
  const { data } = useUser();
  const role = (data as any)?.role ?? (data as any)?.data?.role ?? "";
  const isSuperAdmin = role === "Superadmin";

  const [labels, setLabels] = useState<LeadLabel[]>([]);
  const [purpose, setPurpose] = useState("ETC CRM Landing Page Generation");
  const [labelId, setLabelId] = useState("69c63c705146a313fca41f76");
  const [expiryDate, setExpiryDate] = useState("2026-09-30");
  const [copied, setCopied] = useState(false);

  const { generateApiKey, isPending, data: keyData } = useGenerateApiKey();

  const generatedKey = keyData?.data?.api_key ?? keyData?.data?.key ?? null;

  useEffect(() => {
    labelService
      .labels()
      .then((res) => setLabels((res as any)?.data?.data ?? []))
      .catch(() => {});
  }, []);

  const handleGenerate = async () => {
    if (!purpose.trim()) {
      toast.error("Please enter a purpose");
      return;
    }
    if (!labelId) {
      toast.error("Please select a label");
      return;
    }
    if (!expiryDate) {
      toast.error("Please pick an expiry date");
      return;
    }

    try {
      await generateApiKey({
        purpose: purpose.trim(),
        label_id: labelId,
        expiry_at: new Date(expiryDate).toISOString(),
      });
    } catch {
      // error already surfaced via toast in the hook's onError
    }
  };

  const handleCopy = () => {
    if (!generatedKey) return;
    navigator.clipboard.writeText(generatedKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!isSuperAdmin) {
    return (
      <Card className="mt-10">
        <CardContent className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
          <Lock className="w-10 h-10 opacity-40" />
          <p className="text-sm font-medium">
            API Key generation is restricted to Superadmins only.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-10">
      <CardHeader>
        <div className="flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-primary" />
          <CardTitle className="text-xl font-semibold">
            Generate API Key
          </CardTitle>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Generate a scoped API key for CRM landing page integrations. Only
          Superadmins can perform this action.
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Purpose */}
        <div className="space-y-1.5">
          <Label htmlFor="api-purpose">Purpose</Label>
          <Input
            id="api-purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g. ETC CRM Landing Page Generation"
            className="max-w-lg"
          />
        </div>

        {/* Label */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Label>Label</Label>
            <div className="relative group">
              <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
              <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-72 rounded-lg border bg-popover text-popover-foreground shadow-md px-3.5 py-3 text-xs leading-relaxed opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50">
                <p className="font-semibold mb-1.5">Campaign Binding</p>
                <p className="text-muted-foreground">
                  Think of a label as your{" "}
                  <span className="text-foreground font-medium">
                    campaign bucket
                  </span>
                  . Every lead that arrives via this API key gets automatically
                  tagged with the label you pick here — just like assigning an
                  ad campaign to an audience segment.
                </p>
                <p className="text-muted-foreground mt-2">
                  Choose the label that matches your landing page campaign (e.g.{" "}
                  <span className="text-foreground font-medium">
                    Meta Ads – Q3
                  </span>
                  ), so all inbound leads land in the right pipeline stage
                  without any manual sorting.
                </p>
                <span className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-border" />
              </div>
            </div>
          </div>
          <Select value={labelId} onValueChange={setLabelId}>
            <SelectTrigger className="max-w-lg bg-primary text-white border border-[#444c6b]">
              <SelectValue placeholder="Select label" />
            </SelectTrigger>
            <SelectContent>
              {labels.map((lbl) => (
                <SelectItem key={lbl._id} value={lbl._id}>
                  {lbl.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Expiry Date */}
        <div className="space-y-1.5">
          <Label htmlFor="api-expiry">Expiry Date</Label>
          <Input
            id="api-expiry"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="max-w-lg"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isPending}
          className="text-white"
        >
          {isPending ? "Generating..." : "Generate API Key"}
        </Button>

        {/* Generated Key Display */}
        {generatedKey && (
          <div className="space-y-2 pt-2">
            <Label>Your API Key</Label>
            <div className="flex items-center gap-2 bg-primary rounded-md px-4 py-3 font-mono text-green-400 text-sm break-all">
              <span className="flex-1 select-all">{generatedKey}</span>
              <button
                onClick={handleCopy}
                className="shrink-0 p-1.5 rounded hover:bg-white/10 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-300" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Store this key securely — it will not be shown again.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
