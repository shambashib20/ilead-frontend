type User = {
  _id: string;
  name: string;
  email: string;
  phone_number: string;
  role: "Superadmin" | "Admin" | "User"; // You can add more roles as needed
};

type LoginSuccessResponse = {
  message: string;
  status: "SUCCESS";
  data: {
    user: User;
  };
};

type LoginFailureResponse = {
  message: string;
  status: "FAILURE";
};

type LoginResponse = LoginSuccessResponse | LoginFailureResponse;

export function login(email: string, password: string): Promise<LoginResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email === "admin@mrgroup.com" && password === "password123") {
        resolve({
          message: "User logged in successfully!",
          status: "SUCCESS",
          data: {
            user: {
              _id: "683003ea7bcd1fa1ed41e933",
              name: "MR Superadmin",
              email: "admin@mrgroup.com",
              phone_number: "9999999999",
              role: "Superadmin",
            },
          },
        });
      } else {
        resolve({
          message: "Invalid email or password",
          status: "FAILURE",
        });
      }
    }, 2500);
  });
}
