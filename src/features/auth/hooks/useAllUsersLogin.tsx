import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
// import { loginService } from "../services/login.service";
import { queryClient } from "@/utils/client";
import { authService } from "../services/Auth.service";

export function useAllUsersLogin(planId?: string | null) {
  const router = useRouter();

  console.log(planId);

  const mutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return authService.loginForAll({ email, password });
    },
    onSuccess: (data) => {
      console.log(data);

      if (data.status === "SUCCESS") {
        console.log("Login successful:", data.message, data.data.user);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        queryClient.setQueryData(["user"], data);
        setTimeout(() => {
          if (planId && planId !== "free") {
            router.history.push(`/workspace-details?plan=${planId}`);
          } else {
            router.history.push("/dashboard");
          }
        }, 0); // Simulate a delay for the user experience
        // Redirect to dashboard or another pages
      }
      if (!data.status || data.status !== "SUCCESS") {
        console.log("Login successful:", data.message, data.data.user);
      }
    },
    onError: (error) => {
      console.error("Login failed:", error.name, error.message);
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    error: mutation.error,
  };
}
