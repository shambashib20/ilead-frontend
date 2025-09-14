import { createFileRoute } from "@tanstack/react-router";
// import { useAuthStore } from "../../features/auth/store/useAuthStore";
import RegisterForm from "@/features/auth/components/RegisterForm";

export const Route = createFileRoute("/_authLayout/register")({
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="register-page">
      {" "}
      <RegisterForm />
    </div>
  );
}
