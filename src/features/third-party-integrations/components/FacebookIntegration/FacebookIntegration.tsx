import { useEffect, useState } from "react";
import { FaFacebookF } from "react-icons/fa";
import { labelService } from "@/features/leads/services/Lable.service";
import { redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Label } from "@/features/leads/types";
import { facebookIntegrationService } from "../../services/FacebookIntegration.service";
import Swal from "sweetalert2";
import ImportFacebookLeadsSection from "../ImportFacebookLeadSection";
import { Card, CardContent } from "@/components/ui/card";
import ExternalWebsiteIntegration from "../ExternalWebsiteIntegration";

function FacebookIntegration() {
  const [selectedLabel, setSelectedLabel] = useState("");
  const [labels, setLabels] = useState<Label[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleLogin = async () => {
    try {
      const loginUrl = await facebookIntegrationService.getFacebookAuthUrl();

      const popup = window.open(loginUrl, "_blank", "width=600,height=700");

      const pollTimer = window.setInterval(() => {
        try {
          const success = popup?.localStorage.getItem("fb_integration_success");

          if (success) {
            window.clearInterval(pollTimer);
            popup?.close();
            Swal.fire("Success", "Facebook connected!", "success");
          }
        } catch (e) {
          // Swallow cross-origin frame access errors
        }
      }, 1000);
    } catch (error) {
      console.error("Failed to initiate Facebook login:", error);
      Swal.fire("Error", "Failed to connect to Facebook", "error");
    }
  };

  const handleSave = async () => {
    if (!selectedLabel) {
      Swal.fire("Warning", "Please select a label first", "warning");
      return;
    }

    try {
      setIsSaving(true);

      // Show loading modal
      Swal.fire({
        title: "Connecting Facebook page...",
        text: "This may take a few minutes. Please do not close this tab.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response =
        await facebookIntegrationService.connectWithFacebookPage(selectedLabel);

      const msg = response?.message || "Facebook page connected successfully!";

      console.log("Facebook page connection response:", response);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: msg,
        showConfirmButton: false,
        timer: 1200,
        timerProgressBar: true,
      });

      redirect({ to: "/lead" });
    } catch (error: any) {
      console.error("Failed to connect Facebook page:", error);

      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to connect Facebook page";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errMsg,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await labelService.labels();
        setLabels(response?.data?.data);
      } catch (error) {
        console.error("Error fetching labels:", error);
      }
    };

    fetchLabels();
  }, []);

  return (
    <div className="leads-sec mt-7">
      <Card>
        <CardContent>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold">
                FaceBook Lead Integration
              </h2>
              <p className="text-sm text-foreground">Login With FaceBook</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <Button
              onClick={handleLogin}
              className="text-white w-full md:w-[320px]"
            >
              <FaFacebookF className="mr-2" /> Connect To Facebook
            </Button>

            <div className="flex flex-col w-full md:w-[320px]">
              <Select value={selectedLabel} onValueChange={setSelectedLabel}>
                <SelectTrigger className="w-full bg-primary text-white border border-[#444c6b]">
                  <SelectValue placeholder="Select label" />
                </SelectTrigger>
                <SelectContent>
                  {labels.map((label) => (
                    <SelectItem key={label._id} value={label._id}>
                      {label.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSave}
              className="text-white w-[80px]"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <ImportFacebookLeadsSection />
      </div>

      <div>
        <ExternalWebsiteIntegration />
      </div>
    </div>
  );
}

export default FacebookIntegration;
