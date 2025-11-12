import { useMemo, useState } from "react";
import {
  paymentService,
  type PaymentResponse,
} from "../../services/payment.service";
import { usePricingPlans } from "../../hooks/usePricingPlans";
import { useWorkspaceProperty } from "@/features/workspace/hooks/useWorkspaceProperty";
import { useTheme } from "@/contexts/ThemeProvider";

function Packages365() {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const { theme } = useTheme();
  const conversionRate = 0.012;
  const effectiveTheme = (theme === "system" ? "light" : theme) as
    | "light"
    | "dark";
  const [subscribingId, setSubscribingId] = useState<string | null>(null);

  // pricing plans from payment API
  const { isLoading, isError, error, pricingPlans } = usePricingPlans();

  // property + active package from workspace
  const { properties, isLoading: propertiesLoading } = useWorkspaceProperty();

  // Normalize property shape
  const property = Array.isArray(properties)
    ? properties[0]
    : (properties ?? undefined);

  // Extract current plan identifiers and usage
  const activePackage = property?.meta?.active_package;
  const activePackageValidity = activePackage?.package_id?.validity;
  // const hasActiveSubscription = !!activePackage;
  // const isCurrentPlan = !!subscribingId && pkg.id === subscribingId;
  // const isExpired =
  //   activePackageValidity && new Date(activePackageValidity) < new Date();
  const currentPlanId: string | undefined = activePackage?.package_id?._id;
  const currentPlanTitle: string | undefined = activePackage?.package_id?.title;

  // Usage map for the current plan: feature_id -> used
  const usageMap: Map<string, number> = useMemo(() => {
    const list = activePackage?.meta?.activated_features ?? [];
    return new Map(
      list.map((f: { feature_id: string; used?: number }) => [
        f.feature_id,
        Number(f.used ?? 0),
      ])
    );
  }, [activePackage]);

  const formatPrice = (price: number) => {
    if (currency === "INR") return `₹${price.toLocaleString()}`;
    return `$${(price * conversionRate).toFixed(2)}`;
  };

  const formatValidity = (days?: number, iso?: string) => {
    if (typeof days === "number" && days > 0) return `${days} days`;
    if (iso) {
      const d = new Date(iso);
      if (!isNaN(d.getTime())) return d.toLocaleDateString();
    }
    return "—";
  };

  // Build UI plans with "isCurrent" and feature usage stitched in
  const uiPlans = useMemo(() => {
    if (!pricingPlans?.length) return [];

    const maxPrice = Math.max(...pricingPlans.map((p) => p.price ?? 0));

    return pricingPlans.map((p) => {
      const isCurrent =
        (!!currentPlanId && p._id === currentPlanId) ||
        (!!currentPlanTitle && p.title === currentPlanTitle);

      // attach usage where possible
      const features =
        p.features?.map((f) => {
          const limit =
            typeof f.meta?.limit === "number" ? f.meta.limit : undefined;
          const used = usageMap.get(f._id);
          return {
            id: f._id,
            title: f.title,
            limit,
            used: typeof used === "number" ? used : undefined,
          };
        }) ?? [];

      return {
        id: p._id,
        name: p.title,
        price: p.price ?? 0,
        validityLabel: formatValidity(p.validity_in_days, p.validity),
        highlight: p.price === maxPrice && maxPrice > 0,
        isCurrent,
        features,
      };
    });
  }, [pricingPlans, currentPlanId, currentPlanTitle, usageMap]);

  const themeColors = {
    dark: {
      bg: "bg-gray-900",
      card: "bg-gray-800",
      cardHighlight: "bg-gradient-to-br from-blue-600 to-blue-800",
      text: "text-white",
      textMuted: "text-gray-300",
      border: "border-gray-700",
      buttonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
      buttonSecondary: "border border-gray-600 hover:bg-gray-700 text-gray-300",
      buttonDisabled: "bg-gray-700 text-gray-400 cursor-not-allowed",
      badge: "bg-emerald-500/20 text-emerald-100 border border-emerald-400/30",
    },
    light: {
      bg: "bg-gray-50",
      card: "bg-white",
      cardHighlight: "bg-gradient-to-br from-blue-500 to-blue-600",
      text: "text-gray-900",
      textMuted: "text-gray-600",
      border: "border-gray-200",
      buttonPrimary: "bg-blue-500 hover:bg-blue-600 text-white",
      buttonSecondary: "border border-gray-300 hover:bg-gray-50 text-gray-700",
      buttonDisabled: "bg-gray-100 text-gray-400 cursor-not-allowed",
      badge: "bg-emerald-600/10 text-emerald-700 border border-emerald-600/20",
    },
  };

  const colors = themeColors[effectiveTheme];

  const loading = isLoading || propertiesLoading;

  const handleSubscribe = async (planId: string) => {
    try {
      setSubscribingId(planId);

      console.log("[subscribe:start]", {
        planId,
        currency,
        when: new Date().toISOString(),
      });

      const res: PaymentResponse = await paymentService.startPayment({
        packageId: planId,
      });

      if (res?.status === "SUCCESS" && res.data?.payment_link) {
        console.log("[subscribe:success]", res);
        window.open(res.data.payment_link, "_blank");
      } else {
        console.error("[subscribe:failure]", res);
        // You might want to show a user-friendly error message here
      }
    } catch (err) {
      console.error("[subscribe:error]", err);
      // You might want to show a user-friendly error message here
    } finally {
      setSubscribingId(null);
    }
  };

  console.log(properties.meta?.active_package.package_id.validity);

  // Render loading state
  if (loading) {
    return (
      <div className="p-6 mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 rounded-xl p-6 h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-6 mt-10 transition-colors duration-300 bg-primary rounded-sm">
        <div>
          <h1 className={`text-2xl font-bold ${colors.text} mb-2`}>
            ETC Packages
          </h1>
          <p className={`text-sm ${colors.textMuted}`}>
            Choose the perfect plan for your needs
          </p>
        </div>
      </div>

      <div
        className={`p-6 mt-4 transition-colors duration-300 bg-primary rounded-sm`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-600 pb-4 mb-8 gap-4">
            <h3 className="text-xl font-semibold">365 Packages</h3>

            <div className="flex flex-wrap gap-3 justify-end">
              {/* Currency Toggle */}
              <div className="flex bg-gray-200 dark:bg-gray-700 rounded-sm p-1">
                <button
                  onClick={() => setCurrency("INR")}
                  className={`px-4 py-2 rounded-sm text-xs font-medium transition-all ${
                    currency === "INR"
                      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  INR
                </button>
                <button
                  onClick={() => setCurrency("USD")}
                  className={`px-4 py-2 rounded-sm text-xs font-medium transition-all ${
                    currency === "USD"
                      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  USD
                </button>
              </div>
            </div>
          </div>

          {/* Error state */}
          {isError && (
            <div className="text-red-500 text-center py-8">
              Failed to load plans{error?.message ? `: ${error.message}` : ""}.
            </div>
          )}

          {/* Packages Grid */}
          {!isError && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uiPlans.map((pkg) => {
                  const isSubscribing = subscribingId === pkg.id;
                  const isCurrent = pkg.isCurrent;

                  return (
                    <div
                      key={pkg.id}
                      className={`rounded-xl p-6 flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                        pkg.highlight && !isCurrent
                          ? `${colors.cardHighlight} text-white shadow-2xl transform scale-105 border-0`
                          : `${colors.card} ${colors.border} border shadow-md`
                      } ${isCurrent ? "ring-2 ring-blue-500" : ""}`}
                    >
                      {/* Badge for highlighted or current */}
                      <div className="mb-4 flex gap-2">
                        {pkg.highlight && !isCurrent && (
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-xs font-medium self-start">
                            ⭐ Most Popular
                          </div>
                        )}
                        {isCurrent && (
                          <div
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium self-start ${colors.badge}`}
                          >
                            ✅ Current Plan
                          </div>
                        )}
                      </div>

                      <h3
                        className={`text-xl font-bold mb-2 ${
                          pkg.highlight && !isCurrent
                            ? "text-white"
                            : colors.text
                        }`}
                      >
                        {pkg.name}
                      </h3>

                      <p
                        className={`text-sm mb-1 ${
                          pkg.highlight && !isCurrent
                            ? "text-blue-100"
                            : colors.textMuted
                        }`}
                      >
                        Validity: {pkg.validityLabel}
                      </p>

                      <div className="my-4">
                        <span
                          className={`text-3xl font-bold ${
                            pkg.highlight && !isCurrent
                              ? "text-white"
                              : colors.text
                          }`}
                        >
                          {formatPrice(pkg.price)}
                        </span>
                        <span
                          className={`text-sm ml-1 ${
                            pkg.highlight && !isCurrent
                              ? "text-blue-100"
                              : colors.textMuted
                          }`}
                        >
                          /year
                        </span>
                      </div>

                      {/* Feature bullets with usage if current */}
                      {pkg.features?.length ? (
                        <ul
                          className={`mt-2 mb-4 space-y-2 text-sm ${
                            pkg.highlight && !isCurrent
                              ? "text-blue-100"
                              : colors.textMuted
                          }`}
                        >
                          {pkg.features.slice(0, 6).map((f) => (
                            <li key={f.id} className="flex items-center gap-2">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current flex-shrink-0" />
                              <span className="truncate">
                                {f.title}
                                {typeof f.limit === "number"
                                  ? isCurrent && typeof f.used === "number"
                                    ? `: ${f.used}/${f.limit}`
                                    : `: ${f.limit}`
                                  : ""}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      <div className="mt-auto space-y-3">
                        {(() => {
                          const activeValidity =
                            property?.meta?.active_package?.package_id
                              ?.validity;
                          const isExpired =
                            activeValidity &&
                            new Date(activeValidity) < new Date();
                          const isSubscribed =
                            !!property?.meta?.active_package &&
                            property.meta.active_package.package_id?._id ===
                              pkg.id;

                          let label = "Subscribe";
                          let disabled = false;
                          let buttonStyle = colors.buttonPrimary;

                          if (isSubscribed && !isExpired) {
                            label = "Subscribed";
                            disabled = true;
                            buttonStyle = colors.buttonDisabled;
                          } else if (isSubscribed && isExpired) {
                            label = "Upgrade";
                            disabled = false;
                            buttonStyle =
                              pkg.highlight && !isSubscribed
                                ? "bg-white text-blue-600 hover:bg-gray-100"
                                : colors.buttonPrimary;
                          } else if (!isSubscribed) {
                            label = "Subscribe";
                            disabled = false;
                            buttonStyle =
                              pkg.highlight && !isSubscribed
                                ? "bg-white text-blue-600 hover:bg-gray-100"
                                : colors.buttonPrimary;
                          }

                          return (
                            <button
                              className={`w-full py-3 rounded-lg font-medium transition-all ${buttonStyle}`}
                              disabled={disabled || isSubscribing}
                              onClick={() => handleSubscribe(pkg.id)}
                            >
                              {isSubscribing ? "Subscribing..." : label}
                            </button>
                          );
                        })()}

                        <button
                          className={`w-full text-center text-sm py-2 transition-all ${
                            pkg.highlight && !isCurrent
                              ? "text-blue-100 hover:text-white"
                              : "text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                          }`}
                          onClick={() => {
                            // TODO: compare plans routing/modal
                            console.log("Compare package:", pkg.id);
                          }}
                        >
                          Compare Package →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {uiPlans.length === 0 && (
                <div className={`text-center py-8 ${colors.textMuted}`}>
                  No plans available at the moment.
                </div>
              )}
            </>
          )}

          {/* Footer Note */}
          <div className={`text-center mt-8 ${colors.textMuted} text-sm`}>
            All packages include 24/7 support and regular updates
          </div>
        </div>
      </div>
    </div>
  );
}

export default Packages365;
