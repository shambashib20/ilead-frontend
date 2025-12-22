import { Input } from "@/components/ui/input";

interface CampaignHeaderProps {
  search: string;
  setSearch: (value: string) => void;
}

function CampaignHeader({ search, setSearch }: CampaignHeaderProps) {
  return (
    <div className="flex items-center justify-between shadow-lead dark:border-transparent dark:bg-primary px-3 py-3 rounded-sm mt-5">
      <h2 className="text-xl font-semibold dark:text-white">Campaign List</h2>
      <div className="flex items-center gap-5">
        <Input
          placeholder="Search by title, type, message..."
          className="dark:placeholder:text-white w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSearch("");
          }}
        />
        {/* <Button onClick={handleAddCampaign}>+ Add Campaign</Button> */}
      </div>
    </div>
  );
}

export default CampaignHeader;
