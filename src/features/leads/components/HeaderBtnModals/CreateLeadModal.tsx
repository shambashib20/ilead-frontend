import { useEffect, useMemo, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactSelect, { type StylesConfig, type MultiValue } from "react-select"; // 👈 alag naam se import
import { toast } from "sonner";
import { createLeadFromPlatform } from "../../services/LeadsModule.service";
import { labelService } from "../../services/Lable.service";
import { statusService } from "../../services/Status.service";
import {
  chatAgentService,
  type Agents,
} from "../../services/ChatAgents.service";
import { z } from "zod";
import { useModalStore } from "@/store/useModalStore";
import Swal from "sweetalert2";
import PaywallUi from "@/components/PaywallUi";
import { sourceService, type Source } from "../../services/Source.service";
import { useTheme } from "@/contexts/ThemeProvider";

// ---------- Types ----------
type LabelOption = { value: string; label: string };
type Status = { _id: string; title: string };
type Label = { _id: string; title: string };

// ---------- Validation ----------
const LeadSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  company_name: z.string().trim().optional().default(""),
  phone_number: z
    .string()
    .trim()
    .min(6, "Phone looks too short")
    .max(20, "Phone looks too long"),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  address: z.string().trim().optional().default(""),
  comment: z.string().trim().optional().default(""),
  reference: z.string().trim().optional().default(""),
  status: z.string().min(1, "Pick a status"),
  assigned_to: z.string().optional().default(""),
  source: z.string().optional().default(""),
  labels: z.array(z.string()).optional().default([]),
  createdAt: z.string().optional().default(""),
});

export type LeadForm = z.infer<typeof LeadSchema>;

// ---------- Label Select Styles ----------

function safeGetPropertyId() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw)?.property_id ?? null;
  } catch {
    return null;
  }
}

