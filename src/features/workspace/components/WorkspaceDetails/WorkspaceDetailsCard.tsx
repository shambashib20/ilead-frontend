import React, { type JSX } from "react";
import clsx from "clsx";
import dayjs from "dayjs";

// UI components — update paths to match your project
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/useModalStore";
import { useUser } from "@/features/auth/hooks/useUser";
import BrandLoader from "@/components/BrandLoader/BrandLoader";
import { EditWorkspaceModal } from "../EditWorkspaceDetailsModals.tsx/EditWorkspaceModal";
import { useWorkspaceProperty } from "../../hooks/useWorkspaceProperty";
// import { BrandLoader } from "@/components/BrandLoader";

// App hooks/services — update paths as needed
// import { useModalStore } from "@/stores/modal-store";
// import { useUser } from "@/hooks/use-user";
// import { workspaceService } from "@/services/workspace-service";
// import { EditWorkspaceModal } from "@/components/modals/EditWorkspaceModal";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

// Badge variants used in this UI. Extend if your Badge supports more.
export type BadgeVariant = "green" | "gray" | "yellow" | "red";

export type FeatureUsage = {
  feature_id: string | number;
  title: string;
  used: number;
  limit: number; // 0 means unlimited? treat as 0 => show 0/0 and 0%
  validity?: string | Date;
};

export type ActivePackage = {
  package_id: {
    title: string;
    validity_in_days?: number;
    status?: string; // ACTIVE | INACTIVE | etc
  };
  meta: {
    activated_features: FeatureUsage[];
  };
};

export type Property = {
  name: string;
  description?: string | null;
  usage_count?: number | string | null;
  usage_limits?: number | string | null;
  status: "ACTIVE" | "INACTIVE" | "USAGE_LIMIT_EXCEEDED" | "PENDING" | string;
  is_verified: boolean;
  is_banned: boolean;
  reported: boolean;
  meta?: {
    active_package?: ActivePackage;
  };
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

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
    // purple:
    //   "bg-purple-100 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-300",
  };
  return (
    <span className={clsx(base, map[variant] ?? map.gray)}>{children}</span>
  );
}

function safePercent(used: number, limit: number) {
  if (!Number.isFinite(used) || used < 0) used = 0;
  if (!Number.isFinite(limit) || limit <= 0) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}

function statusToVariant(status: Property["status"]): BadgeVariant {
  switch (status) {
    case "ACTIVE":
      return "green";
    case "INACTIVE":
      return "yellow";
    case "USAGE_LIMIT_EXCEEDED":
      return "red";
    default:
      return "gray";
  }
}

