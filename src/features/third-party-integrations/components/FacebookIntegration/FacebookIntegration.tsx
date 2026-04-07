import { useEffect, useRef, useState } from "react";
import { FaFacebookF } from "react-icons/fa";
import { labelService } from "@/features/leads/services/Lable.service";
import { redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Label } from "@/features/leads/types";
import { facebookIntegrationService } from "../../services/FacebookIntegration.service";
import Swal from "sweetalert2";
import ImportFacebookLeadsSection from "../ImportFacebookLeadSection";
import { Card, CardContent } from "@/components/ui/card";
import ExternalWebsiteIntegration from "../ExternalWebsiteIntegration";
import ApiKeyGeneration from "../ApiKeyGeneration";

function FacebookIntegration() {
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleLabel = (id: string) => {
    setSelectedLabels((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
    if (selectedLabels.length === 0) {
      Swal.fire("Warning", "Please select at least one label", "warning");
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
        await facebookIntegrationService.connectWithFacebookPage(selectedLabels);

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

            <div className="relative w-full md:w-[320px]" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className="w-full min-h-[40px] flex flex-wrap gap-1 items-center px-3 py-1.5 rounded-md border border-[#444c6b] bg-primary text-white text-sm text-left"
              >
                {selectedLabels.length === 0 ? (
                  <span className="text-white/60">Select labels</span>
                ) : (
                  selectedLabels.map((id) => {
                    const lbl = labels.find((l) => l._id === id);
                    return (
                      <Badge
                        key={id}
                        variant="secondary"
                        className="flex items-center gap-1 text-xs"
                      >
                        {lbl?.title}
                        <span
                          role="button"
                          className="ml-1 hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLabel(id);
                          }}
                        >
                          ×
                        </span>
                      </Badge>
                    );
                  })
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-md border border-[#444c6b] bg-popover text-popover-foreground shadow-md">
                  {labels.map((label) => (
                    <label
                      key={label._id}
                      className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedLabels.includes(label._id)}
                        onChange={() => toggleLabel(label._id)}
                        className="accent-primary"
                      />
                      {label.title}
                    </label>
                  ))}
                </div>
              )}
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
        <ApiKeyGeneration />
      </div>

      <div>
        <ExternalWebsiteIntegration />
      </div>
    </div>
  );
}

export default FacebookIntegration;
