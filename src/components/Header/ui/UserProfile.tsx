import { useUser } from "@/features/auth/hooks/useUser";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../ui/dropdown-menu";
import { User, Building2, LogOut } from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function UserProfileBox() {
  const { data: user } = useUser();

  const handleLogout = async () => {
    try {
      const res = await fetch(
        "https://hahhmr7zur.us-east-1.awsapprunner.com/api/auth/logout",
        {
          method: "GET", // usually logout should be POST, but keep GET if your API says so
          credentials: "include", // if you use cookies
        }
      );

      const data = await res.json();
      console.log("Logout response:", data);

      // clear local storage before redirect
      localStorage.clear();

      // redirect to login
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className=" flex items-center gap-2 cursor-pointer">
          <h3 className="hidden sm:flex flex-col items-end text-gray-600 dark:text-white text-sm font-base">
            {user.name}{" "}
            <span className="font-light text-[12px]">{user.role}</span>
          </h3>
          <span className="h-9 w-9 text-white font-semibold grid place-items-center bg-btn-bg rounded-full">
            {user.name?.split("")?.[0]}
          </span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <Link to="/user-profile">
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
          <Building2 className="h-4 w-4" />
          <Link to="/workspace-details">
            <span>Workspace Details</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
