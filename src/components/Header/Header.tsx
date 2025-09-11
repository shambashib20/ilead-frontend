import { useSidebarStore } from "@/store/useSidebarStore";
import HeaderBtnLists from "./ui/HeaderBtnLists";
import HeaderOptionsBox from "./ui/HeaderOptions";
import UserProfileBox from "./ui/UserProfile";
import { Menu } from "lucide-react";

import { PropertyModule } from "@/features/leads/services/Property.service";
import { useEffect, useState } from "react";

function Header() {
  const { setMobileOpen } = useSidebarStore();
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await new PropertyModule().getProperty();
        const logList = res?.data?.data?.logs || [];
        setLogs(logList);
      } catch (error) {
        console.error("Failed to fetch property logs:", error);
      }
    };
    fetchLogs();
  }, []);
  return (
    <header className="bg-primary p-3 flex items-center justify-between shadow-lead rounded-sm sticky top-0 z-10">
      <button
        className="lg:hidden me-3"
        onClick={() => {
          setMobileOpen(true);
        }}
      >
        <Menu className="h-6 w-6 cursor-pointer" />
      </button>

      <HeaderBtnLists />
      <div className="ms-auto flex gap-2 ">
        <HeaderOptionsBox logs={logs} />
        <UserProfileBox />
      </div>
    </header>
  );
}

export default Header;
