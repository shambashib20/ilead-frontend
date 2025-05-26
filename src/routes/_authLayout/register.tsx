import { createFileRoute } from "@tanstack/react-router";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import RegisterForm from "@/features/auth/components/RegisterForm";

export const Route = createFileRoute("/_authLayout/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const register = useAuthStore((state) => state.register);

  function handleSubmit(formData: FormData) {
    const data = Object.assign(
      {},
      ...Array.from(formData.entries()).map(([key, value]) => ({
        [key]: value,
      }))
    );
    register(data);
    console.log("Form submitted with data:", data);
    // Here you would typically call a register function from your auth store
    // register(data);
  }

  return (
    <div className="register-page">
      {" "}
      <RegisterForm />
    </div>
  );
}
