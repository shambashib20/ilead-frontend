import { useForm } from "@tanstack/react-form";

import type { AnyFieldApi } from "@tanstack/react-form";
import { useLogin } from "../../hooks/useLogin";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(",")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

function LoginForm() {
  const { login, isLoading } = useLogin();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      if (!value.email?.trim() && !value.password?.trim()) {
        return toast.error("Email and Password are required");
      }
      if (!value.email?.trim()) {
        return toast.error("Email is required");
      }
      if (!value.password?.trim()) {
        return toast.error("Password is required");
      }

      await login({ email: value.email, password: value.password });

      form.reset();
    },
  });

  return (
    <div className="login_form w-[450px] max-w-full lg:w-full mx-auto">
      <h3 className="heading mt-3 mb-6">Welcome to ETC CRM! 👋</h3>
      {/* {isLoading && <Loader />} */}
      {/* {!data?.status ? (
        <p className="error">{data?.message}</p>
      ) : (
        <p className="error">{data?.message}</p>
      )} */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="mb-4">
          <form.Field
            name="email"
            children={(field) => (
              <>
                <Label htmlFor={field.name} className="mb-2">
                  Email OR Mobile: <span>*</span>
                </Label>
                <Input
                  type="email"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  placeholder="Email OR Mobile"
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>
        <div>
          <form.Field
            name="password"
            children={(field) => (
              <>
                <Label htmlFor={field.name} className="mb-2">
                  Password: <span>*</span>
                </Label>
                <Input
                  type="password"
                  id={field.name}
                  name={field.name}
                  placeholder="******"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>
        <Link
          to="/forget-password"
          className={`justify-end w-full my-1 ${buttonVariants({ variant: "link", size: "sm" })}`}
        >
          Forgot Password?
        </Link>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <div>
              {/* Primary Submit Button */}
              <Button
                type="submit"
                disabled={!canSubmit || isLoading}
                className="w-full"
              >
                {isSubmitting || isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Helper Text */}
              <h3 className="small-primary text-sm text-center my-5">
                New on our platform?{" "}
                <Link to="/register" className="font-semibold">
                  Create an account
                </Link>
              </h3>

              {/* Secondary Action (not a submit) */}
              <Button
                type="button"
                disabled={isSubmitting}
                className="w-full"
                onClick={() =>
                  window.open("https://t.me/yourchannel", "_blank")
                }
              >
                Join Our Channel
              </Button>
            </div>
          )}
        </form.Subscribe>

        <Link to="/user-login">
          <Button type="button" className="w-full mt-5">
            All Users Login
          </Button>
        </Link>
      </form>
    </div>
  );
}

export default LoginForm;
