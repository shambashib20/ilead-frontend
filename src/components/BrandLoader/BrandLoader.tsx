import Logo from "@/assets/logo_small.png";

interface BrandLoaderProps {
  size?: number;
  speed?: number; // animation duration in seconds
}

export default function BrandLoader({
  size = 80,
  speed = 2,
}: BrandLoaderProps) {
  const animationDuration = `${speed}s`;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={Logo}
        alt="Loading"
        width={size}
        height={size}
        style={{
          animation: `
      brandEntry 0.6s ease-out forwards,
      brandSpin ${animationDuration} ease-in-out infinite
    `,
          transformOrigin: "center",
        }}
      />
    </div>
  );
}
