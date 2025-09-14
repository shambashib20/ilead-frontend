import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { useMedia } from "@/hooks/useMedia";
import {
  ArrowDownUp,
  ChartColumnBig,
  CloudUpload,
  List,
  Plus,
  Settings,
} from "lucide-react";

type LeadOptionsProps = {
  isTableView: boolean;
  setIsTableView: (val: boolean) => void;
};

function LeadOptions({ isTableView, setIsTableView }: LeadOptionsProps) {
  const isMobile = useMedia("(max-width: 767px)");

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="views">
          <ul className="flex items-center rounded-sm border border-bg-btn text-btn-bg">
            <li>
              <button
                className={`p-2.5 border-e border-bg-btn cursor-pointer ${
                  !isTableView ? "bg-btn-bg/20" : ""
                }`}
                onClick={() => setIsTableView(false)}
              >
                <ChartColumnBig size={isMobile ? 14 : 20} />
              </button>
            </li>
            <li>
              <button
                className={`p-2.5 cursor-pointer ${
                  isTableView ? "bg-btn-bg/20" : ""
                }`}
                onClick={() => setIsTableView(true)}
              >
                <List size={isMobile ? 14 : 20} />
              </button>
            </li>
          </ul>
        </div>
        <CardTitle className="text-lg md:text-2xl font-medium">Leads</CardTitle>
      </div>
      <div>
        <ul className="flex items-center gap-3">
          <li>
            <Button size={"icon"}>
              <Plus size={isMobile ? 14 : 20} />
            </Button>
          </li>
          <li>
            <Button size={"icon"}>
              <CloudUpload size={isMobile ? 14 : 20} />
            </Button>
          </li>
          <li>
            <Button size={"icon"}>
              <Settings size={isMobile ? 14 : 20} />
            </Button>
          </li>
          <li>
            <Button size={"icon"}>
              <ArrowDownUp size={isMobile ? 14 : 20} />
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default LeadOptions;
