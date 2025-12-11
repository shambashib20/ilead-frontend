import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { useMedia } from "@/hooks/useMedia";
import { useModalStore } from "@/store/useModalStore";
import {
  // ArrowDownUp,
  ChartColumnBig,
  CloudUpload,
  Download,
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
  const { openModal, setModalTitle, setModalSize, closeModal } =
    useModalStore();
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
      closeModal();
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
    // setModalTitle?.("Export Lead");
    setModalSize?.("sm");
    openModal({
      content: (
        <div className="flex flex-col items-center justify-center w-full gap-3 p-6">
          <h3 className="text-3xl text-foreground font-semibold text-center">
            Export Your Lead
          </h3>
          <p className="text-muted-foreground text-center -mt-2 mb-4">
            Lead will be exported in Excel format
          </p>

          {/* Export Button */}
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="w-5 h-5" /> Export
          </Button>
        </div>
      ),
      type: "info",
      customActions: (
        <div className="w-full flex justify-center py-4">
          {/* Excel File Preview */}
          <div className="border rounded-lg shadow-sm bg-background w-[280px]">
            {/* Header */}
            <div className="flex items-center gap-2 px-3 py-2 border-b">
              <div className="w-5 h-5 bg-green-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">
                X
              </div>
              <span className="text-sm font-medium">Leads.xlsx</span>
            </div>

            {/* Table-like preview */}
            <div className="p-3">
              <div className="grid grid-cols-3 text-xs font-medium text-foreground/80 border-b pb-1 mb-1">
                <span>Name</span>
                <span>Email</span>
                <span>Phone</span>
              </div>
              <div className="grid grid-cols-3 text-xs text-muted-foreground">
                <span>John Doe</span>
                <span>john@email.com</span>
                <span>+91 98765</span>
              </div>
              <div className="grid grid-cols-3 text-xs text-muted-foreground">
                <span>Jane Smith</span>
                <span>jane@email.com</span>
                <span>+91 91234</span>
              </div>
              <p className="text-[11px] text-muted-foreground italic mt-2">
                ... and more leads
              </p>
            </div>
          </div>
        </div>
      ),
    });
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="views">
          <ul className="flex items-center rounded-[4px] border border-primary-foreground text-btn-bg">
            <li>
              <button
                className={`p-1.5 border-e border-bg-btn cursor-pointer ${
                  !isTableView ? "bg-primary-foreground/20" : ""
                }`}
                onClick={() => setIsTableView(false)}
              >
                <ChartColumnBig
                  size={isMobile ? 14 : 20}
                  className="text-primary-foreground"
                />
              </button>
            </li>
            <li>
              <button
                className={`p-1.5 cursor-pointer ${
                  isTableView ? "bg-primary-foreground/20" : ""
                }`}
                onClick={() => setIsTableView(true)}
              >
                <List
                  size={isMobile ? 14 : 20}
                  className="text-primary-foreground"
                />
              </button>
            </li>
          </ul>
        </div>
        <CardTitle className="text-lg md:text-2xl font-medium">Leads</CardTitle>
      </div>
      <div>
        <ul className="flex items-center gap-3">
          <li title="Add Lead">
            <Button size={"icon"} onClick={handleCreateModal}>
              <Plus size={isMobile ? 14 : 20} />
            </Button>
          </li>
          <li title="Import Leads">
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
            <li title="Export Leads">
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
