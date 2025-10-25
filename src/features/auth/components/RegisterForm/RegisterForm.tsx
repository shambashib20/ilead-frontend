import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

import Swal from "sweetalert2";
import { workspaceService } from "@/features/workspace/services/Property.service";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

function RegisterForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    roleName: "Superadmin",
    name: "",
    email: "",
    phone_number: "",
    password: "",
    orgName: "",
    orgDescription: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await workspaceService.register(form);
      Swal.fire("Success", "You have registered successfully!", "success").then(
        () => {
          navigate({ to: "/user-login" });
        }
      );
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Registration failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login_form w-[450px] max-w-full lg:w-full mx-auto">
      <h3 className="text-2xl md:text-lg font-medium mt-3 text-center md:text-start  ">
        Welcome to ETC CRM!
        {/* A custom tailor made service for your business
        needs! */}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-6">
        <div>
          <Label className="mb-2">Name</Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
        </div>

        <div>
          <Label className="mb-2">Email</Label>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>

        <div>
          <Label className="mb-2">Phone Number</Label>
          <Input
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            placeholder="Phone Number"
            required
          />
        </div>

        <div>
          <Label className="mb-2">Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <span
              className="absolute right-2 top-2.5 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
            </span>
          </div>
        </div>

        <div>
          <Label className="mb-2">Organization Name</Label>
          <Input
            name="orgName"
            value={form.orgName}
            onChange={handleChange}
            placeholder="Organization Name"
            required
          />
        </div>

        <div>
          <Label className="mb-2">Organization Description</Label>
          <Input
            name="orgDescription"
            placeholder="Organization Description"
            value={form.orgDescription}
            onChange={handleChange}
          />
        </div>
        <div className="pb-20">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Registering..." : "Register"}
          </Button>
          <h3 className="small-primary text-[12px] md:text-sm text-center my-2 mb-6">
            Already Registered?{" "}
            <Link to="/login" className="font-semibold">
              Sign in
            </Link>
          </h3>
          <Button
            type="submit"
            // disabled={!canSubmit}
            className="w-full bg-yellow-600"
          >
            {"Join Our Channel"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
