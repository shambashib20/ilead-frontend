import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_dashboardLayout/add-package/")({
  component: RouteComponent,
});

const packages = [
  { name: "Basic", price: 400, validity: "1 Year", highlight: false },
  { name: "Silver", price: 1100, validity: "1 Year", highlight: false },
  { name: "Gold", price: 1650, validity: "1 Year", highlight: false },
  { name: "Platinum", price: 2200, validity: "1 Year", highlight: false },
  { name: "Diamond", price: 2750, validity: "1 Year", highlight: false },
  { name: "Diamond Pro", price: 4350, validity: "1 Year", highlight: true },
];

function RouteComponent() {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const conversionRate = 0.012;

  const formatPrice = (price: number) => {
    if (currency === "INR") {
      return `₹${price.toLocaleString()}`;
    } else {
      return `$${(price * conversionRate).toFixed(2)}`;
    }
  };

  // Theme colors
  const themeColors = {
    dark: {
      bg: "bg-gray-900",
      card: "bg-gray-800",
      cardHighlight: "bg-gradient-to-br from-purple-600 to-blue-600",
      text: "text-white",
      textMuted: "text-gray-300",
      border: "border-gray-700",
      buttonPrimary: "bg-purple-600 hover:bg-purple-700 text-white",
      buttonSecondary: "border border-gray-600 hover:bg-gray-700 text-gray-300",
      buttonDisabled: "bg-gray-700 text-gray-400 cursor-not-allowed",
    },
    light: {
      bg: "bg-gray-50",
      card: "bg-white",
      cardHighlight: "bg-gradient-to-br from-purple-500 to-blue-500",
      text: "text-gray-900",
      textMuted: "text-gray-600",
      border: "border-gray-200",
      buttonPrimary: "bg-purple-500 hover:bg-purple-600 text-white",
      buttonSecondary: "border border-gray-300 hover:bg-gray-50 text-gray-700",
      buttonDisabled: "bg-gray-100 text-gray-400 cursor-not-allowed",
    },
  };

  const colors = themeColors[theme];

  return (
    <div
      className={`min-h-screen p-6 mt-10 transition-colors duration-300 bg-primary rounded-sm`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className={`text-3xl font-bold ${colors.text} mb-2`}>
              365 Packages
            </h1>
            <p className={`${colors.textMuted}`}>
              Choose the perfect plan for your needs
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Theme Toggle */}

            {/* Currency Toggle */}
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-sm p-1">
              <button
                onClick={() => setCurrency("INR")}
                className={`px-4 py-2 rounded-sm text-[10px] font-medium transition-all ${
                  currency === "INR"
                    ? "bg-primary text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                INR
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`px-4 py-2 rounded-sm text-[10px] font-medium transition-all ${
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

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-6 flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                pkg.highlight
                  ? `${colors.cardHighlight} text-white shadow-2xl transform scale-105 border-0`
                  : `${colors.card} ${colors.border} border shadow-md`
              }`}
            >
              {/* Badge for highlighted package */}
              {pkg.highlight && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white bg-opacity-20 text-xs font-medium mb-4 self-start">
                  ⭐ Most Popular
                </div>
              )}

              <h3
                className={`text-xl font-bold mb-2 ${
                  pkg.highlight ? "text-white" : colors.text
                }`}
              >
                {pkg.name}
              </h3>

              <p
                className={`text-sm mb-1 ${
                  pkg.highlight ? "text-blue-100" : colors.textMuted
                }`}
              >
                Validity: {pkg.validity}
              </p>

              <div className="my-4">
                <span
                  className={`text-3xl font-bold ${
                    pkg.highlight ? "text-white" : colors.text
                  }`}
                >
                  {formatPrice(pkg.price)}
                </span>
                <span
                  className={`text-sm ml-1 ${
                    pkg.highlight ? "text-blue-100" : colors.textMuted
                  }`}
                >
                  {currency === "INR" ? "/year" : "/year"}
                </span>
              </div>

              <div className="mt-auto space-y-3">
                <div className="flex gap-2">
                  <button
                    className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                      pkg.highlight
                        ? "bg-white text-purple-600 hover:bg-gray-100"
                        : colors.buttonPrimary
                    }`}
                  >
                    Subscribe
                  </button>
                  <button
                    className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                      pkg.highlight
                        ? "border border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-10"
                        : colors.buttonSecondary
                    }`}
                  >
                    Details
                  </button>
                </div>

                <button
                  className={`w-full text-center text-sm py-2 transition-all ${
                    pkg.highlight
                      ? "text-blue-100 hover:text-white"
                      : "text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300"
                  }`}
                >
                  Compare Package →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className={`text-center mt-8 ${colors.textMuted} text-sm`}>
          All packages include 24/7 support and regular updates
        </div>
      </div>
    </div>
  );
}

export default RouteComponent;
