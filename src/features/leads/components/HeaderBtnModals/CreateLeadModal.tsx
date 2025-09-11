import { useEffect, useState } from "react";
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
import Swal from "sweetalert2";
import { createLeadFromPlatform } from "../../services/LeadsModule.service";
import { labelService } from "../../services/Lable.service";
import { statusService } from "../../services/Status.service";
import {
  chatAgentService,
  type Agents,
} from "../../services/ChatAgents.service";

function CreateLeadModal() {
  const [form, setForm] = useState({
    name: "",
    company_name: "",
    phone_number: "",
    email: "",
    address: "",
    comment: "",
    reference: "",
    labels: [] as string[],
    status: "",
    assigned_to: "",
  });
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [labels, setLabels] = useState<{ _id: string; title: string }[]>([]);
  const [statuses, setStatuses] = useState<{ _id: string; title: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [chatAgents, setChatAgents] = useState<Agents[]>([]);
  const [isSubmitting] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const labelsResponse = await labelService.labels();
        setLabels(labelsResponse.data.data);

        const statusesResponse = await statusService.status();
        setStatuses(statusesResponse.data.data);

        const agentsResponse = await chatAgentService.chatAgents();
        setChatAgents(agentsResponse.data.data);
      } catch (err) {
        console.error("Error fetching dropdown data", err);
        Swal.fire("Error", "Failed to fetch labels or statuses", "error");
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const [search, setSearch] = useState("");
  const toggleLabel = (id: string) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Info",
        text: "Please enter a name.",
        timer: 1000,
        showConfirmButton: false,
      });
      return;
    }
    if (!form.phone_number.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Info",
        text: "Phone number is required.",
        timer: 1000,
        showConfirmButton: false,
      });
      return;
    }
    if (!form.status) {
      Swal.fire({
        icon: "warning",
        title: "Missing Info",
        text: "Select a status.",
        timer: 1000,
        showConfirmButton: false,
      });
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Email",
        text: "Please provide a valid email.",
        timer: 1000,
        showConfirmButton: false,
      });
      return;
    }
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const property_id = user?.property_id;
      if (!property_id) {
        Swal.fire("Error", "User property ID missing!", "error");
        return;
      }

      const payload = {
        ...form,
        labels: Array.from(selected),
        assigned_by: "",
        property_id,
      };

      await createLeadFromPlatform.createLeadFromPlatform(payload);
      Swal.fire("Success", "Lead created successfully!", "success");
      // Optional: reset form
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
    } catch (err) {
      console.error("Create lead failed", err);
      Swal.fire("Error", "Failed to create lead", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 min-h-[500px] h-[500px] overflow-auto px-6 pt-20 pb-20 [&::-webkit-scrollbar]:w-[4px]  [&::-webkit-scrollbar-track]:rounded-full  [&::-webkit-scrollbar-track]:bg-[#444c6b] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#173b78] hover:[&::-webkit-scrollbar-thumb]:bg-[#2554a5]">
      <h2 className="text-lg font-semibold text-white absolute top-0 left-0 w-full bg-card p-4 border-b border-gray-400">
        Create New Lead
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="">
          <label className="text-[12px] mb-2 text-white block">Full Name</label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
          />
        </div>

        <div>
          <label className="text-[12px] text-white block mb-2">
            Company Name
          </label>
          <Input
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            placeholder="Company Name"
          />
        </div>

        <div>
          <label className="text-[12px] text-white block mb-2">
            Phone Number
          </label>
          <Input
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            placeholder="Phone Number"
          />
        </div>

        <div>
          <label className="text-[12px] text-white block mb-2">Email</label>
          <Input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />
        </div>

        <div>
          <label className="text-[12px] text-white block mb-2">Status</label>
          <Select
            value={form.status}
            onValueChange={(val) => handleSelectChange("status", val)}
          >
            <SelectTrigger className="w-full bg-[#2f3658] text-white border border-[#444c6b]">
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
          <label className="text-[12px] text-white block mb-2">
            Assign Lead To
          </label>
          <Select
            value={form.assigned_to}
            onValueChange={(val) => handleSelectChange("assigned_to", val)}
          >
            <SelectTrigger className="w-full bg-[#2f3658] text-white border border-[#444c6b]">
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
          <label className="text-[12px] text-white block mb-2">Reference</label>
          <Input
            name="reference"
            value={form.reference}
            onChange={handleChange}
            placeholder="Reference"
          />
        </div>

        <div className="col-span-2">
          <label className="text-[12px] text-white block mb-2">Labels</label>
          <div className="bg-[#2f3658] border border-[#444c6b] rounded p-2">
            <Input
              placeholder="Search labels..."
              disabled={isSubmitting}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full mb-2"
            />
            <ul className="max-h-[120px] overflow-y-auto space-y-2">
              {labels
                .filter((label) =>
                  label.title.toLowerCase().includes(search.toLowerCase())
                )
                .map((label) => (
                  <li key={label._id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={label._id}
                      checked={selected.has(label._id)}
                      onChange={() => toggleLabel(label._id)}
                      disabled={isSubmitting}
                    />
                    <label htmlFor={label._id} className="text-sm text-white">
                      {label.title}
                    </label>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="col-span-2">
          <label className="text-[12px] text-white block mb-2">Address</label>
          <Input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
          />
        </div>

        <div className="col-span-2">
          <label className="text-[12px] text-white block mb-2">Comment</label>
          <Textarea
            name="comment"
            value={form.comment}
            onChange={handleChange}
            placeholder="Comment"
          />
        </div>
      </div>

      <div className="bg-card absolute bottom-0 left-0 w-full p-4 ">
        <Button
          variant={"default"}
          onClick={handleSubmit}
          className="w-full text-white"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Lead"}
        </Button>
      </div>
    </div>
  );
}

export default CreateLeadModal;
