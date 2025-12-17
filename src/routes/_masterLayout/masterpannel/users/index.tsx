import UserHeader from "@/features/userMaster/components/UserHeader";
import UserTable from "@/features/userMaster/components/UserTable";
import { useUsers } from "@/features/userMaster/hooks/useUsers";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_masterLayout/masterpannel/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 12;

  const { workspaces, pagination, isLoading } = useUsers(page, limit);

  // Filter workspaces and users based on search
  const filteredWorkspaces =
    workspaces
      ?.map((workspace) => {
        if (!search) return workspace;

        const searchLower = search.toLowerCase();

        // Check if workspace name matches
        const workspaceMatches = workspace.property_name
          ?.toLowerCase()
          .includes(searchLower);

        // Filter users within workspace
        const filteredUsers = workspace.users.filter(
          (user) =>
            user.name?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower) ||
            user.phone_number?.includes(search) ||
            user.role?.toLowerCase().includes(searchLower)
        );

        // Return workspace if it matches or has matching users
        if (workspaceMatches || filteredUsers.length > 0) {
          return {
            ...workspace,
            users: workspaceMatches ? workspace.users : filteredUsers,
            totalUsers: workspaceMatches
              ? workspace.totalUsers
              : filteredUsers.length,
          };
        }

        return null;
      })
      .filter(Boolean) || [];

  console.log(workspaces);

  return (
    <div className="space-y-4 mt-10">
      <UserHeader search={search} setSearch={setSearch} />
      <UserTable
        workspaces={filteredWorkspaces }
        page={page}
        setPage={setPage}
        limit={limit}
        pagination={pagination}
        isLoading={isLoading}
      />
    </div>
  );
}
