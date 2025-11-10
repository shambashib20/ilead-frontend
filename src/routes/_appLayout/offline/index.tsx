import { createFileRoute } from "@tanstack/react-router";
import { WifiOff, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/_appLayout/offline/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <OfflinePage />;
}

const OfflinePage = () => {
  const handleRefresh = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-orange-500/20 rounded-full flex items-center justify-center">
                <WifiOff className="w-16 h-16 text-orange-400" />
              </div>
              <div className="absolute inset-0 border-2 border-orange-400/30 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Message */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8 mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              You're Offline
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              It looks like you've lost your internet connection. Please check
              your network settings and try refreshing the page when you're back
              online.
            </p>

            {/* Troubleshooting Tips */}
            <div className="bg-slate-700/30 rounded-xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-4 flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                Quick Troubleshooting
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {[
                  "Check your Wi-Fi or mobile data",
                  "Restart your router",
                  "Disable VPN if using one",
                  "Check airplane mode settings",
                ].map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-slate-300"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-3"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh Page</span>
            </button>
          </div>

          {/* Connection Status */}
          <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-center space-x-4 text-slate-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm">No internet connection</span>
              </div>
              <span className="text-slate-600">•</span>
              <span className="text-sm">
                Last checked: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="text-center text-slate-500 text-sm">
          <p>If the problem persists, please contact support</p>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;