export default function CreateLeadModal() {
  const { pushModal, closeModal } = useModalStore();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedLabels, setSelectedLabels] = useState<LabelOption[]>([]);
  const { theme } = useTheme();

  const [form, setForm] = useState<LeadForm>({
    name: "",
    company_name: "",
    phone_number: "",
    email: "",
    address: "",
    comment: "",
    reference: "",
    labels: [],
    status: "",
    assigned_to: "",
    source: "",
    createdAt: "",
  });

  const [labels, setLabels] = useState<Label[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [chatAgents, setChatAgents] = useState<Agents[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  const labelSelectStyles = useMemo<StylesConfig<LabelOption, true>>(
    () => ({
      control: (s) => ({
        ...s,
        backgroundColor: "transparent",
        borderColor: theme === "dark" ? "#4a5568" : "#e2e8f0",
        boxShadow: "none",
        "&:hover": {
          borderColor: theme === "dark" ? "#6b7280" : "#cbd5e0",
        },
      }),
      menu: (s) => ({
        ...s,
        backgroundColor: theme === "dark" ? "#1e2a3b" : "white",
        border: `1px solid ${theme === "dark" ? "#4a5568" : "#e2e8f0"}`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        zIndex: 9999,
      }),
      menuList: (s) => ({
        ...s,
        backgroundColor: "transparent",
        padding: "4px",
      }),
      option: (s, state) => ({
        ...s,
        borderRadius: "6px",
        backgroundColor: state.isSelected
          ? "#3a3285"
          : state.isFocused
            ? theme === "dark"
              ? "rgba(58,50,133,0.4)"
              : "#f0f0f0"
            : "transparent",
        color: state.isSelected
          ? "white"
          : theme === "dark"
            ? "#e6e4ff"
            : "#333",
        fontSize: "14px",
        cursor: "pointer",
      }),
      multiValue: (s) => ({
        ...s,
        backgroundColor: theme === "dark" ? "rgba(58,50,133,0.4)" : "#e8e6ff",
        borderRadius: "4px",
      }),
      multiValueLabel: (s) => ({
        ...s,
        color: theme === "dark" ? "#e6e4ff" : "#3a3285",
        fontSize: "12px",
      }),
      multiValueRemove: (s) => ({
        ...s,
        color: theme === "dark" ? "#e6e4ff" : "#3a3285",
        borderRadius: "0 4px 4px 0",
        "&:hover": {
          backgroundColor: "#3a3285",
          color: "white",
        },
      }),
      input: (s) => ({
        ...s,
        color: theme === "dark" ? "#e6e4ff" : "#333",
      }),
      placeholder: (s) => ({
        ...s,
        color: theme === "dark" ? "#6b7280" : "#9ca3af",
      }),
      singleValue: (s) => ({
        ...s,
        color: theme === "dark" ? "#e6e4ff" : "#333",
      }),
      dropdownIndicator: (s) => ({
        ...s,
        color: theme === "dark" ? "#6b7280" : "#9ca3af",
      }),
      clearIndicator: (s) => ({
        ...s,
        color: theme === "dark" ? "#6b7280" : "#9ca3af",
      }),
      indicatorSeparator: (s) => ({
        ...s,
        backgroundColor: theme === "dark" ? "#4a5568" : "#e2e8f0",
      }),
    }),
    [theme],
  );

  useEffect(() => {
    async function fetchOptions() {
      setLoading(true);
      try {
        const [labelsRes, statusesRes, agentsRes, sourcesRes] =
          await Promise.all([
            labelService.labels(),
            statusService.status(),
            chatAgentService.chatAgents(),
            sourceService.sources(),
          ]);
        setLabels(labelsRes?.data?.data ?? []);
        setStatuses(statusesRes?.data?.data ?? []);
        setChatAgents(agentsRes?.data?.data ?? []);
        setSources(sourcesRes?.data?.data?.sources ?? []);
      } catch (err) {
        console.error("Error fetching dropdown data", err);
        toast.error("Failed to fetch labels/statuses/agents");
      } finally {
        setLoading(false);
      }
    }
    fetchOptions();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSelectChange(name: keyof LeadForm, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit() {
    const labelIds = selectedLabels.map((l) => l.value);
    const parsed = LeadSchema.safeParse({ ...form, labels: labelIds });

    if (!parsed.success) {
      Swal.fire({
        icon: "warning",
        title: "Invalid input",
        text: parsed.error.issues[0]?.message ?? "Fix the highlighted fields",
        timer: 1200,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      return;
    }

    const property_id = safeGetPropertyId();
    if (!property_id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "User property ID missing",
        showConfirmButton: false,
        timer: 1200,
        timerProgressBar: true,
      });
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          ...parsed.data,
          labels: labelIds,
          email: (parsed.data.email ?? "").trim(),
          assigned_by: "",
          property_id,
          createdAt: selectedDate ? selectedDate.toISOString() : undefined,
        };

        await createLeadFromPlatform.createLeadFromPlatform(payload as any);

        Swal.fire({
          title: "Success",
          text: "Lead created successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        });

        setTimeout(() => {
          setForm({
            name: "",
            company_name: "",
            phone_number: "",
            email: "",
            address: "",
            comment: "",
            reference: "",
            labels: [],
            source: "",
            status: "",
            assigned_to: "",
            createdAt: "",
          });
          setSelectedDate(undefined);
          setSelectedLabels([]);
          closeModal();
        }, 1000);
      } catch (err: any) {
        const code = err?.status;
        const isPaywall = code === 400 || code === 403;

        if (isPaywall) {
          pushModal({
            type: "action",
            title: "Your Plan Has Expired",
            size: "lg",
            content: <PaywallUi />,
            customActions: (
              <>
                <Button variant="outline" onClick={closeModal}>
                  Not now
                </Button>
                <Button>See plans</Button>
              </>
            ),
          });
          return;
        }

        pushModal({
          type: "action",
          title: "Something went wrong",
          size: "sm",
          content: (
            <div className="p-2">
              <p className="text-sm opacity-80">
                Something went wrong while creating the lead.
              </p>
            </div>
          ),
          customActions: <Button onClick={closeModal}>Close</Button>,
        });
      }
    });
  }

  const disabled = isPending || loading;
  const labelOptions: LabelOption[] = labels.map((l) => ({
    value: l._id,
    label: l.title,
  }));

  return (
    <div className="space-y-6 min-h-[500px] h-[500px] overflow-auto px-6 pt-2 pb-4 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#444c6b] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#173b78] hover:[&::-webkit-scrollbar-thumb]:bg-[#2554a5]">
      <div className="grid grid-cols-3 gap-4">
        {/* Status */}
        <div>
          <label className="text-[12px] text-foreground block mb-2">
            Status
          </label>
          <Select
            value={form.status}
            onValueChange={(val) => handleSelectChange("status", val)}
            disabled={disabled}
          >
            <SelectTrigger className="w-full bg-primary text-foreground border border-gray-200 rounded dark:border-gray-700">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s._id} value={s._id}>
                  {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Source */}
        <div>
          <label className="text-[12px] text-foreground block mb-2">
            Source
          </label>
          <Select
            value={form.source}
            onValueChange={(val) => handleSelectChange("source", val)}
            disabled={disabled}
          >
            <SelectTrigger className="w-full bg-primary text-foreground border border-gray-200 rounded dark:border-gray-700">
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              {sources.map((s) => (
                <SelectItem key={s._id} value={s._id}>
                  {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* User */}
        <div>
          <label className="text-[12px] text-foreground block mb-2">User</label>
          <Select
            value={form.assigned_to}
            onValueChange={(val) => handleSelectChange("assigned_to", val)}
            disabled={disabled}
          >
            <SelectTrigger className="w-full bg-primary text-foreground border border-gray-200 rounded dark:border-gray-700">
              <SelectValue placeholder="Select agent" />
            </SelectTrigger>
            <SelectContent>
              {chatAgents.map((a) => (
                <SelectItem key={a._id} value={a._id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Phone */}
        <div>
          <label
            className="text-[12px] text-foreground block mb-2"
            htmlFor="phone_number"
          >
            Phone Number
          </label>
          <Input
            id="phone_number"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            placeholder="Phone Number"
            disabled={disabled}
            inputMode="tel"
          />
        </div>

        {/* Company */}
        <div>
          <label
            className="text-[12px] text-foreground block mb-2"
            htmlFor="company_name"
          >
            Company Name (optional)
          </label>
          <Input
            id="company_name"
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            placeholder="Company Name"
            disabled={disabled}
          />
        </div>

        {/* Date Picker */}
        <div>
          <label className="text-[12px] text-foreground block mb-2">
            Date <span className="text-gray-400">(Optional)</span>
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-primary border border-gray-200 dark:border-gray-700",
                  !selectedDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Full Name + Email */}
        <div className="col-span-3 grid grid-cols-2 gap-4">
          <div>
            <label
              className="text-[12px] mb-2 text-foreground block"
              htmlFor="name"
            >
              Full Name
            </label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              disabled={disabled}
            />
          </div>
          <div>
            <label
              className="text-[12px] text-foreground block mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              disabled={disabled}
              inputMode="email"
            />
          </div>
          <div>
            <label
              className="text-[12px] text-foreground block mb-2"
              htmlFor="reference"
            >
              Reference (Optional)
            </label>
            <Input
              id="reference"
              name="reference"
              value={form.reference}
              onChange={handleChange}
              placeholder="Reference"
              disabled={disabled}
            />
          </div>
        </div>

        {/* Labels - React Select */}
        <div className="col-span-3">
          <label className="text-[12px] text-foreground block mb-2">
            Labels
          </label>
          <ReactSelect<LabelOption, true>
            isMulti
            options={labelOptions}
            value={selectedLabels}
            onChange={(vals: MultiValue<LabelOption>) =>
              setSelectedLabels([...vals])
            }
            placeholder="Select labels..."
            isDisabled={disabled}
            styles={labelSelectStyles}
          />
        </div>

        {/* Address */}
        <div className="col-span-3">
          <label
            className="text-[12px] text-foreground block mb-2"
            htmlFor="address"
          >
            Address
          </label>
          <Input
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            disabled={disabled}
          />
        </div>

        {/* Comment */}
        <div className="col-span-3">
          <label
            className="text-[12px] text-foreground block mb-2"
            htmlFor="comment"
          >
            Comment
          </label>
          <Textarea
            id="comment"
            name="comment"
            value={form.comment}
            onChange={handleChange}
            placeholder="Comment"
            className="border-gray-200 rounded dark:border-gray-700"
            disabled={disabled}
          />
        </div>
      </div>

      <div className="bg-primary absolute bottom-0 left-0 w-full p-4">
        <Button
          variant="default"
          onClick={handleSubmit}
          className="w-full"
          disabled={disabled}
        >
          {isPending ? "Creating..." : "Create Lead"}
        </Button>
      </div>
    </div>
  );
}
