import { useEffect, useMemo, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner"; // lightweight toast; swap to your project's toast if different
import { createLeadFromPlatform } from "../../services/LeadsModule.service";
import { labelService } from "../../services/Lable.service"; // NOTE: if this is a typo, rename to Label.service
import { statusService } from "../../services/Status.service";
import {
  chatAgentService,
  type Agents,
} from "../../services/ChatAgents.service";
import { z } from "zod";
import { useModalStore } from "@/store/useModalStore";
import { X } from "lucide-react";
import Swal from "sweetalert2";

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
  labels: z.array(z.string()).optional().default([]),
});

export type LeadForm = z.infer<typeof LeadSchema>;

type Status = { _id: string; title: string };

type Label = { _id: string; title: string };

function safeGetPropertyId() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.property_id ?? null;
  } catch {
    return null;
  }
}

export default function CreateLeadModal() {
  const { closeModal } = useModalStore();
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
  });

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [labels, setLabels] = useState<Label[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [chatAgents, setChatAgents] = useState<Agents[]>([]);

  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false); // for initial dropdown loads

  // ---------- Fetch dropdown data ----------
  useEffect(() => {
    const ac = new AbortController();

    async function fetchOptions() {
      setLoading(true);
      try {
        const [labelsRes, statusesRes, agentsRes] = await Promise.all([
          labelService.labels(),
          statusService.status(),
          chatAgentService.chatAgents(),
        ]);

        setLabels(labelsRes?.data?.data ?? []);
        setStatuses(statusesRes?.data?.data ?? []);
        setChatAgents(agentsRes?.data?.data ?? []);
      } catch (err) {
        console.error("Error fetching dropdown data", err);
        toast.error("Failed to fetch labels/statuses/agents");
      } finally {
        setLoading(false);
      }
    }

    fetchOptions();
    return () => ac.abort();
  }, []);

  // ---------- Form helpers ----------
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSelectChange(name: keyof LeadForm, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const [search, setSearch] = useState("");
  const filteredLabels = useMemo(() => {
    const q = search.toLowerCase();
    return labels.filter((l) => l.title.toLowerCase().includes(q));
  }, [labels, search]);

  function toggleLabel(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // ---------- Submit ----------
  async function handleSubmit() {
    // validate with zod
    const parsed = LeadSchema.safeParse({
      ...form,
      labels: Array.from(selected),
    });
    if (!parsed.success) {
      const first = parsed.error.issues[0];

      Swal.fire({
        icon: "warning",
        title: "Invalid input",
        text: first?.message ?? "Fix the highlighted fields",
        timer: 1200,
        showConfirmButton: false,
      });

      return;
    }

    const property_id = safeGetPropertyId();
    if (!property_id) {
      Swal.fire("Error", "User property ID missing", "error");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          ...parsed.data,
          labels: Array.from(selected),
          email: (parsed.data.email ?? "").trim(), // ← ensure string
          assigned_by: "",
          property_id,
        };

        await createLeadFromPlatform.createLeadFromPlatform(payload);
        await Swal.fire("Success", "Lead created successfully", "success");

        // reset
        setForm({
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
        });
        setSelected(new Set());
        setSearch("");
        closeModal();
      } catch (err) {
        console.error("Create lead failed", err);
        const message =
          (err as any)?.response?.data?.message || "Failed to create lead";
        Swal.fire({
          icon: "error",
          title: "Error",
          text: message,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  }

  const disabled = isPending || loading;

  return (
    <div className="space-y-6 min-h-[500px] h-[500px] overflow-auto px-6 pt-20 pb-20 [&::-webkit-scrollbar]:w-[4px]  [&::-webkit-scrollbar-track]:rounded-full  [&::-webkit-scrollbar-track]:bg-[#444c6b] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#173b78] hover:[&::-webkit-scrollbar-thumb]:bg-[#2554a5]">
      <h2 className="text-lg font-semibold text-foreground absolute top-0 left-0 w-full bg-primary p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        Create New Lead
        <button onClick={() => closeModal()}>
          <X />
        </button>
      </h2>

      <div className="grid grid-cols-2 gap-4">
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
            aria-invalid={!form.name}
          />
        </div>

        <div>
          <label
            className="text-[12px] text-foreground block mb-2"
            htmlFor="company_name"
          >
            Company Name
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
              {statuses.map((status) => (
                <SelectItem key={status._id} value={status._id}>
                  {status.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-[12px] text-foreground block mb-2">
            Assign Lead To
          </label>
          <Select
            value={form.assigned_to}
            onValueChange={(val) => handleSelectChange("assigned_to", val)}
            disabled={disabled}
          >
            <SelectTrigger className="w-full bg-primary text-foreground border border-gray-200 rounded dark:border-gray-700">
              <SelectValue placeholder="Select agent" />
            </SelectTrigger>
            <SelectContent>
              {chatAgents.map((agent) => (
                <SelectItem key={agent._id} value={agent._id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label
            className="text-[12px] text-foreground block mb-2"
            htmlFor="reference"
          >
            Reference
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

        <div className="col-span-2">
          <label className="text-[12px] text-foreground block mb-2">
            Labels
          </label>
          <div className="bg-primary border border-primary rounded p-2">
            <Input
              placeholder="Search labels..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full mb-2"
              disabled={disabled}
            />
            <ul className="max-h-[120px] overflow-y-auto space-y-2">
              {filteredLabels.map((label) => (
                <li key={label._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`label-${label._id}`}
                    checked={selected.has(label._id)}
                    onChange={() => toggleLabel(label._id)}
                    disabled={disabled}
                  />
                  <label
                    htmlFor={`label-${label._id}`}
                    className="text-sm text-foreground"
                  >
                    {label.title}
                  </label>
                </li>
              ))}
              {filteredLabels.length === 0 && (
                <li className="text-xs opacity-70 px-1">
                  No labels match your search
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="col-span-2">
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

        <div className="col-span-2">
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
