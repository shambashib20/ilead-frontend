// src/hooks/useAdminLogin.ts
import { useMutation } from "@tanstack/react-query";
import { adminAuthService } from "../services/adminAuth.service";
import { useRouter, useSearch } from "@tanstack/react-router";
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
      if (data.status === "SUCCESS") {
        // const redirectTo = search.redirect || "/admin";
        localStorage.setItem("user", JSON.stringify(data));
        queryClient.setQueryData(["user"], data);
        setTimeout(() => {
          router.history.push("/masterpannel");
        }, 0); // Simulate a delay for the user experience
        console.log(data);
      }

      toast("Login Successful! 🎉", {
        description:
          "You have been logged in successfully. Redirecting to dashboard...",
        duration: 1000,
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

      if (!data.status || data.status !== "SUCCESS") {
        console.log("Login successful:", data.message, data.data.user);
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
