import { createFileRoute } from "@tanstack/react-router";
import LoginForm from "@/features/auth/components/LoginForm";

export const Route = createFileRoute("/_authLayout/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="login-page">
      <LoginForm />
    </div>
  );
}
