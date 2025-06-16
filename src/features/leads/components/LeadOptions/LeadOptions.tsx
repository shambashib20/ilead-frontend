import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import {
    ArrowDownUp,
    ChartColumnBig,
    CloudUpload,
    List,
    Plus,
    Settings,
} from "lucide-react";

function LeadOptions() {
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-5">
                <div className="views">
                    <ul className="flex items-center rounded-sm border border-bg-btn text-btn-bg">

                        <li>
                            <button className="p-2.5 border-e border-bg-btn cursor-pointer bg-btn-bg/20">
                                <ChartColumnBig size={19} className="text-[#5e5873] dark:text-[#cfd2d9]" />
                            </button>
                        </li>
                        <li>
                            <button className="p-2.5 cursor-pointer">
                                <List size={19} className="text-[#5e5873] dark:text-[#cfd2d9]" />
                            </button>
                        </li>
                    </ul>
                </div>{" "}
                <CardTitle className="text-2xl font-medium">Leads</CardTitle>
            </div>
            <div>
                <ul className="flex items-center gap-3">
                    <li>
                        <Button size={"icon"}>
                            <Plus />
                        </Button>
                    </li>
                    <li>
                        <Button size={"icon"}>
                            <CloudUpload />
                        </Button>
                    </li>
                    <li>
                        <Button size={"icon"}>
                            <Settings />
                        </Button>
                    </li>
                    <li>
                        <Button size={"icon"}>
                            <ArrowDownUp />
                        </Button>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default LeadOptions