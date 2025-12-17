import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
// import { loginService } from "../services/login.service";
import { queryClient } from "@/utils/client";
import { authService } from "@/features/auth/services/Auth.service";
import { useTheme } from "@/contexts/ThemeProvider";

export function useLogin() {
  const { theme } = useTheme();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return authService.login({ email, password });
    },

    onSuccess: (data) => {
      console.log("[v0] Login response:", data);

      if (data.status === "SUCCESS") {
        if (data.data?.user.role === "Masteradmin") {
          console.log("[v0] Masteradmin blocked from regular login");

          toast.error("Access Denied", {
            description: "Masteradmin users must login from /admin/login",
            duration: 3000,
          });

          return;
        }

        console.log("Login successful:", data.message, data.data.user);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        if (queryClient) {
          queryClient.setQueryData(["user"], data);
        }

        setTimeout(() => {
          
          router.navigate({ to: "/dashboard" });
        }, 0);

        toast.success("Login Successful!", {
          description:
            "You have been logged in successfully. Redirecting to dashboard...",
          duration: 1000,
        });
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
    login: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    error: mutation.error,
    // isSubmitting: mutation
  };
}
