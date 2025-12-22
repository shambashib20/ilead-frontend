// src/features/payment/components/AddonsPackages.tsx
import React, { useMemo, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { usePricingAddons } from "../../hooks/usePricingAddons";
// import your real payment/checkout service here

function AddonsPackages() {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [subscribingId, setSubscribingId] = useState<string | null>(null);

  const { pricingAddons = [], isLoading, isError, error } = usePricingAddons();

  // Wait for component to mount to avoid SSR issues with theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Safely determine effective theme
  const effectiveTheme = useMemo(() => {
    if (!mounted) return "light"; // Default during SSR
    const currentTheme = theme === "system" ? systemTheme : theme;
    return (currentTheme === "dark" ? "dark" : "light") as "light" | "dark";
  }, [theme, systemTheme, mounted]);

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
      qtyBg: "bg-gray-700",
      qtyHover: "hover:bg-gray-600",
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
      qtyBg: "bg-gray-100",
      qtyHover: "hover:bg-gray-200",
    },
  };

  // Safely get colors with fallback
  const colors = themeColors[effectiveTheme] || themeColors.light;

  // map API addon shape to UI-friendly plan shape
  const uiAddons = useMemo(() => {
    return (pricingAddons || []).map((a: any) => {
      const id = a._id || a.id;
      return {
        id,
        name: a.title || "Addon",
        price: a.value ?? 0,
        validityLabel: a.validity || "1 Year",
        highlight: false,
        isCurrent: false,
        features: [], // extend if API provides
      };
    });
  }, [pricingAddons]);

  // ensure a default quantity for each addon
  React.useEffect(() => {
    const q: Record<string, number> = {};
    uiAddons.forEach((p) => {
      q[p.id] = quantities[p.id] ?? 1;
    });
    setQuantities((prev) => ({ ...q, ...prev }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiAddons.length]);

  // const changeQty = (id: string, delta: number) => {
  //   setQuantities((prev) => {
  //     const current = prev[id] ?? 1;
  //     const next = Math.max(1, current + delta);
  //     return { ...prev, [id]: next };
  //   });
  // };

const formatPrice = (
  value: number,
  currency: "INR" | "USD",
  baseCurrency: "INR" | "USD" = "INR"
) => {
  const USD_RATE = 83.2; // 1 USD = 83.2 INR

  let convertedValue = value;

  // Convert base currency to target currency
  if (baseCurrency === "INR" && currency === "USD") {
    convertedValue = value / USD_RATE;
  } else if (baseCurrency === "USD" && currency === "INR") {
    convertedValue = value * USD_RATE;
  }

  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "INR" ? 0 : 2,
  }).format(convertedValue);
};

  // SINGLE Pay now handler (stub). Replace the inner block with actual payment/checkout logic.
  const handlePayNow = async (addonId: string) => {
    if (subscribingId) return;
    setSubscribingId(addonId);

    try {
      const qty = quantities[addonId] ?? 1;
      const addon = uiAddons.find((p) => p.id === addonId);
      if (!addon) throw new Error("Addon not found");

      // Example: calculate total in backend currency (assumes price is in INR)
      const totalAmount = addon.price * qty;

      // TODO: Replace with your actual payment integration:
      // - create order on backend (pass addonId, qty, currency)
      // - get checkout url or payment token
      // - redirect or open modal / handle response

      // Temporary stub simulation:
      await new Promise((r) => setTimeout(r, 900)); // simulate network
      console.log(
        `[STUB] Checkout created for addon=${addonId} qty=${qty} total=${totalAmount} currency=${currency}`
      );

      // success handling: show toast, refresh list, etc.
      // e.g. refetch query or optimistic UI update
    } catch (err: any) {
      console.error("Payment start failed:", err);
      // show toast / UI error
    } finally {
      setSubscribingId(null);
    }
  };

  const loading = isLoading || !mounted;

  // Render loading state
  if (loading) {
    return (
      <div className="p-6 mt-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 rounded-xl p-6 h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-6 mt-4 transition-colors duration-300 bg-primary rounded-sm`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-600 pb-4 mb-8 gap-4">
          <h3 className={`text-xl font-semibold text-foreground`}>
            365 Addon Services
          </h3>

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
            Failed to load addons
            {error?.message ? `: ${error.message}` : ""}.
          </div>
        )}

        {/* Grid */}
        {!isError && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
              {uiAddons.map((pkg) => {
                const isSubscribing = subscribingId === pkg.id;
                // const qty = quantities[pkg.id] ?? 1;
                return (
                  <div
                    key={pkg.id}
                    className={`rounded-xl p-6 flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      pkg.highlight && !pkg.isCurrent
                        ? `${colors.cardHighlight} text-white shadow-2xl transform scale-105 border-0`
                        : `bg-gray-800 border-gray-700 border shadow-md`
                    } bg-primary`}
                  >
                    <div className="mb-4 flex gap-2">
                      {pkg.highlight && !pkg.isCurrent && (
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-xs font-medium self-start">
                          ⭐ Most Popular
                        </div>
                      )}
                      {pkg.isCurrent && (
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium self-start ${colors.badge}`}
                        >
                          ✅ Current Plan
                        </div>
                      )}
                    </div>

                    <h3
                      className={`text-xl font-bold mb-2  ${
                        pkg.highlight && !pkg.isCurrent
                          ? "text-primary-foreground"
                          : "text-primary-foreground"
                      }`}
                    >
                      {pkg.name}
                    </h3>

                    <p
                      className={`text-sm mb-1 ${
                        pkg.highlight && !pkg.isCurrent
                          ? "text-primary-foreground"
                          : "text-primary-foreground"
                      }`}
                    >
                      Validity: {pkg.validityLabel}
                    </p>

                    <div className="my-4">
                      <span
                        className={`text-3xl font-bold ${
                          pkg.highlight && !pkg.isCurrent
                            ? "text-primary-foreground"
                            : "text-primary-foreground"
                        }`}
                      >
                        {formatPrice(pkg.price, currency)}
                      </span>
                      <span
                        className={`text-sm ml-1 ${
                          pkg.highlight && !pkg.isCurrent
                            ? "text-blue-100"
                            : "text-white"
                        }`}
                      >
                        /year
                      </span>
                    </div>

                    {/* qty controls (left) + Pay now (merged single button) */}
                    <div className="mt-auto space-y-3">
                      <div className="flex items-center gap-3">
                        {/* <div
                          className={`inline-flex items-center ${colors.qtyBg} rounded-md overflow-hidden`}
                        >
                          <button
                            onClick={() => changeQty(pkg.id, -1)}
                            className={`px-3 py-2 text-sm ${colors.qtyHover} transition-colors`}
                            aria-label="decrease"
                          >
                            -
                          </button>
                          <div className="px-4 py-2 text-sm min-w-[40px] text-center font-medium">
                            {qty}
                          </div>
                          <button
                            onClick={() => changeQty(pkg.id, +1)}
                            className={`px-3 py-2 text-sm ${colors.qtyHover} transition-colors`}
                            aria-label="increase"
                          >
                            +
                          </button>
                        </div> */}

                        <button
                          className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                            pkg.isCurrent
                              ? colors.buttonDisabled
                              : pkg.highlight && !pkg.isCurrent
                                ? "bg-white text-blue-600 hover:bg-gray-100"
                                : colors.buttonPrimary
                          }`}
                          disabled={pkg.isCurrent || isSubscribing}
                          onClick={() => handlePayNow(pkg.id)}
                        >
                          {isSubscribing ? "Processing..." : "Pay now"}
                        </button>
                      </div>

                      <button
                        className={`w-full text-center text-sm py-2 transition-all ${
                          pkg.highlight && !pkg.isCurrent
                            ? "text-blue-100 hover:text-white"
                            : "text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                        }`}
                        onClick={() => {
                          // TODO: open compare modal / navigate to details
                          console.log("Compare addon:", pkg.id);
                        }}
                      >
                        Compare Addon →
                      </button>
                    </div>
                  </div>
                );
              })}

              {uiAddons.length === 0 && (
                <div
                  className={`text-center py-8 ${colors.textMuted} col-span-full`}
                >
                  No addons available at the moment.
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className={`text-center mt-8 ${colors.textMuted} text-sm`}>
          All addons include 24/7 support and regular updates
        </div>
      </div>
    </div>
  );
}

export default AddonsPackages;
