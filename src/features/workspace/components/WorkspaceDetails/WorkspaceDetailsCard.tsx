import React, { type JSX } from "react";
import clsx from "clsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/useModalStore";
import { useUser } from "@/features/auth/hooks/useUser";
import BrandLoader from "@/components/BrandLoader/BrandLoader";
import { EditWorkspaceModal } from "../EditWorkspaceDetailsModals.tsx/EditWorkspaceModal";

import { useWorkspaceProperty } from "../../hooks/useWorkspaceProperty";
import { format } from "date-fns";

export type BadgeVariant = "green" | "gray" | "yellow" | "red";

export type FeatureUsage = {
  feature_id: string | number;
  title: string;
  used: number;
  limit: number;
  validity?: string | Date;
};

export type ActivePackage = {
  package_id: {
    title: string;
    validity?: string | Date; // ← may exist in your data
    validity_in_days?: number;
    status?: string;
  };
  meta: {
    activated_features: FeatureUsage[];
  };
  createdAt?: string | Date;
  updatedAt?: string | Date;
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
    active_package?: ActivePackage | null;
  };
};

type BadgeProps = { children: React.ReactNode; variant?: BadgeVariant };

function Badge({ children, variant = "gray" }: BadgeProps) {
  const base =
    "inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full";
  const map: Record<BadgeVariant, string> = {
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    yellow:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
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

// ---------- NEW: expiry helpers ----------
dayjs.extend(utc);
dayjs.extend(isSameOrAfter);

function parseISO(val?: string | Date | null): dayjs.Dayjs | null {
  if (!val) return null;
  const d = dayjs(val);
  return d.isValid() ? d : null;
}

function getPlanExpiryISO(activePkg?: ActivePackage | null): string | null {
  if (!activePkg) return null;

  // 1) max feature validity
  const features = activePkg.meta?.activated_features ?? [];
  const featureMax = features
    .map((f) => parseISO(f.validity as any))
    .filter(Boolean) as dayjs.Dayjs[];
  const latestFeature = featureMax.length
    ? featureMax.reduce((a, b) => (a.isAfter(b) ? a : b))
    : null;

  if (latestFeature) return latestFeature.toISOString();

  // 2) explicit package validity
  const pkgValid = parseISO(activePkg.package_id?.validity as any);
  if (pkgValid) return pkgValid.toISOString();

  // 3) createdAt + days
  const days = Number(activePkg.package_id?.validity_in_days ?? 0) || 0;
  if (days > 0) {
    const base = parseISO(activePkg.createdAt as any);
    if (base) return base.add(days, "day").toISOString();
  }

  // 4) updatedAt + days
  if (days > 0) {
    const base2 = parseISO(activePkg.updatedAt as any);
    if (base2) return base2.add(days, "day").toISOString();
  }

  return null;
}

function isExpired(iso?: string | null): boolean {
  if (!iso) return false;
  const expiry = dayjs.utc(iso).endOf("day"); // grace until day ends
  return dayjs.utc().isAfter(expiry);
}

function expiredCardClasses(expired: boolean) {
  return expired
    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700";
}
// ---------- END new helpers ----------

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
      <Badge variant={value ? trueVariant : falseVariant}>
        {value ? "Yes" : "No"}
      </Badge>
    </div>
  );
}

