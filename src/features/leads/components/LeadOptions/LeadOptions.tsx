import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { useMedia } from "@/hooks/useMedia";
import { useModalStore } from "@/store/useModalStore";
import {
  // ArrowDownUp,
  ChartColumnBig,
  CloudUpload,
  List,
  Plus,
  // Settings,
} from "lucide-react";
import { ImportLeadForm } from "../LeadModals/LeadModals";
// import { useExportLeads } from "../../hooks/useExportLeads";
import axios from "axios";
import CreateLeadModal from "../HeaderBtnModals/CreateLeadModal";

type LeadOptionsProps = {
  isTableView: boolean;
  setIsTableView: (val: boolean) => void;
};

function LeadOptions({ isTableView, setIsTableView }: LeadOptionsProps) {
  const isMobile = useMedia("(max-width: 767px)");
  const { openModal, setModalTitle, setModalSize } = useModalStore();
  // const { exportLead } = useExportLeads();

  // function get
  // console.log(exportLead);

  async function handleExport() {
    try {
      const res = await axios.get(
        "https://crm-server-tsnj.onrender.com/api/lead/export-leads",
        {
          responseType: "blob", // yeh important hai
          withCredentials: true,
        }
      );

      // Excel file download trigger
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "leads.xlsx"); // naam user ko milega
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed:", err);
    }
  }

  function handleCreateModal() {
    // setModalTitle?.("Create Lead");
    // setModalSize?.("normal");
    openModal({
      content: <CreateLeadModal />,
      type: "info",
    });
  }

  function handleUploadDocModal() {
    setModalTitle?.("Import Lead");
    setModalSize?.("normal");
    openModal({
      content: <ImportLeadForm />,
      type: "form",
    });
  }

  function handleExportDocModal() {
    setModalTitle?.("Export Lead");
    setModalSize?.("sm");
    openModal({
      content: (
        <div className="flex items-center justify-center w-full flex-col gap-3">
          <h3 className="text-3xl text-foreground font-bold">
            Click In Bellow{" "}
          </h3>
          <Button onClick={handleExport}>Export</Button>
        </div>
      ),
      type: "action",
    });
  }

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
            <Button size={"icon"} onClick={handleCreateModal}>
              <Plus size={isMobile ? 14 : 20} />
            </Button>
          </li>
          <li>
            <Button size={"icon"} onClick={handleUploadDocModal}>
              <CloudUpload size={isMobile ? 14 : 20} />
            </Button>
          </li>
          {/* <li>
            <Button size={"icon"}>
              <Settings size={isMobile ? 14 : 20} />
            </Button>
          </li> */}
          {isTableView && (
            <li>
              <Button size={"icon"} onClick={handleExportDocModal}>
                <CloudUpload
                  size={isMobile ? 14 : 20}
                  className={"rotate-180"}
                />
              </Button>
            </li>
          )}

          {/* <li>
            <Button size={"icon"}>
              <ArrowDownUp size={isMobile ? 14 : 20} />
            </Button>
          </li> */}
        </ul>
      </div>
    </div>
  );
}

export default LeadOptions;
