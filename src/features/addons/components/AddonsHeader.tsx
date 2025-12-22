// =====================================================
// AddonHeader.tsx
// =====================================================

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModalStore } from "@/store/useModalStore";
import CreateAddon from "./CreateAddon";

interface AddonHeaderProps {
  search: string;
  setSearch: (value: string) => void;
}
function AddonHeader({ search, setSearch }: AddonHeaderProps) {
  const openModal = useModalStore((state) => state.openModal);
  const setModalTitle = useModalStore((state) => state.setModalTitle);

  const handleCreateAddon = () => {
    setModalTitle?.("Create Addon ");
    openModal({
      content: <CreateAddon />,
      type: "form",
    });
  };

  

  return (
    <div className="flex items-center justify-between shadow-lead dark:border-transparent dark:bg-primary px-3 py-3 rounded-sm mt-5">
      <h2 className="text-xl font-semibold dark:text-white">Addon List</h2>
      <div className="flex items-center gap-5">
        <Input
          placeholder="Search by title, description, status..."
          className="dark:placeholder:text-white w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSearch("");
          }}
        />
        <Button onClick={handleCreateAddon}>+ Add Addon</Button>
      </div>
    </div>
  );
}

export default AddonHeader;
