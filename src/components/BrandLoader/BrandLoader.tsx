interface BrandLoaderProps {
  size?: number;
  speed?: number;
}

export default function BrandLoader({
  size = 80,
  speed = 2,
}: BrandLoaderProps) {
  const animationDuration = `${speed}s`;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: size,
        height: size,
        animation: `spin ${animationDuration} linear infinite`,
      }}
    >
      {/* Red segment (top-left) */}
      <div
        className="absolute"
        style={{
          animation: `segment1 ${animationDuration} ease-in-out infinite`,
          transformOrigin: "center",
        }}
      >
        <svg width={size} height={size} viewBox="0 0 100 100">
          <path
            d="M50 10 L85 30 L70 50 L50 50 Z"
            fill="#ef4444"
            className="drop-shadow-sm"
          />
        </svg>
      </div>

      {/* Yellow segment (top-right) */}
      <div
        className="absolute"
        style={{
          animation: `segment2 ${animationDuration} ease-in-out infinite`,
          transformOrigin: "center",
        }}
      >
        <svg width={size} height={size} viewBox="0 0 100 100">
          <path
            d="M85 30 L85 70 L70 50 L50 50 Z"
            fill="#eab308"
            className="drop-shadow-sm"
          />
        </svg>
      </div>

      {/* Blue segment (bottom) */}
      <div
        className="absolute"
        style={{
          animation: `segment3 ${animationDuration} ease-in-out infinite`,
          transformOrigin: "center",
        }}
      >
        <svg width={size} height={size} viewBox="0 0 100 100">
          <path
            d="M85 70 L50 90 L15 70 L15 30 L30 50 L50 50 L70 50 Z"
            fill="#3b82f6"
            className="drop-shadow-sm"
          />
        </svg>
      </div>

      {/* Center checkmark */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          animation: `checkmark ${animationDuration} ease-in-out infinite`,
        }}
      >
        <svg
          width={size * 0.4}
          height={size * 0.4}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M9 12l2 2 4-4"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
          />
          <circle
            cx="12"
            cy="8"
            r="3"
            fill="#3b82f6"
            className="drop-shadow-sm"
          />
        </svg>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes segment1 {
          0%,
          100% {
            transform: rotate(0deg) translateX(0px) translateY(0px) scale(1);
            opacity: 1;
          }
          25% {
            transform: rotate(-30deg) translateX(-10px) translateY(-5px)
              scale(0.8);
            opacity: 0.7;
          }
          50% {
            transform: rotate(-60deg) translateX(-15px) translateY(-10px)
              scale(0.6);
            opacity: 0.4;
          }
          75% {
            transform: rotate(-30deg) translateX(-10px) translateY(-5px)
              scale(0.8);
            opacity: 0.7;
          }
        }

        @keyframes segment2 {
          0%,
          100% {
            transform: rotate(0deg) translateX(0px) translateY(0px) scale(1);
            opacity: 1;
          }
          25% {
            transform: rotate(30deg) translateX(10px) translateY(-5px)
              scale(0.8);
            opacity: 0.7;
          }
          50% {
            transform: rotate(60deg) translateX(15px) translateY(-10px)
              scale(0.6);
            opacity: 0.4;
          }
          75% {
            transform: rotate(30deg) translateX(10px) translateY(-5px)
              scale(0.8);
            opacity: 0.7;
          }
        }

        @keyframes segment3 {
          0%,
          100% {
            transform: rotate(0deg) translateX(0px) translateY(0px) scale(1);
            opacity: 1;
          }
          25% {
            transform: rotate(15deg) translateX(0px) translateY(10px) scale(0.8);
            opacity: 0.7;
          }
          50% {
            transform: rotate(30deg) translateX(0px) translateY(15px) scale(0.6);
            opacity: 0.4;
          }
          75% {
            transform: rotate(15deg) translateX(0px) translateY(10px) scale(0.8);
            opacity: 0.7;
          }
        }

        @keymarks checkmark {
          0%,
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(0.7) rotate(180deg);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}
