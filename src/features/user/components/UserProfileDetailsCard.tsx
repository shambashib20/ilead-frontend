import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Mail,
  Phone,
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import UserAvatar from "./UserAvatar";
import { useUserProfile } from "@/features/leads/hooks/useUserProfile";

// Skeleton Loader Component
function UserProfileSkeleton() {
  return (
    <Card className="max-w-full w-[1000px] mx-auto mt-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 pb-6 dark:bg-gray-900 overflow-hidden">
      <div className="animate-pulse">
        <CardHeader className="">
          <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center">
                <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded-full mr-3"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}

            <div className="flex space-x-4 pt-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full mr-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-3"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex">
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export default function UserProfileDetailsCard() {
  const { user, isLoading, error } = useUserProfile();

  console.log(user?.meta?.profile_picture_data?.file_url);

  const getBooleanBadge = (
    value: boolean,
    // trueVariant:
    //   | "default"
    //   | "destructive"
    //   | "outline"
    //   | "secondary"
    //   | "success",
    // falseVariant: "default" | "destructive" | "outline" | "secondary",
    label: string
  ) => (
    <div className="flex items-center gap-1">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>:
      <Badge className="gap-1">
        {value ? (
          <CheckCircle
            size={20}
            className="  text-gray-600 dark:text-gray-400"
          />
        ) : (
          <XCircle size={20} className="  text-gray-600 dark:text-gray-400" />
        )}
        <span className="  text-gray-600 dark:text-gray-400">
          {value ? "Yes" : "No"}
        </span>
      </Badge>
    </div>
  );

  if (isLoading) return <UserProfileSkeleton />;

  if (error) {
    return (
      <div className="max-w-full w-[1000px] mx-auto mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-800 dark:text-red-400">
        <AlertCircle className="h-5 w-5" />
        <p>{error.message}</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <Card className="max-w-full w-full mx-auto mt-6 overflow-hidden">
      <CardHeader className="flex items-start gap-4 pb-6">
        {/* Left: Avatar */}
        <div className="flex-shrink-0">
          <UserAvatar
            img={user?.meta?.profile_picture_data?.file_url}
            name={user.name}
          />
        </div>

        {/* Right: Title & description */}
        <div className="flex-1 space-y-2">
          <div className="flex items-baseline gap-3">
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
              Profile
            </CardTitle>
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              Super admin
            </span>
          </div>

          {/* User name */}
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {user.name}
          </h4>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Detailed information about the user account
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Phone
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user.phone_number}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user.role?.name}
                </p>
              </div>
            </div>
          </div>

          {user.role?.description && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role Description
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {user.role.description}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-4 py-1">
            {getBooleanBadge(
              user.is_verified,
              "success"
              // "outline",
              // "Verified"
            )}
            {getBooleanBadge(
              user.is_banned,
              "destructive"
              // "outline",s
            )}
            {getBooleanBadge(
              user.reported,
              "destructive"
              // "outline",
              // "Reported"
            )}
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Profile Created
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(user.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {user.role?.permissions?.length > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Permissions Granted
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {user.role.permissions.map((perm: any) => (
                  <div
                    key={perm._id}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {perm.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      {perm.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
