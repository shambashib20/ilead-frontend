import { usePricingPlans } from "@/features/payment/hooks/usePricingPlans";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useWorkspaceProperty } from "@/features/workspace/hooks/useWorkspaceProperty";
import { useTheme } from "@/contexts/ThemeProvider";
import { Crown, Check } from "lucide-react";

export const Route = createFileRoute("/_dashboardLayout/add-package/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const { theme } = useTheme();
  const conversionRate = 0.012;
  const effectiveTheme = theme === "system" ? "light" : theme;

  const { isLoading, isError, error, pricingPlans } = usePricingPlans();
  const { properties, isLoading: propertiesLoading } = useWorkspaceProperty();

  const property = Array.isArray(properties)
    ? properties[0]
    : (properties ?? undefined);

  const activePackage = property?.meta?.active_package;
  const currentPlanId: string | undefined = activePackage?.package_id?._id;
  const currentPlanTitle: string | undefined = activePackage?.package_id?.title;

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
    return "Lifetime";
  };

  const uiPlans = useMemo(() => {
    if (!pricingPlans?.length) return [];

    const maxPrice = Math.max(...pricingPlans.map((p) => p.price ?? 0));

    return pricingPlans.map((p) => {
      const isCurrent =
        (!!currentPlanId && p._id === currentPlanId) ||
        (!!currentPlanTitle && p.title === currentPlanTitle);

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
        popular: p.price === maxPrice && maxPrice > 0,
        recommended: p.title?.toLowerCase().includes("pro") || false,
      };
    });
  }, [pricingPlans, currentPlanId, currentPlanTitle, usageMap]);

  const themeColors = {
    dark: {
      bg: "bg-gray-900",
      card: "bg-gray-800/80 backdrop-blur-sm",
      cardHighlight:
        "bg-gradient-to-br from-blue-900/80 to-blue-900/80 border border-blue-500/30",
      text: "text-white",
      textMuted: "text-gray-400",
      border: "border-gray-700",
      buttonPrimary:
        "bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25",
      buttonSecondary:
        "border border-gray-600 hover:bg-gray-700/50 text-gray-300 backdrop-blur-sm",
      buttonDisabled: "bg-gray-700/50 text-gray-400 cursor-not-allowed",
      badge: "bg-emerald-500/20 text-emerald-100 border border-emerald-400/30",
      popularBadge:
        "bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold",
    },
    light: {
      bg: "bg-gradient-to-br from-gray-50 to-blue-50/30",
      card: "bg-white/80 backdrop-blur-sm border border-gray-200/60",
      cardHighlight:
        "bg-gradient-to-br from-blue-900/80 to-blue-900/80 border border-blue-500/30",
      text: "text-gray-900",
      textMuted: "text-gray-600",
      border: "border-gray-200",
      buttonPrimary:
        "bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white shadow-lg shadow-blue-500/25",
      buttonSecondary:
        "border border-gray-300 hover:bg-gray-50/80 text-gray-700 backdrop-blur-sm",
      buttonDisabled: "bg-gray-100 text-gray-400 cursor-not-allowed",
      badge: "bg-emerald-600/10 text-emerald-700 border border-emerald-600/20",
      popularBadge:
        "bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold",
    },
  };

  const colors = themeColors[effectiveTheme];

  const loading = isLoading || propertiesLoading;

  // Most popular plan for special styling
  // const popularPlan = uiPlans.find((p) => p.popular);s

  return (
    <div className={`min-h-fit ${colors.bg} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-3 py-6">
        {/* Header */}

        {/* Currency Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-200/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-lg p-0.5 border border-gray-300/50 dark:border-gray-600/50">
            <button
              onClick={() => setCurrency("INR")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                currency === "INR"
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <span className="text-base leading-none">🇮🇳</span>
              INR
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                currency === "USD"
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <span className="text-base leading-none">🇺🇸</span>
              USD
            </button>
          </div>
        </div>

        {/* Loading / Error states */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="flex items-center gap-2.5 text-base">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <span className={colors.textMuted}>Loading plans...</span>
            </div>
          </div>
        )}

        {!loading && isError && (
          <div className="text-center py-8">
            <div className="text-red-500 text-sm">
              Failed to load plans{error?.message ? `: ${error.message}` : ""}
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        {!loading && !isError && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {uiPlans.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative rounded-xl p-5 flex flex-col transition-transform duration-200 hover:scale-[1.015] ${
                  pkg.popular
                    ? `shadow-xl border-0 ${colors.cardHighlight}`
                    : `shadow ${colors.card} ${colors.border}`
                }`}
              >
                {/* Popular Badge */}
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div
                      className={`px-3.5 py-1.5 rounded-full ${colors.popularBadge} flex items-center gap-1.5 text-[11px] font-bold shadow`}
                    >
                      <Crown className="w-3.5 h-3.5" />
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Current Plan Badge */}
                {pkg.isCurrent && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <div
                      className={`px-2.5 py-1 rounded-full ${colors.badge} text-[11px] font-medium flex items-center gap-1`}
                    >
                      <Check className="w-3 h-3" />
                      CURRENT PLAN
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-4">
                  <h3
                    className={`text-xl md:text-2xl font-bold mb-1.5 ${
                      pkg.popular ? "text-white" : colors.text
                    }`}
                  >
                    {pkg.name}
                  </h3>
                  <p
                    className={`text-xs md:text-sm ${
                      pkg.popular ? "text-blue-100" : colors.textMuted
                    }`}
                  >
                    Perfect for{" "}
                    {pkg.name.toLowerCase().includes("basic")
                      ? "starters"
                      : pkg.name.toLowerCase().includes("pro")
                        ? "growing teams"
                        : "enterprises"}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center mb-4">
                  <div
                    className={`text-3xl md:text-4xl font-bold mb-1 ${
                      pkg.popular ? "text-white" : colors.text
                    }`}
                  >
                    {formatPrice(pkg.price)}
                  </div>
                  <div
                    className={`text-xs ${
                      pkg.popular ? "text-blue-100" : colors.textMuted
                    }`}
                  >
                    {pkg.validityLabel} • Billed annually
                  </div>
                </div>

                {/* Features */}
                <div className="flex-1 mb-6">
                  <div className="space-y-2">
                    {pkg.features?.slice(0, 5).map((f) => (
                      <div
                        key={f.id}
                        className={`flex items-center gap-2 p-1.5 rounded-md transition-colors ${
                          pkg.popular
                            ? "bg-white/10 hover:bg-white/15"
                            : "bg-gray-50/50 dark:bg-gray-700/30 hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                            pkg.popular
                              ? "bg-white/20 text-white"
                              : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}
                        >
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span
                          className={`text-[13px] font-medium ${
                            pkg.popular ? "text-white" : colors.text
                          }`}
                        >
                          {f.title}
                        </span>
                        {typeof f.limit === "number" && (
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full ml-auto ${
                              pkg.popular
                                ? "bg-white/20 text-white"
                                : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                            }`}
                          >
                            {pkg.isCurrent && typeof f.used === "number"
                              ? `${f.used}/${f.limit}`
                              : f.limit}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    className={`w-full py-3 rounded-lg text-sm font-semibold transition-transform duration-150 ${
                      pkg.isCurrent
                        ? colors.buttonDisabled
                        : pkg.popular
                          ? "bg-white text-blue-600 hover:bg-gray-100 hover:scale-[1.01] shadow"
                          : `${colors.buttonPrimary} hover:scale-[1.01]`
                    }`}
                    disabled={pkg.isCurrent}
                  >
                    {pkg.isCurrent ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <Check className="w-4 h-4" />
                        Current Plan
                      </div>
                    ) : (
                      "Get Started"
                    )}
                  </button>

                  {!pkg.isCurrent && (
                    <button
                      className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        pkg.popular
                          ? "text-white hover:bg-white/10 border border-white/30"
                          : colors.buttonSecondary
                      }`}
                    >
                      Compare Features
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RouteComponent;
