// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { useModalStore } from "@/store/useModalStore";

interface ClientHeaderProps {
  search: string;
  setSearch: (value: string) => void;
}

function ClientHeader({ search, setSearch }: ClientHeaderProps) {
  return (
    <div className="flex items-center justify-between shadow-lead dark:border-transparent dark:bg-primary px-3 py-3 rounded-sm mt-5">
      <h2 className="text-2xl font-semibold dark:text-white">CRM Leads</h2>
      <div className="flex items-center gap-5">
        <Input
          placeholder="Search by name, email, mobile..."
          className="dark:placeholder:text-white w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSearch("");
          }}
        />
        {/* <Button onClick={handleCreateModal}>+ Add Client</Button> */}
      </div>
    </div>
  );
}

export default ClientHeader;
