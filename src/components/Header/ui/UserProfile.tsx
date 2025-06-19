import { useUser } from "@/features/auth/hooks/useUser";

export default function UserProfileBox() {
  const { data: user } = useUser();

  return (
    <div className="flex items-center gap-2">
      <h3 className="flex flex-col items-end text-gray-600 dark:text-white text-sm font-base">
        {user.name} <span className="font-light text-[12px]">{user.role}</span>
      </h3>
      <span className="h-9 w-9   text-white  font-semibold grid place-items-center bg-btn-bg rounded-full">{user.name?.split("")?.[0]}</span>
    </div>
  );
}
