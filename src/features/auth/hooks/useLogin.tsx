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
      console.log(data);

      if (data.status === "SUCCESS") {
        console.log("Login successful:", data.message, data.data.user);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        queryClient.setQueryData(["user"], data);
        setTimeout(() => {
          router.history.push("/dashboard");
        }, 0); // Simulate a delay for the user experience

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
      }
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
    login: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    error: mutation.error,
    // isSubmitting: mutation
  };
}
