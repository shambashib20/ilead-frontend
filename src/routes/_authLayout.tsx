import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import LogoDark from "@/assets/logo_dark.png";
import Logo from "@/assets/logo.png";
import LogoIcon from "@/assets/logo_small.png";
// import LogoIconDark from "@/assets/logo-dark-sm.png";

import loginAsset from "@/assets/login-v2.svg";
import { useTheme } from "@/contexts/ThemeProvider";
import { useMedia } from "@/hooks/useMedia";

export const Route = createFileRoute("/_authLayout")({
  beforeLoad: async ({ context }) => {
    //console.log(context.user);

    if (context.isAuthenticated) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  const { theme } = useTheme();
  const isMobile = useMedia("(max-width: 767px)");

  // ✅ logic: viewport + theme ke hisaab se logo choose karna
  const logo = isMobile
    ? theme === "light"
      ? LogoIcon
      : LogoIcon
    : theme === "light"
      ? Logo
      : LogoDark;

  return (
    <div className="auth_layout">
      {/* Left side image (only large screens) */}
      <div className="items-center justify-center hidden lg:flex">
        <img src={loginAsset} alt="" className="w-[685px]" />
      </div>

      {/* Right side content */}
      <div className="px-10 pt-13 lg:pt-20 bg-primary">
        <img
          src={logo}
          alt="App Logo"
          className={`block mx-auto ${
            isMobile ? "w-[60px]" : "w-[170px] md:w-[200px]"
          }`}
        />
        <Outlet />
      </div>
    </div>
  );
}
