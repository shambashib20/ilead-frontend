import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { loginService } from "../services/login.service";
import { queryClient } from "@/utils/client";

export function useLogin() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return loginService({ email, password });
    },
    onSuccess: (data) => {
      if (data.success) {
        console.log("Login successful:", data.message, data.user);
        localStorage.setItem("user", JSON.stringify(data));
        queryClient.setQueryData(["user"], data);
        setTimeout(() => {
          router.history.push("/dashboard");
        }, 2000); // Simulate a delay for the user experience
        // Redirect to dashboard or another pages
      }
      if (!data.success) {
        console.log("Login successful:", data.message, data.user);
      }
    },
    onError: (error) => {
      console.error("Login failed:", error.message);
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
