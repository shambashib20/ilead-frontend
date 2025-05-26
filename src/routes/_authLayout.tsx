import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import Logo from "@/assets/logo.png";

export const Route = createFileRoute("/_authLayout")({
  beforeLoad: async ({ context }) => {
    console.log(context.user);

    if (context.isAuthenticated) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="auth_layout ">
      <div className=" items-center justify-center hidden lg:flex">
        <img src="/public/login-v2.svg" alt="" className="w-[685px]" />
      </div>
      <div className="px-10  pt-13 lg:pt-8 bg-white">
        <img src={Logo} alt="" className="w-[160px] h-[55px]  block mx-auto" />
        <Outlet />
      </div>
    </div>
  );
}
