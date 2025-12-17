// src/hooks/useAdminLogin.ts
import { useMutation } from "@tanstack/react-query";
import { adminAuthService } from "../services/adminAuth.service";
import { useRouter } from "@tanstack/react-router";
import { queryClient } from "@/utils/client";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeProvider";

interface AdminLoginPayload {
  email: string;
  password: string;
}

export function useAdminLogin() {
  const router = useRouter();
  const { theme } = useTheme();
  const mutation = useMutation({
    mutationFn: (payload: AdminLoginPayload) =>
      adminAuthService.adminLogin(payload).then((res) => res.data),

    onSuccess: (data) => {
      console.log("[v0] Admin login response:", data);

      if (data.status === "SUCCESS") {
        if (data.data?.user.role === "Masteradmin") {
          localStorage.setItem("user", JSON.stringify(data.data.user));
          if (queryClient) {
            queryClient.setQueryData(["user"], data);
          }

          setTimeout(() => {
            router.navigate({ to: "/masterpannel" });
          }, 0);

          toast.success("Login Successful!", {
            description:
              "You have been logged in successfully. Redirecting to master panel...",
            duration: 1000,
          });
        } else {
          console.log("[v0] Non-Masteradmin blocked from admin login");

          toast.error("Access Denied", {
            description:
              "Only Masteradmin users can login here. Please use /login",
            duration: 3000,
          });
        }
      }

      if (!data.status || data.status !== "SUCCESS") {
        console.log("Login failed:", data.message);
      }
    },
    onError: (error, variables) => {
      console.log(variables);

      toast("Login Failed", {
        description: error.message || "An error occurred during login.",
        duration: 2000,
        dismissible: true,
        style: {
          background: theme === "dark" ? "#333" : "#fff",
          color: theme === "dark" ? "#fff" : "#333",
        },

        action: {
          label: "Close",
          onClick: () => toast.dismiss(),
        },
      });
    },
  });

  return {
    login: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSubmitting: mutation.isPending, // same thing, different UX semantics
    error: mutation.error,
    isError: mutation.isError,
  };
}
