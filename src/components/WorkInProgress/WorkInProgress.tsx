export function WorkInProgress() {
  return (
    <div className="flex flex-col items-center">
      {/* Animated Loader */}
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping opacity-75"></div>
        <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-spin border-t-transparent"></div>
        <div className="absolute inset-4 rounded-full bg-blue-500 animate-pulse"></div>
      </div>

      {/* Text */}
      <h2 className="text-2xl font-semibold mb-1">Work in Progress</h2>
      <p className="text-gray-400 text-sm">
        We're building something awesome for you…
      </p>
    </div>
  );
}
