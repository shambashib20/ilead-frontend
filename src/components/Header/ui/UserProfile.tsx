import { useUser } from "@/features/auth/hooks/useUser";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../ui/dropdown-menu";
import { User as UserIcon, Building2, LogOut } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { fireLogoutOnce } from "@/lib/utils";
import { useUserProfile } from "@/features/leads/hooks/useUserProfile";

export default function UserProfileBox() {
  const { data: user } = useUser();
  const { user: userProfile } = useUserProfile();

  const handleLogout = async () => {
    fireLogoutOnce();
  };

  const fileUrl = userProfile?.meta?.profile_picture_data?.file_url ?? null;
  const username = user?.name ?? "";
  const firstLetter =
    username && username.trim().length > 0
      ? username.trim().charAt(0).toUpperCase()
      : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          {/* Name + role */}
          <h3 className="hidden sm:flex flex-col items-end text-gray-600 dark:text-white text-sm font-base">
            {username}
            <span className="font-light text-[12px]">{user?.role}</span>
          </h3>

          {/* Avatar */}
          <span className="h-9 w-9 text-white font-semibold grid place-items-center bg-btn-bg rounded-full overflow-hidden">
            {fileUrl ? (
              <img
                src={fileUrl}
                alt="User avatar"
                className="h-9 w-9 object-cover"
              />
            ) : firstLetter ? (
              <span className="text-sm font-bold">{firstLetter}</span>
            ) : (
              <UserIcon className="h-5 w-5 text-white" />
            )}
          </span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <Link to="/user-profile">
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
            <UserIcon className="h-4 w-4 " />
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