export default function WorkspaceDetailsCard() {
  const {
    properties: workspace,
    isLoading: loading,
    error,
  } = useWorkspaceProperty();
  const { openModal, setModalTitle } = useModalStore();
  const { data } = useUser();
  // const { user: userDetail } = useUserProfile();

  const userRole: string | undefined =
    (data as any)?.role ?? (data as any)?.data?.role;
  const activePkg = workspace.meta?.active_package ?? null;
  const planTitle = activePkg?.package_id?.title ?? "—";
  const planStatus = activePkg?.package_id?.status ?? "—";

  // const rayId = workspace.meta?.ray_id ?? "—";

  // const usageCount = Number(workspace.usage_count ?? 0);
  // const usageLimit = Number(workspace.usage_limits ?? 0);
  // const usagePercent = safePercent(usageCount, usageLimit);

  // const createdAtLabel = workspace.createdAt
  //   ? dayjs(workspace.createdAt).format("DD MMM YYYY, hh:mm A")
  //   : "—";

  // const updatedAtLabel = workspace.updatedAt
  //   ? dayjs(workspace.updatedAt).format("DD MMM YYYY, hh:mm A")
  //   : "—";

  // const latestLog =
  //   Array.isArray(workspace.logs) && workspace.logs.length > 0
  //     ? workspace.logs[workspace.logs.length - 1]
  //     : null;

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

  const planValidityDays = activePkg?.package_id?.validity_in_days ?? 0;

  // NEW: compute plan expiry and flags
  const planExpiryISO = getPlanExpiryISO(activePkg);
  const planExpired = isExpired(planExpiryISO);
  const planExpiryLabel = planExpiryISO
    ? dayjs(planExpiryISO).format("DD MMM YYYY, hh:mm A")
    : "—";

  console.log(workspace);

  return (
    <div className="max-w-full mx-auto  mt-6">
      <div className="relative">
        <Card className="bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* LEFT */}
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
                {userRole === "Superadmin" && (
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
                  <div
                    className={clsx(
                      "p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-200",
                      expiredCardClasses(planExpired),
                    )}
                  >
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
                      {planExpired && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2.5 py-0.5 text-xs font-semibold">
                          Expired
                        </span>
                      )}
                    </h3>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          Plan Name
                        </span>
                        <div className="text-sm font-semibold">{planTitle}</div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          Plan Validity
                        </span>
                        <div className="text-sm font-semibold">
                          {planValidityDays} days
                        </div>
                      </div>

                      {/* NEW: Valid till row */}
                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          Valid till
                        </span>
                        <div
                          className={clsx(
                            "text-sm font-semibold",
                            planExpired && "text-red-600 dark:text-red-400",
                          )}
                        >
                          {planExpiryLabel}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          Plan Status
                        </span>
                        <div className="text-sm font-semibold">
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

                            // Prefer feature.validity, else inherit plan expiry
                            const featureExpiryISO = feature.validity
                              ? dayjs(feature.validity).toISOString()
                              : planExpiryISO;

                            const featureExpired = isExpired(featureExpiryISO);
                            const featureExpiryLabel = featureExpiryISO
                              ? dayjs(featureExpiryISO).format(
                                  "DD MMM YYYY, hh:mm A",
                                )
                              : "—";

                            return (
                              <div
                                key={feature.feature_id}
                                className={clsx(
                                  "p-4 rounded-lg border transition-colors duration-150",
                                  expiredCardClasses(featureExpired),
                                )}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="font-medium">
                                    {feature.title}
                                    {featureExpired && (
                                      <span className="ml-2 text-xs inline-flex items-center rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-0.5">
                                        Expired
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm font-semibold opacity-90">
                                    {fUsed} / {fLimit}
                                  </div>
                                </div>

                                <div className="mb-3">
                                  <div className="flex justify-between text-xs opacity-75 mb-1">
                                    <span>Usage</span>
                                    <span>{fPercent}%</span>
                                  </div>
                                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                      className={clsx(
                                        "h-full rounded-full transition-all duration-500",
                                        featureExpired
                                          ? "bg-gradient-to-r from-rose-500 to-red-600"
                                          : fPercent < 70
                                            ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                            : fPercent < 90
                                              ? "bg-gradient-to-r from-amber-400 to-orange-500"
                                              : "bg-gradient-to-r from-rose-500 to-red-600",
                                      )}
                                      style={{ width: `${fPercent}%` }}
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-600">
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
                                    Valid till:
                                  </div>
                                  <div
                                    className={clsx(
                                      featureExpired &&
                                        "text-red-600 dark:text-red-400 font-semibold",
                                    )}
                                  >
                                    {featureExpiryLabel}
                                  </div>
                                </div>
                              </div>
                            );
                          },
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
                          <Badge variant={statusToVariant(workspace.status)}>
                            {String(workspace.status).replace(/_/g, " ")}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {renderStatusItem(
                          "Workspace Verified",
                          Boolean(workspace.is_verified),
                          "green",
                          "gray",
                          "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                        )}
                        {renderStatusItem(
                          "Workspace Ban Status",
                          Boolean(workspace.is_banned),
                          "red",
                          "gray",
                          "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                        )}
                        {renderStatusItem(
                          "Workspace Reported",
                          Boolean(workspace.reported),
                          "yellow",
                          "gray",
                          "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4" />
            </div>

            {/* RIGHT */}
            {/* RIGHT – Workspace Summary instead of user card */}
            <aside className="bg-slate-50/50 dark:bg-slate-800/50 p-5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 backdrop-blur-sm flex flex-col gap-4 shadow-sm">
              {/* Avatar */}
              <div className="h-18 w-full  overflow-hidden border border-slate-300 dark:border-slate-600 grid place-items-center bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-lg">
                {workspace?.meta?.profile_picture_data?.file_url ? (
                  <img
                    src={workspace?.meta?.profile_picture_data?.file_url}
                    alt={workspace?.name}
                    className="h-full w-full object-cover"
                  />
                ) : workspace.name ? (
                  workspace.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                ) : (
                  "W"
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1">
                {/* <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-tight">
                  {workspace?.name}
                </div> */}
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {workspace.role?.name}
                </div>

                <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                  <div>
                    Created:{" "}
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {format(new Date(workspace?.createdAt), "dd MMM yyyy")}
                    </span>
                  </div>
                  <div>
                    Updated:{" "}
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {format(new Date(workspace?.updatedAt), "dd MMM yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Card>
      </div>
    </div>
  );
}