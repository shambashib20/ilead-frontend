import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserHeaderProps {
  search: string;
  setSearch: (value: string) => void;
}

function UserHeader({ search, setSearch }: UserHeaderProps) {
  const handleAddUser = () => {
    console.log("Add new user");
    // Add your logic to open a modal or navigate to add user page
  };

  return (
    <div className="flex items-center justify-between shadow-lead dark:border-transparent dark:bg-primary px-3 py-3 rounded-sm mt-5">
      <h2 className="text-xl font-semibold dark:text-white">
        Users & Workspaces
      </h2>
      <div className="flex items-center gap-5">
        <Input
          placeholder="Search by name, email, workspace..."
          className="dark:placeholder:text-white w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSearch("");
          }}
        />
        <Button onClick={handleAddUser}>+ Add User</Button>
      </div>
    </div>
  );
}

export default UserHeader;
