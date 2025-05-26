import { login } from "../__mock_api__/login";

export async function loginService({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{
  success: boolean;
  message: string;
  user?: { email: string; id: string; name: string; role: string };
}> {
  try {
    const response = await login(email, password);

    if (response.status === "SUCCESS") {
      return {
        success: true,
        message: response.message,
        user: {
          email: response.data.user.email,
          id: response.data.user._id,
          name: response.data.user.name,
          role: response.data.user.role,
        },
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  } catch (err) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
