import { useEffect, useState } from "react";
import { workspaceService } from "@/features/leads/services/Property.service";
import type { Property } from "@/features/leads/services/Property.service";
import { Card } from "@/components/ui/card";
import { useModalStore } from "@/store/useModalStore";

import clsx from "clsx";
import { EditWorkspaceModal } from "../EditWorkspaceDetailsModals.tsx/EditWorkspaceModal";
import { Button } from "@/components/ui/button";
import { useUser } from "@/features/auth/hooks/useUser";
import BrandLoader from "@/components/BrandLoader/BrandLoader";

type BadgeVariant = "green" | "red" | "yellow" | "gray" | "purple";
import dayjs from "dayjs";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

function Badge({ children, variant = "gray" }: BadgeProps) {
  const base =
    "inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full";
  const map: Record<BadgeVariant, string> = {
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    yellow:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    purple:
      "bg-purple-100 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-300",
  };
  return (
    <span className={clsx(base, map[variant] ?? map.gray)}>{children}</span>
  );
}

function WorkspaceDetailsCard() {
  const [workspace, setWorkspace] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { openModal, setModalTitle } = useModalStore();
  const { data } = useUser();
  useEffect(() => {
    let mounted = true;
    const fetchWorkspace = async () => {
      try {
        const response = await workspaceService.getProperty();
        if (!mounted) return;
        setWorkspace(response.data.data);
      } catch (err) {
        console.error("Failed to load workspace details:", err);
        setError("Failed to load workspace details.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchWorkspace();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading)
    return (
      <div className="grid place-items-center min-h-full">
        <BrandLoader />
      </div>
    );
  if (error)
    return (
      <div className="p-6 text-sm text-red-500 dark:text-red-400">{error}</div>
    );
  if (!workspace) return null;

  const renderBoolean = (
    label: string,
    value: boolean,
    trueVariant: BadgeVariant = "green",
    falseVariant: BadgeVariant = "gray"
  ) => (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="text-sm text-slate-300">{label}</div>
      <Badge variant={value ? trueVariant : falseVariant}>
        {value ? "Yes" : "No"}
      </Badge>
    </div>
  );

  // usage percentage (guard against divide by 0)
  const used = Number(workspace.usage_count ?? 0);
  const limit = Number(workspace.usage_limits ?? 1);
  const percent = Math.min(100, Math.round((used / (limit || 1)) * 100));

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 mt-6">
      <div className="relative">
        {/* Edit button — same as you had, but better placed on card top-right */}
        <Card className="bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* LEFT: main details (span 2 cols on lg) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-semibold leading-tight">
                    {workspace.name}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Workspace details & usage
                  </p>
                </div>
                {data?.data?.role !== "Superadmin" && (
                  <div className="hidden sm:flex items-center gap-2">
                    <Button
                      onClick={() => {
                        setModalTitle?.("Edit Workspace Details!");
                        openModal({
                          content: (
                            <EditWorkspaceModal initialData={workspace} />
                          ),
                          type: "form",
                        });
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>

              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                <strong className="text-slate-200 block mb-2">
                  Description
                </strong>
                <div className="text-sm leading-7">
                  {workspace.description || "No description provided."}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-md border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-400">Plan Name</div>
                    <div className="text-sm font-semibold">
                      {workspace?.meta?.active_package.package_id.title}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-400">Plan Validity</div>
                    <div className="text-sm font-semibold">
                      {
                        workspace?.meta?.active_package.package_id
                          .validity_in_days
                      }
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-400">Plan Status</div>
                    <div className="text-sm font-semibold">
                      {workspace?.meta?.active_package.package_id.status}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {workspace?.meta?.active_package.meta.activated_features.map(
                      (feature: any) => {
                        const percent = Math.min(
                          Math.round((feature.used / feature.limit) * 100),
                          100
                        );

                        return (
                          <div
                            key={feature.feature_id}
                            className="p-4 border rounded-lg bg-white dark:bg-slate-800"
                          >
                            {/* Feature Title */}
                            <div className="font-medium text-slate-700 dark:text-slate-200">
                              {feature.title}
                            </div>

                            {/* Used / Limit */}
                            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              {feature.used} / {feature.limit} used
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-2">
                              <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className={clsx(
                                    "h-full rounded-full transition-all",
                                    {
                                      "bg-emerald-500": percent < 70,
                                      "bg-yellow-400":
                                        percent >= 70 && percent < 90,
                                      "bg-rose-500": percent >= 90,
                                    }
                                  )}
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                              <div className="text-xs text-slate-400 mt-1">
                                {percent}% used
                              </div>
                            </div>

                            {/* Validity Info */}
                            <div className="flex justify-between items-center mt-3 text-xs text-slate-500 dark:text-slate-400">
                              <span>
                                Valid Till:{" "}
                                {dayjs(feature.validity).format(
                                  "DD-MM-YYYY, hh:mm A"
                                )}
                              </span>

                              {/* TODO Implement this later! */}
                              {/* <span>
                                {feature.validity_left_till_expiration > 0
                                  ? `${feature.validity_left_till_expiration} days left`
                                  : "Expired"}
                              </span> */}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-md border border-slate-100 dark:border-slate-700">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-400">Status</div>
                      <div>
                        <Badge
                          variant={
                            workspace.status === "ACTIVE"
                              ? "green"
                              : workspace.status === "INACTIVE"
                                ? "yellow"
                                : workspace.status === "USAGE_LIMIT_EXCEEDED"
                                  ? "red"
                                  : "gray"
                          }
                        >
                          {workspace.status}
                        </Badge>
                      </div>
                    </div>

                    {renderBoolean(
                      "Workspace Verified",
                      workspace.is_verified,
                      "green",
                      "gray"
                    )}
                    {renderBoolean(
                      "Workspace Ban Status",
                      workspace.is_banned,
                      "red",
                      "gray"
                    )}
                    {renderBoolean(
                      "Workspace Reported",
                      workspace.reported,
                      "yellow",
                      "gray"
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
            </div>

            {/* RIGHT: meta / owner / actions card */}
            <aside className="bg-slate-50 dark:bg-slate-800 p-4 rounded-md border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  {/* <div className="text-xs text-slate-400">Owner</div> */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-yellow-400 flex items-center justify-center text-black font-bold">
                      {data?.name?.charAt(0) ?? "M"}
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {data?.name ?? "Unknown"}
                      </div>
                      <div className="text-xs text-slate-400">
                        {data?.role ?? "Owner"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {/* <div className="text-xs text-slate-400">Plan</div>
                  <div className="font-semibold">
                    {workspace.plan_name ?? "Free"}
                  </div> */}
                </div>
              </div>

              <div className="mt-4 text-sm text-slate-300 space-y-2">
                <div>
                  <div className="text-xs text-slate-400">Email</div>
                  <div>{data?.email ?? "—"}</div>
                </div>

                <div>
                  <div className="text-xs text-slate-400">Phone</div>
                  <div>{data?.phone_number ?? "—"}</div>
                </div>
              </div>

              {/* <div className="mt-4 space-y-2">
                <button className="w-full px-3 py-2 bg-emerald-500 text-black rounded-md font-medium">
                  Send Message
                </button>
                <button className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md text-sm">
                  Generate Report
                </button>
              </div> */}

              {/* Mobile edit CTA */}
              <div className="mt-3 sm:hidden">
                <button
                  onClick={() => {
                    setModalTitle?.("Edit Workspace Details!");
                    openModal({
                      content: <EditWorkspaceModal initialData={workspace} />,
                      type: "form",
                    });
                  }}
                  className="w-full px-3 py-2 bg-indigo-600 text-white rounded-md"
                >
                  Edit
                </button>
              </div>
            </aside>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default WorkspaceDetailsCard;
