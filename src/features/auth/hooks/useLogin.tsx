import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
// import { loginService } from "../services/login.service";
import { queryClient } from "@/utils/client";
import { authService } from "@/features/auth/services/Auth.service";
import Swal from "sweetalert2";

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
        }, 2000); // Simulate a delay for the user experience

        toast.success("Login Successful! 🎉", {
          description:
            "You have been logged in successfully. Redirecting to dashboard...",
          duration: 2000,
          dismissible: true,
          style: {
            background: "#333",
            color: "#fff",
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
    onError: (error) => {
      toast.error("Login Failed", {
        description:
          "Invalid credentials. Please check your email and password.",
        duration: 2000,
        dismissible: true,
        // style: {
        //   background: "#173b78",
        //   color: "#fff",
        // },
        // className: "bg-red-600",
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
