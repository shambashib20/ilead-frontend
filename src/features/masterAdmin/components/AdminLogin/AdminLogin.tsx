import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { useAdminLogin } from "../../hooks/useAdminLogin";

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em className="text-[12px] text-gray-100">
          {field.state.meta.errors.join(", ")}
        </em>
      ) : null}

      {field.state.meta.isValidating ? <small>Checking...</small> : null}
    </>
  );
}

function AdminLogin() {
  const { login } = useAdminLogin();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      console.log("Submitting...", value);

      login({ email: value.email, password: value.password });

      alert("Login successful ✅");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      style={{ maxWidth: 360 }}
    >
      <div className="mt-5 mb-5">
        <h3 className="text-xl font-medium">Admin Login</h3>
      </div>

      {/* EMAIL */}
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => {
            if (!value) return "Email is required";
            if (!/^\S+@\S+\.\S+$/.test(value)) return "Invalid email format";
          },
          onChangeAsyncDebounceMs: 500,
          onChangeAsync: async ({ value }) => {
            await new Promise((r) => setTimeout(r, 800));
            return value.endsWith("@test.com")
              ? "Test domains are not allowed"
              : undefined;
          },
        }}
      >
        {(field) => (
          <div className="space-y-2 mb-4">
            <Label>Email</Label>
            <Input
              placeholder="email"
              type="email"
              className="placeholder:text-gray-900 dark:placeholder:text-gray-200 placeholder:italic"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FieldInfo field={field} />
          </div>
        )}
      </form.Field>

      {/* PASSWORD */}
      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) => {
            if (!value) return "Password is required";
            if (value.length < 6) return "Minimum 6 characters";
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              className="placeholder:text-gray-900 dark:placeholder:text-gray-200 placeholder:italic"
              placeholder="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FieldInfo field={field} />
          </div>
        )}
      </form.Field>

      {/* ACTIONS */}
      <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <div style={{ marginTop: 12 }} className="flex flex-col gap-4">
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "Logging in…" : "Login"}
            </Button>

            <Button
              variant={"ghost"}
              className="border border-blue-500 dark:text-blue-500 text-black"
              type="reset"
              onClick={(e) => {
                e.preventDefault();
                form.reset();
              }}
            >
              Reset
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}

export default AdminLogin;