// Reusable boolean row with icon + badge
function renderStatusItem(
  label: string,
  value: boolean,
  trueVariant: BadgeVariant = "green",
  falseVariant: BadgeVariant = "gray",
  iconPath: string
): JSX.Element {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
      <div className="flex items-center gap-2">
        <svg
          className="w-4 h-4 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={iconPath}
          />
        </svg>
        <span className="text-sm text-slate-600 dark:text-slate-300">
          {label}
        </span>
      </div>
      <Badge
        variant={value ? trueVariant : falseVariant}
        // className="px-2 py-1 text-xs"
      >
        {value ? "Yes" : "No"}
      </Badge>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function WorkspaceDetailsCard() {
  const {
    properties: workspace,
    isLoading: loading,
    error,
  } = useWorkspaceProperty();
  const { openModal, setModalTitle } = useModalStore();
  const { data } = useUser();

  // Derive user meta safely (some APIs nest user under data.data)
  const userName: string | undefined =
    (data as any)?.name ?? (data as any)?.data?.name;
  const userRole: string | undefined =
    (data as any)?.role ?? (data as any)?.data?.role;
  const userEmail: string | undefined =
    (data as any)?.email ?? (data as any)?.data?.email;
  const userPhone: string | undefined =
    (data as any)?.phone_number ?? (data as any)?.data?.phone_number;

  if (loading)
    return (
      <div className="grid place-items-center min-h-full">
        <BrandLoader />
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-sm text-red-500 dark:text-red-400">
        {error.message}
      </div>
    );

  if (!workspace) return null;

  // Overall usage percentage (guard against divide by 0)
  // const used = Number(workspace.usage_count ?? 0);
  // const limit = Number(workspace.usage_limits ?? 0);
  // const percent = safePercent(used, limit);

  const activePkg = workspace.meta?.active_package;
  const planTitle = activePkg?.package_id?.title ?? "—";
  const planValidityDays = activePkg?.package_id?.validity_in_days ?? 0;
  const planStatus = activePkg?.package_id?.status ?? "—";

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 mt-6">
      <div className="relative">
        <Card className="bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* LEFT: main details (span 2 cols on lg) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-semibold leading-tight">
                    {workspace.name}
                  </h3>
                  <p className="text-sm text-foreground mt-1">
                    Workspace details & usage
                  </p>
                </div>
                {userRole !== "Superadmin" && (
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

              <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                <strong className="text-foreground block mb-2">
                  Description
                </strong>
                <div className="text-sm leading-7">
                  {workspace.description || "No description provided."}
                </div>
              </div>
              {userRole !== "Chat Agent" && (
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Plan Details Card */}
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Subscription Details
                    </h3>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            Plan Name
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {planTitle}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            Plan Validity
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {planValidityDays} days
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            Plan Status
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {planStatus}
                        </div>
                      </div>
                    </div>

                    {/* Features Section */}
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        Feature Usage
                      </h4>

                      {activePkg?.meta?.activated_features?.length ? (
                        activePkg.meta.activated_features.map(
                          (feature: any) => {
                            const fUsed = Number(feature.used ?? 0);
                            const fLimit = Number(feature.limit ?? 0);
                            const fPercent = safePercent(fUsed, fLimit);
                            return (
                              <div
                                key={feature.feature_id}
                                className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="font-medium text-slate-800 dark:text-slate-200">
                                    {feature.title}
                                  </div>
                                  <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                                    {fUsed} / {fLimit}
                                  </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-3">
                                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                                    <span>Usage</span>
                                    <span>{fPercent}%</span>
                                  </div>
                                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                      className={clsx(
                                        "h-full rounded-full transition-all duration-500",
                                        {
                                          "bg-gradient-to-r from-green-400 to-emerald-500":
                                            fPercent < 70,
                                          "bg-gradient-to-r from-amber-400 to-orange-500":
                                            fPercent >= 70 && fPercent < 90,
                                          "bg-gradient-to-r from-rose-500 to-red-600":
                                            fPercent >= 90,
                                        }
                                      )}
                                      style={{ width: `${fPercent}%` }}
                                    />
                                  </div>
                                </div>

                                {/* Validity Info */}
                                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-600">
                                  <div className="flex items-center gap-1">
                                    <svg
                                      className="w-3 h-3"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    Valid till:{" "}
                                    {feature.validity
                                      ? dayjs(feature.validity).format(
                                          "DD MMM YYYY, hh:mm A"
                                        )
                                      : "—"}
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )
                      ) : (
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          No feature usage available.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Workspace Status Card */}
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      Workspace Status
                    </h3>

                    <div className="space-y-4">
                      {/* Main Status */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                              Status
                            </span>
                          </div>
                          <Badge
                            variant={statusToVariant(workspace.status)}
                            // className="px-3 py-1 text-sm"
                          >
                            {String(workspace.status).replace(/_/g, " ")}
                          </Badge>
                        </div>
                      </div>

                      {/* Status Items */}
                      <div className="space-y-3">
                        {renderStatusItem(
                          "Workspace Verified",
                          Boolean(workspace.is_verified),
                          "green",
                          "gray",
                          "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        )}
                        {renderStatusItem(
                          "Workspace Ban Status",
                          Boolean(workspace.is_banned),
                          "red",
                          "gray",
                          "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        )}
                        {renderStatusItem(
                          "Workspace Reported",
                          Boolean(workspace.reported),
                          "yellow",
                          "gray",
                          "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
            </div>

            {/* RIGHT: meta / owner / actions card */}
            <aside className="bg-slate-50 dark:bg-slate-800 p-4 rounded-md border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-yellow-400 flex items-center justify-center text-black font-bold">
                      {(userName?.charAt(0) ?? "M").toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {userName ?? "Unknown"}
                      </div>
                      <div className="text-xs text-foreground">
                        {userRole ?? "Owner"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right" />
              </div>

              <div className="mt-4 text-sm text-foreground space-y-2">
                <div>
                  <div className="text-xs text-foreground">Email</div>
                  <div>{userEmail ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-foreground">Phone</div>
                  <div>{userPhone ?? "—"}</div>
                </div>
              </div>

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
