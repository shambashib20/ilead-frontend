import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useModalStore } from "@/store/useModalStore";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { useDeleteLead } from "../../hooks/useDeleteLeads";

// import { useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChatAgents } from "../../hooks/useChatAgents";
import { Input } from "@/components/ui/input";
import {
  Info,
  Send,
  Tag,
  Trash,
  TrendingUp,
  UserPlus,
  CalendarIcon,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isEqual,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LeadsModule } from "../../services/LeadsModule.service";
import { LabelService } from "../../services/Lable.service";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { CustomerModule } from "../../services/Customer.service";
import type { AxiosResponse } from "axios";
import { StatusService } from "../../services/Status.service";

import { FileUploader } from "@/components/MediaUploader/FileUploader";
import { AudioRecorderUploader } from "@/components/MediaUploader/AudioRecorderUploader";

import "react-datepicker/dist/react-datepicker.css";
import Loader from "@/components/MainLoader/Loader";
import { motion } from "framer-motion";
import { useStatus } from "../../hooks/useStatus";
import { useLabels } from "@/features/labels/hooks/useLables";
import { useSource } from "../../hooks/useSource";
import { useImportLeads } from "../../hooks/useImportLeads";
import { useTheme } from "@/contexts/ThemeProvider";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch";

const leadsApi = new LeadsModule();
const labelApi = new LabelService();

const statusApi = new StatusService();

const MySwal = withReactContent(Swal);
const customerModule = new CustomerModule();
export interface LabelItem {
  _id: string;
  title: string;
}

export interface StatusItem {
  _id: string;
  title: string;
}

export interface LabelResponse {
  data: LabelItem[]; // This must be an array
}

export interface StatusResponse {
  data: StatusItem[]; // This must be an array
}

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em className="text-red-500 text-sm">
          {field.state.meta.errors.join(",")}
        </em>
      ) : null}
      {field.state.meta.isValidating ? (
        <span className="text-blue-500 text-sm">Validating...</span>
      ) : null}
    </>
  );
}

export function LeadDelete() {
  const { setFormActions, data, closeModal } = useModalStore();
  const { deleteLead, isDeleting, isSuccess, error } = useDeleteLead();
  const rayId = data?.rayId;
  const form = useForm({
    defaultValues: {
      reason: "",
    },
    onSubmit: async ({ value }) => {
      deleteLead({
        rayId,
        deleteReason: value.reason,
      });
      console.log("Deleting lead with reason:", {
        reason: value.reason,
        rayId: data,
      });
    },
  });

  // Close modal when deletion is successful
  useEffect(() => {
    if (isSuccess) {
      closeModal();
    }
  }, [isSuccess, closeModal]);

  // Expose form actions to modal
  useEffect(() => {
    setFormActions?.({
      onSubmit: () => form.handleSubmit(),
      onCancel: () => form.reset(),
      canSubmit: form.state.canSubmit && !isDeleting, // Disable when deleting
      isSubmitting: isDeleting, // Use mutation loading state
    });

    const unsubscribe = form.store.subscribe(() => {
      setFormActions?.({
        onSubmit: () => form.handleSubmit(),
        onCancel: () => form.reset(),
        canSubmit: form.state.canSubmit && !isDeleting,
        isSubmitting: isDeleting,
      });
    });

    return unsubscribe;
  }, [form, setFormActions, isDeleting]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="space-y-4 px-5">
        <form.Field
          name="reason"
          validators={{
            onChange: ({ value }) =>
              !value ? "Please provide a reason for deletion" : undefined,
          }}
        >
          {(field) => (
            <div className="flex flex-col gap-3">
              <Label htmlFor={field.name}>Delete Reason:</Label>
              <Textarea
                placeholder="Enter Delete Reason"
                className="w-full bg-white"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isDeleting}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>

        {/* Show error if deletion fails */}
        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">
            <strong>Error:</strong>{" "}
            {error.message || "Failed to delete lead. Please try again."}
          </div>
        )}

        {/* Show loading state */}
        {isDeleting && (
          <div className="text-blue-500 text-sm bg-blue-50 p-3 rounded-md border border-blue-200">
            <strong>Deleting lead...</strong> Please wait while we process your
            request.
          </div>
        )}

        <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-md border border-yellow-200">
          <strong>Warning:</strong> This action cannot be undone. The lead will
          be permanently deleted.
        </div>
      </div>
    </form>
  );
}

export function LeadLabels() {
  const { data, closeModal } = useModalStore();
  const leadId = data?._id;
  const [search, setSearch] = useState("");

  const [labels, setLabels] = useState<LabelItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLabels() {
      try {
        setIsLoading(true);
        const res = (await labelApi.labels()) as AxiosResponse<LabelResponse>;
        const cleanedLabels = res.data.data.map((label) => ({
          _id: label._id,
          title: label.title,
        }));
        setLabels(cleanedLabels);
      } catch (err) {
        setError("Failed to load labels");
      } finally {
        setIsLoading(false);
      }
    }

    fetchLabels();
  }, []);

  const toggleLabel = (id: string) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const assignLabels = async () => {
    if (!leadId || selected.size === 0) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await leadsApi.assignLabelToLead({
        leadId,
        labelIds: Array.from(selected),
      });
      closeModal(); // close on success
    } catch (err) {
      setError("Failed to assign labels. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const filteredLabels = labels.filter((label) =>
    label.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 px-5 pt-2">
      <Input
        placeholder="Search labels..."
        disabled={isSubmitting}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
      />
      <div
        className="min-h-[200px] max-h-[150px] overflow-y-auto mt-3 space-y-2 [&::-webkit-scrollbar]:w-1.5 
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:transparent
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:transparent"
      >
        {isLoading ? (
          <Loader />
        ) : filteredLabels.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-500 text-sm"
          >
            No labels found
          </motion.div>
        ) : (
          <ul className="space-y-2">
            {filteredLabels.map((label) => (
              <li key={label._id}>
                <div
                  onClick={() => toggleLabel(label._id)}
                  className={`flex items-center justify-between cursor-pointer rounded-md px-3 py-2
                    transition-colors
                    ${
                      selected.has(label._id)
                        ? "bg-indigo-600 text-white"
                        : "bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white"
                    }
                    hover:bg-indigo-500 hover:text-white`}
                >
                  <span className="text-sm">{label.title}</span>
                  {/* Optional: hidden checkbox for accessibility */}
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selected.has(label._id)}
                    readOnly
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}

      <Button
        className=" w-full"
        disabled={isSubmitting || selected.size === 0}
        onClick={assignLabels}
      >
        {isSubmitting ? "Assigning..." : "Assign Labels"}
      </Button>
    </div>
  );
}

export function LeadAssign() {
  const { agents } = useChatAgents();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const { data, closeModal, setFormActions, setSubmitLabel } = useModalStore();

  const handleAssign = async () => {
    if (!selectedAgentId) {
      Swal.fire("Error", "Please select an agent.", "error");
      return;
    }

    try {
      const payload = {
        leadId: data._id,
        chatAgentId: selectedAgentId,
      };

      await leadsApi.assignLeadTo(payload);

      Swal.fire("Success", "Lead assigned successfully.", "success");
      closeModal?.();
    } catch (error: any) {
      Swal.fire("Error", error?.message || "Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Setup modal form actions
  useEffect(() => {
    setSubmitLabel?.("Assign");
    setFormActions?.({
      onSubmit: handleAssign,
      onCancel: () => closeModal?.(),
      canSubmit: !!selectedAgentId,
      isSubmitting,
    });
  }, [selectedAgentId, isSubmitting]);

  return (
    <div className="space-y-4 px-5 pt-2">
      <div>
        <Label htmlFor="user">User:</Label>
        <Select onValueChange={(value) => setSelectedAgentId(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose Agent to assign" />
          </SelectTrigger>
          <SelectContent>
            {agents.data.map((agent) => (
              <SelectItem key={agent._id} value={agent._id}>
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function LeadCreateCustomer() {
  const { closeModal, data } = useModalStore();
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!data?._id) {
      await MySwal.fire({
        icon: "error",
        title: "Missing Lead ID",
        text: "Unable to convert. Lead ID is required.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await customerModule.convertToCustomer({ leadId: data._id });

      await MySwal.fire({
        icon: "success",
        title: "Conversion Successful",
        text: res.message,
        timer: 2000,
        showConfirmButton: false,
      });

      closeModal();
    } catch (error) {
      console.error("Conversion error:", error);
      await MySwal.fire({
        icon: "error",
        title: "Conversion Failed",
        text: "Could not convert the lead to a customer.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 py-8">
      <div className="flex items-center justify-center">
        <Info className="text-orange-300" size={90} strokeWidth={1} />
      </div>
      <h3 className="text-2xl text-center px-3 font-semibold text-foreground mx-auto">
        Are You Sure You Want To Convert This Lead To Customer?
      </h3>
      <ul className="flex items-center justify-center gap-4">
        <li>
          <Button onClick={handleConvert} disabled={loading}>
            {loading ? "Converting..." : "Yes Convert"}
          </Button>
        </li>
        <li>
          <Button variant="destructive" onClick={closeModal}>
            Cancel
          </Button>
        </li>
      </ul>
    </div>
  );
}
export function LeadFollowUp() {
  const { data, closeModal, setFormActions, setSubmitLabel } = useModalStore();
  const leadId = data?._id;

  const [comment, setComment] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [attachmentUrl, setAttachmentUrl] = useState<string | undefined>();
  const [audioAttachmentUrl, setAudioAttachmentUrl] = useState<
    string | undefined
  >();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment || !selectedDate || !selectedTime) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    }

    const [hours, minutes] = selectedTime.split(":");
    const followUpDate = new Date(selectedDate);
    followUpDate.setHours(Number(hours), Number(minutes));

    setIsSubmitting(true);
    try {
      await leadsApi.createNewFollowup({
        leadId,
        comment,
        nextFollowUp: followUpDate.toISOString(),
        attachmentUrl,
        audioAttachmentUrl,
      });

      console.warn("payload", {
        leadId,
        comment,
        nextFollowUp: followUpDate.toISOString(),
        attachmentUrl,
        audioAttachmentUrl,
      });

      Swal.fire("Success", "Follow-up added successfully", "success");
      closeModal();
    } catch (error: any) {
      Swal.fire("Error", error.message || "Failed to add follow-up", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setSubmitLabel?.("Add Follow Up");
  }, []);

  useEffect(() => {
    setFormActions?.({
      onSubmit: handleSubmit,
      onCancel: () => closeModal(),
      canSubmit: !!comment && !!selectedDate && !!selectedTime,
      isSubmitting,
    });
  }, [
    comment,
    selectedDate,
    selectedTime,
    isSubmitting,
    attachmentUrl,
    audioAttachmentUrl,
  ]);

  return (
    <div className="space-y-4 px-5 pt-2">
      <div>
        <label className="text-sm text-foreground block mb-2">
          Next Follow-Up Date:
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal bg-primary  border-gray-500 text-foreground hover:bg-zinc-800",
                !selectedDate && "text-muted-foreground"
              )}
              disabled={isSubmitting}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-primary text-foreground border border-gray-600">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Input
          type="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          disabled={isSubmitting}
          className="mt-2 w-full"
        />
      </div>
      <div>
        <label className="text-sm text-foreground block mb-2">Comment:</label>
        <Textarea
          placeholder="Enter your follow-up comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isSubmitting}
          className="w-full"
        />
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="text-sm text-foreground block mb-2">
            Upload File:
          </label>
          <FileUploader
            onUploadSuccess={setAttachmentUrl}
            disabled={isSubmitting}
          />
        </div>

        <div className="w-1/2">
          <label className="text-sm text-foreground block mb-2">
            Record Audio:
          </label>
          <AudioRecorderUploader
            onUploadSuccess={setAudioAttachmentUrl}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

export function LeadStatus() {
  const { data, closeModal } = useModalStore();
  const leadId = data?._id;
  const [search, setSearch] = useState("");

  const [statuses, setStatuses] = useState<StatusItem[]>([]);
  const [selectedStatusId, setSelectedStatusId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredStatuses = statuses.filter((status) =>
    status.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    async function fetchStatuses() {
      try {
        setIsLoading(true);
        const res =
          (await statusApi.status()) as unknown as AxiosResponse<StatusResponse>;
        setStatuses(res.data.data);
      } catch (err) {
        setError("Failed to load statuses");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStatuses();
  }, []);

  const assignStatus = async () => {
    if (!leadId || !selectedStatusId) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await leadsApi.updateLeadStatus({
        leadId,
        statusId: selectedStatusId,
      });
      closeModal(); // close on success
    } catch (err) {
      setError("Failed to update status. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 px-5 pt-2">
      <Input
        placeholder="Search status..."
        disabled={isSubmitting}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
      />

      <div className="min-h-[200px] max-h-[150px] overflow-y-auto mt-3 space-y-2">
        {isLoading ? (
          <Loader />
        ) : filteredStatuses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-500 text-sm"
          >
            No statuses found
          </motion.div>
        ) : (
          <ul className="space-y-2">
            {filteredStatuses.map((status) => (
              <li key={status._id} className="flex items-center gap-2">
                <input
                  type="radio"
                  id={status._id}
                  name="status"
                  checked={selectedStatusId === status._id}
                  onChange={() => setSelectedStatusId(status._id)}
                  disabled={isSubmitting}
                />
                <label htmlFor={status._id} className="text-sm">
                  {status.title}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <Button
        className="w-full"
        disabled={isSubmitting || !selectedStatusId}
        onClick={assignStatus}
      >
        {isSubmitting ? "Updating..." : "Update Status"}
      </Button>
    </div>
  );
}

const CARD_ACTIONS = [
  {
    icon: Trash,
    color: "red",
    dark: "white",
    label: "Delete Lead",
    title: "Delete Lead",
    el: <LeadDelete />,
    type: "form" as const,
    customActions: undefined,
  },
  {
    icon: Tag,
    color: "green",
    dark: "White",
    label: "Lead Label Assign",
    title: "Lead Label Assign",
    el: <LeadLabels />,
    type: "action" as const,
    customActions: undefined,
  },
  {
    icon: TrendingUp,
    color: "yellow",
    dark: "White",
    label: "Lead Assignment",
    title: "Change Lead Assign To",
    el: <LeadAssign />,
    type: "form",
    customActions: undefined,
  },
  {
    icon: UserPlus,
    color: "pink",
    dark: "White",
    label: "Convert Lead to Customer",
    title: null,
    el: <LeadCreateCustomer />,
    type: "info" as const,
    customActions: undefined,
  },
  {
    icon: RefreshCw,
    color: "orange",
    dark: "White",
    label: "Change Lead Status",
    title: "Change Lead Status",
    el: <LeadStatus />,
    type: "action" as const,
    customActions: undefined,
  },
  {
    icon: Send,
    color: "white",
    dark: "White",
    label: "Lead Follow Up",
    title: "Add Lead Follow Up",
    el: <LeadFollowUp />,
    type: "form" as const,
    customActions: undefined,
  },
] as const;

export function LeadDetail() {
  const { data, setModalTitle, openModal, setData, setModalSize } =
    useModalStore();
  const { theme } = useTheme();
  const leadId = data?._id;
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!leadId) return;

    const fetchLeadInfo = async () => {
      try {
        const response = await leadsApi.getLeadInfo({ leadId });
        setLead(response.data);
      } catch (error) {
        console.error("Failed to fetch lead info", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadInfo();
  }, [leadId]);

  if (loading) {
    return (
      <div className="p-4 text-center text-white">
        <Loader />
      </div>
    );
  }

  if (!lead) {
    return <div className="p-4 text-center text-red-500">Lead not found.</div>;
  }

  // Extract fields

  return (
    <div className="min-h-[400px] max-h-[450px] overflow-y-auto px-3 ">
      {/* Top Action Icons (static for now) */}
      <ul className="flex items-center justify-center gap-6">
        {CARD_ACTIONS.map(
          ({
            icon: Icon,
            color,
            dark,
            label,
            el,
            type,
            customActions,
            title,
          }) => (
            <button
              key={label}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors cursor-pointer"
              title={label}
              onClick={() => {
                setModalTitle?.(title);
                setModalSize?.("sm");
                setData?.({
                  _id: lead._id,
                  rayId: lead.meta?.ray_id,
                });
                openModal({
                  content: el,
                  type,
                  customActions,
                });
              }}
            >
              <div className="relative">
                <Icon size={24} color={theme !== "dark" ? color : dark} />
                {label === "Lead Follow Up" && (
                  <span className="absolute -top-1 -right-1 bg-gray-300 dark:bg-gray-800 text-black dark:text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                    {lead.follow_ups?.length ?? 0}
                  </span>
                )}
              </div>
            </button>
          )
        )}
      </ul>

      {/* Tabs */}
      <Tabs defaultValue="details" className="mt-4">
        <TabsList className="flex flex-wrap gap-2 p-1 w-[700px] mx-auto ">
          <TabsTrigger value="details">
            Details{" "}
            <span className="bg-pink-600 text-white h-5 w-5 rounded-full inline-flex items-center justify-center">
              0
            </span>
          </TabsTrigger>
          <TabsTrigger value="followup">
            Follow Up{" "}
            <span className="bg-pink-600 text-white h-5 w-5 rounded-full inline-flex items-center justify-center">
              {lead.data.follow_ups?.length || 0}
            </span>
          </TabsTrigger>
          <TabsTrigger value="history">
            History{" "}
            <span className="bg-pink-600 text-white h-5 w-5 rounded-full inline-flex items-center justify-center">
              {lead.data.logs?.length || 0}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="shadow-sm dark:border rounded-sm overflow-auto">
              <h3 className="font-semibold text-white mb-2 bg-[#3a3285]  p-4 text-center">
                Lead Information
              </h3>
              <div className="p-4">
                <p className="text-sm text-foreground mb-2 py-2 border-b border-gray-300 dark:border-gray-700 flex flex-col gap-1">
                  <b className="flex flex-col gap-1">Name:</b> {lead.data.name}
                </p>
                <p className="text-sm text-foreground mb-2 py-2 border-b border-gray-300 dark:border-gray-700 flex flex-col">
                  <b className="flex flex-col gap-1">Company:</b>{" "}
                  {lead.data.company_name || "-"}
                </p>
                <p className="text-sm text-foreground mb-2 py-2 border-b border-gray-300 dark:border-gray-700 flex flex-col">
                  <b className="flex flex-col gap-1">Phone:</b>{" "}
                  {lead.data.phone_number}
                </p>
                <p className="text-sm text-foreground mb-2 py-2 border-b border-gray-300 dark:border-gray-700 flex flex-col">
                  <b className="flex flex-col gap-1">Whatsapp:</b>{" "}
                  {lead.data.meta.whatsapp || "-"}
                </p>
                <p className="text-sm text-foreground mb-2 py-2 border-b border-gray-300 dark:border-gray-700 flex flex-col">
                  <b className="flex flex-col gap-1">Email:</b>{" "}
                  {lead.data.email || "-"}
                </p>
                <p className="text-sm text-foreground mb-2 py-2 border-b border-gray-300 dark:border-gray-700 flex flex-col">
                  <b className="flex flex-col gap-1">Address:</b>{" "}
                  {lead.data.address || "-"}
                </p>

                <p className="text-sm text-foreground mb-2 py-2 border-b border-gray-300 dark:border-gray-700 flex flex-col">
                  <b className="flex flex-col gap-1">Comment:</b>{" "}
                  {lead.data.comment || "-"}
                </p>
                <p className="text-sm text-foreground mb-2 py-2 border-b border-gray-300 dark:border-gray-700 flex flex-col">
                  <b className="flex flex-col gap-1">Reference:</b>{" "}
                  {lead.data.reference || "-"}
                </p>

                <p className="text-sm text-foreground mb-2 py-2 border-b border-gray-300 dark:border-gray-700 flex flex-col">
                  <b className="flex flex-col gap-1">Course selected:</b>{" "}
                  {lead.data.meta.course || "-"}
                </p>
                <p className="text-sm text-foreground mb-2 py-2 border-b border-gray-300 dark:border-gray-700 flex flex-col">
                  <b>Stream Selected:</b> {lead.data.meta.stream || "-"}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="shadow-sm dark:border rounded-sm overflow-auto">
              <h3 className="font-semibold text-white mb-2 bg-[#3a3285]  p-4 text-center">
                General Information
              </h3>
              <div className="p-4">
                <p className="text-sm text-foreground mb-2 py-2 border-b border-gray-300 dark:border-gray-700 flex flex-col gap-1">
                  <b>Date:</b> {new Date(lead.data.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-foreground mb-2 py-2 border-b border-gray-300 dark:border-gray-700 flex flex-col gap-1">
                  <b>Status:</b> {lead.data.status.title || "N/A"}
                </p>
                <p className="text-sm text-foreground mb-2 py-2 border-b border-gray-300 dark:border-gray-700 flex flex-col gap-1">
                  <b>Source:</b> {lead?.data?.meta?.source?.title || "N/A"}
                </p>
                <p className="text-sm text-foreground mb-2 py-2 border-b border-gray-300 dark:border-gray-700 flex flex-col gap-1">
                  <b>Labels:</b>{" "}
                  <div className="flex gap-2 flex-wrap mt-1">
                    {lead.data.labels.length > 0
                      ? lead.data.labels.map((lbl: any) => (
                          <span
                            key={lbl._id}
                            className="bg-[#3a3285] px-2 py-1 rounded text-xs text-white "
                          >
                            {lbl.title}
                          </span>
                        ))
                      : "-"}
                  </div>
                </p>
                <p className="text-sm text-foreground mb-2 py-2 border-b border-gray-300 dark:border-gray-700 flex flex-col gap-1">
                  <b>Created By:</b> {lead.data.assigned_by?.name || ""}
                </p>
                <p className="text-sm text-foreground mb-2 py-2 border-b border-gray-300 dark:border-gray-700 flex flex-col gap-1">
                  <b>Assign To:</b> {lead.data.assigned_to?.name || "N/A"}
                </p>
              </div>
            </div>

            {/* <div className="border border-gray-700 rounded">
              <h3 className="font-semibold text-white mb-2 bg-[#3a3285] p-4 text-center">
                Lead Meta Data
              </h3>
              <div className="p-4">
                <p className="text-sm text-foreground mb-2">
                  <b>Enriched Location (City):</b>{" "}
                  {lead.data.meta.location.city}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Enriched Location (Country):</b>{" "}
                  {lead.data.meta.location.country}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Enriched Location (Detailed Address):</b>{" "}
                  {lead.data.meta.location.detailed_lead_address}
                </p>

                <p className="text-sm text-gray-300 mb-2">
                  <b>Enriched Location (Region of Origin):</b>{" "}
                  {lead.data.meta.location.region}
                </p>
              </div>
            </div> */}
          </div>
        </TabsContent>

        {/* Other tabs placeholder */}
        <TabsContent value="followup" className="mt-4">
          {lead.data.follow_ups && lead.data.follow_ups.length > 0 ? (
            <div className="space-y-4">
              {lead.data.follow_ups
                .sort(
                  (a: any, b: any) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((followup: any, index: number) => (
                  <details
                    key={followup._id || index}
                    className="border border-gray-700 rounded bg-[#1f1f2f] text-white"
                  >
                    <summary className="cursor-pointer px-4 py-2 hover:bg-gray-800 transition-all font-medium flex justify-between items-center">
                      <span>{lead.data.assigned_to.name}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(followup.createdAt).toLocaleString()}
                      </span>
                    </summary>
                    <div className="px-4 py-3 space-y-2">
                      <div>
                        <b className="text-gray-300">Next Follow-Up:</b>{" "}
                        <span className="text-sm text-gray-400">
                          {new Date(
                            followup.next_followup_date
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <b className="text-gray-300">Comment:</b>{" "}
                        <p className="text-sm text-gray-200">
                          {followup.comment}
                        </p>
                      </div>

                      {followup.meta?.attachment_url && (
                        <div>
                          <b className="text-gray-300">Attachment:</b>{" "}
                          <a
                            href={followup.meta.attachment_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline text-sm"
                          >
                            View File
                          </a>
                        </div>
                      )}

                      {followup.meta?.audio_attachment_url && (
                        <div>
                          <b className="text-gray-300">Audio:</b>
                          <audio
                            controls
                            preload="metadata"
                            className="mt-1 w-full rounded"
                          >
                            <source
                              src={followup.meta.audio_attachment_url}
                              type="audio/webm"
                            />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}
                    </div>
                  </details>
                ))}
            </div>
          ) : (
            <p className="text-white text-center">No follow-ups available.</p>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          {lead.data.logs && lead.data.logs.length > 0 ? (
            <ul className="space-y-4">
              {[...lead.data.logs]
                .sort(
                  (a: any, b: any) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((log: any, index: number) => (
                  <li
                    key={log._id || index}
                    className="border border-gray-700 rounded p-4 bg-[#1f1f2f] text-white"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-base">{log.title}</h4>
                      <span className="text-xs text-gray-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{log.description}</p>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-white text-center">No history available.</p>
          )}
        </TabsContent>

        {/* <TabsContent value="task" className="mt-4">
          <p>No tasks assigned.</p>
        </TabsContent>
        <TabsContent value="reminder" className="mt-4">
          <p>No reminders set.</p>
        </TabsContent>
        <TabsContent value="meeting" className="mt-4">
          <p>No meetings scheduled.</p>
        </TabsContent>
        <TabsContent value="quotation" className="mt-4">
          <p>No quotations generated.</p>
        </TabsContent>
        <TabsContent value="invoice" className="mt-4">
          <p>No invoices available.</p>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}

// interface ImportLeadFormData {
//   status: string;
//   source: string;
//   user: string;
//   label: string;
//   date: string;
//   file: File | null;
//   emailAutomation: boolean;
//   whatsappAutomation: boolean;
//   removeDuplicateRecord: boolean;
// }

export function ImportLeadForm() {
  const [fileName, setFileName] = useState<string>("No file chosen");
  const { setFormActions } = useModalStore();

  const { status } = useStatus();
  const { labels } = useLabels();
  const { sources } = useSource();
  const { agents } = useChatAgents();

  const { importLeadsAsync, isPending } = useImportLeads();

  const form = useForm({
    defaultValues: {
      status: "",
      source: "",
      user: "",
      label: "",
      date: "2025-09-17",
      file: null as File | null,
      emailAutomation: false,
      whatsappAutomation: false,
      removeDuplicateRecord: false,
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted:", value);
      // Handle form submission here
      await importLeadsAsync({
        assigned_to: value?.user,
        file: value?.file ?? null,
        label_ids: value?.label,
        source_id: value?.source,
        status_id: value?.status,
      });
      form.reset();
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      form.setFieldValue("file", file);
    } else {
      setFileName("No file chosen");
      form.setFieldValue("file", null);
    }
  };

  // const handleDownloadFormat = () => {
  //   // Handle download format logic
  //   console.log("Download format clicked");
  // };

  useEffect(() => {
    setFormActions?.({
      onSubmit: () => form.handleSubmit(),
      onCancel: () => form.reset(),
      canSubmit: form.state.canSubmit,
      isSubmitting: isPending,
    });
    useModalStore.getState().setSubmitLabel?.("Assign");
  }, [form.state.canSubmit, isPending]);

  return (
    <div className="w-[full] max-w-[800px]  mx-auto bg-primary">
      <div className="px-4  space-y-4">
        {/* Download Format Button */}
        <Button asChild className="bg-[#3a3285]">
          <a
            href="/templates/Lead_Download_Template.xlsx"
            download="Lead_Download_Template.xlsx"
          >
            <Download className="w-4 h-4" />
            Download Format
          </a>
        </Button>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-2"
        >
          {/* First Row - Status, Source, User */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <form.Field
              name="status"
              validators={{
                onChange: ({ value }) => {
                  if (value === "") {
                    return "Please Select Status";
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="status">Status:</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className="w-full border-gray-300 dark:border-[#3a3285] rounded">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {status.data?.map((item) => {
                        return (
                          <SelectItem value={item._id}>{item.title}</SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  {!field.state.meta.isValid && (
                    <em role="alert">{field.state.meta.errors.join(", ")}</em>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="source"
              validators={{
                onChange: ({ value }) => {
                  if (!value) {
                    return "Please Select Source";
                  }
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="source">Source:</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className="w-full border-gray-300 dark:border-[#3a3285] rounded">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {sources.map((item) => {
                        return (
                          <SelectItem value={item._id}>{item.title}</SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {field.state.meta.isTouched && !field.state.meta.isValid && (
                    <em role="alert">{field.state.meta.errors.join(", ")}</em>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="user"
              validators={{
                onChange: ({ value }) => {
                  if (!value) {
                    return "Please Select User";
                  }
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="user">User:</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className="w-full border-gray-300 dark:border-[#3a3285] rounded">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.data?.map((item) => {
                        return (
                          <SelectItem value={item._id}>{item.name}</SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {field.state.meta.isTouched && !field.state.meta.isValid && (
                    <em role="alert">{field.state.meta.errors.join(", ")}</em>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          {/* Second Row - Label, Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field
              name="label"
              validators={{
                onChange: ({ value }) => {
                  if (value === "") {
                    return "Please Select Label";
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="label">Label: (Optional)</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className="w-full border-gray-300 dark:border-[#3a3285] rounded">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {labels?.labels?.map((item) => {
                        return (
                          <SelectItem value={item._id}>{item.title}</SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {field.state.meta.isTouched && !field.state.meta.isValid && (
                    <em role="alert">{field.state.meta.errors.join(", ")}</em>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="date"
              validators={{
                onChange: ({ value }) => {
                  if (!value) {
                    return "Please select a valid Date";
                  }
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="date">Date:</Label>
                  <Input
                    type="date"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full"
                  />
                  {field.state.meta.isTouched && !field.state.meta.isValid && (
                    <em role="alert">{field.state.meta.errors.join(", ")}</em>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept=".csv,.xlsx,.xls"
              />
              <div className="flex items-center justify-between bg-[#3a3285] text-white p-3 rounded-lg cursor-pointer hover:bg-purple-700 transition-colors">
                <span className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Choose file
                </span>
                <span className="text-purple-100">{fileName}</span>
              </div>
            </div>
          </div>

          {/* Toggle Switches */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <form.Field name="emailAutomation">
              {(field) => (
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-automation">Email Automation</Label>
                  <Switch
                    id="email-automation"
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="whatsappAutomation">
              {(field) => (
                <div className="flex items-center justify-between">
                  <Label htmlFor="whatsapp-automation">
                    Whatsapp Automation
                  </Label>
                  <Switch
                    id="whatsapp-automation"
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="removeDuplicateRecord">
              {(field) => (
                <div className="flex items-center justify-between">
                  <Label htmlFor="remove-duplicate">
                    Remove Duplicate Record
                  </Label>
                  <Switch
                    id="remove-duplicate"
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                  />
                </div>
              )}
            </form.Field>
          </div> */}

          {/* Notes Section */}
          <div className="rounded-lg border dark:border-yellow-400/40 border-orange-600/40 dark:bg-yellow-400/20 bg-orange-600/20 p-4 shadow-sm mt-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 dark:text-yellow-400 text-orange-600 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium dark:text-yellow-400 text-orange-600">
                  Notes:
                </h3>
                <div className="mt-2 text-sm dark:text-yellow-400/90 text-orange-600/90">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Import max 500 Records at a time.</li>
                    <li>Country code is required with contact numbers.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
        </form>
      </div>
    </div>
  );
}

interface DateRangeModalProps {
  // isOpen: boolean;
  setDate: (range: { startDate: Date; endDate: Date }) => void;
  // onSubmit: (startDate: Date, endDate: Date) => void;
  // initialStartDate?: Date;
  // initialEndDate?: Date;
}

export const DateRangeModal: React.FC<DateRangeModalProps> = ({ setDate }) => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [daysUpToToday, setDaysUpToToday] = useState<string>("1");
  const [daysStartingToday, setDaysStartingToday] = useState<string>("1");

  const quickOptions = [
    {
      label: "Today",
      onClick: () => {
        const today = new Date();
        setStartDate(today);
        setEndDate(today);
        setDate({ startDate: today, endDate: today });
      },
    },
    {
      label: "Yesterday",
      onClick: () => {
        const yesterday = subDays(new Date(), 1);
        setStartDate(yesterday);
        setEndDate(yesterday);
        setDate({ startDate: yesterday, endDate: yesterday });
      },
    },
    {
      label: "This Week",
      onClick: () => {
        const today = new Date();
        const start = startOfWeek(today, { weekStartsOn: 0 });
        const end = endOfWeek(today, { weekStartsOn: 0 });
        setStartDate(start);
        setEndDate(end);
        setDate({ startDate: start, endDate: end });
      },
    },
    {
      label: "Last Week",
      onClick: () => {
        const lastWeek = subDays(new Date(), 7);
        const start = startOfWeek(lastWeek, { weekStartsOn: 0 });
        const end = endOfWeek(lastWeek, { weekStartsOn: 0 });
        setStartDate(start);
        setEndDate(end);
        setDate({ startDate: start, endDate: end });
      },
    },
    {
      label: "This Month",
      onClick: () => {
        const today = new Date();
        const start = startOfMonth(today);
        const end = endOfMonth(today);
        setStartDate(start);
        setEndDate(end);
        setDate({ startDate: start, endDate: end });
      },
    },
    {
      label: "Last Month",
      onClick: () => {
        const lastMonth = subMonths(new Date(), 1);
        const start = startOfMonth(lastMonth);
        const end = endOfMonth(lastMonth);
        setStartDate(start);
        setEndDate(end);
        setDate({ startDate: start, endDate: end });
      },
    },
  ];

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (!startDate || (startDate && endDate && !isEqual(startDate, endDate))) {
      setStartDate(date);
      setEndDate(date);
      setDate({ startDate: date, endDate: date });
    } else if (date < startDate) {
      setStartDate(date);
      setDate({ startDate: date, endDate });
    } else {
      setEndDate(date);
      setDate({ startDate, endDate: date });
    }
  };

  const handleDaysUpToTodayChange = (value: string) => {
    setDaysUpToToday(value);
    const days = parseInt(value) || 1;
    const today = new Date();
    const start = subDays(today, days - 1);
    setStartDate(start);
    setEndDate(today);
    setDate({ startDate: start, endDate: today });
  };
  const handleDaysStartingTodayChange = (value: string) => {
    setDaysStartingToday(value);
    const days = parseInt(value) || 1;
    const today = new Date();
    const end = addDays(today, days - 1);
    setStartDate(today);
    setEndDate(end);
    setDate({ startDate: today, endDate: end });
  };

  // const handleSubmit = () => {
  //   console.log(startDate, endDate);
  // };

  const CalendarMonth = ({
    date,
    onDateClick,
  }: {
    date: Date;
    onDateClick: (date: Date) => void;
  }) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days = [];
    let currentDate = calendarStart;

    while (currentDate <= calendarEnd) {
      days.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }

    const isInRange = (date: Date) => {
      return date >= startOfDay(startDate) && date <= startOfDay(endDate);
    };

    const isRangeStart = (date: Date) => {
      return isEqual(startOfDay(date), startOfDay(startDate));
    };

    const isRangeEnd = (date: Date) => {
      return isEqual(startOfDay(date), startOfDay(endDate));
    };

    const isCurrentMonth = (date: Date) => {
      return date.getMonth() === monthStart.getMonth();
    };

    return (
      <div className="p-4">
        <h3 className="text-center font-medium mb-4 text-muted-foreground">
          {format(date, "MMM yyyy")}
        </h3>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-muted-foreground p-2"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => onDateClick(day)}
              className={cn(
                "w-10 h-10 text-sm rounded-md transition-colors",
                "hover:bg-[#fff]/40",
                !isCurrentMonth(day) && "text-muted-foreground opacity-50",
                isRangeStart(day) &&
                  "bg-[#3a3285] text-white hover:bg-selected",
                isRangeEnd(day) &&
                  !isRangeStart(day) &&
                  "bg-[#3a3285] text-white hover:bg-selected",
                isInRange(day) &&
                  !isRangeStart(day) &&
                  !isRangeEnd(day) &&
                  "bg-[#3a3285]/20 dark:bg-[#3a3285]/60"
              )}
            >
              {day.getDate()}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex">
      {/* Left sidebar */}
      <div className="w-64 border-r bg-muted/30 p-4">
        <div className="space-y-1 mb-6">
          {quickOptions.map((option, index) => (
            <button
              key={index}
              onClick={option.onClick}
              className="w-full text-left p-2 text-sm hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={daysUpToToday}
              onChange={(e) => handleDaysUpToTodayChange(e.target.value)}
              className="w-16 h-8 text-sm"
              min="1"
            />
            <span className="text-sm text-muted-foreground">
              days up to today
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={daysStartingToday}
              onChange={(e) => handleDaysStartingTodayChange(e.target.value)}
              className="w-16 h-8 text-sm"
              min="1"
            />
            <span className="text-sm text-muted-foreground">
              days starting today
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        {/* Date inputs */}
        <div className="flex space-x-4 mb-6">
          <Input
            value={format(startDate, "MMM d, yyyy")}
            readOnly
            className="flex-1"
          />
          <Input
            value={format(endDate, "MMM d, yyyy")}
            readOnly
            className="flex-1"
          />
        </div>

        {/* Calendar navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-muted rounded-md"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex space-x-4">
            <select
              value={format(currentMonth, "MMMM")}
              onChange={(e) => {
                const monthIndex = new Date(
                  `${e.target.value} 1, ${currentMonth.getFullYear()}`
                ).getMonth();
                setCurrentMonth(
                  new Date(currentMonth.getFullYear(), monthIndex)
                );
              }}
              className="bg-primary rounded px-2 py-1 text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => {
                const month = new Date(2000, i);
                return (
                  <option key={i} value={format(month, "MMMM")}>
                    {format(month, "MMMM")}
                  </option>
                );
              })}
            </select>

            <select
              value={currentMonth.getFullYear()}
              onChange={(e) => {
                setCurrentMonth(
                  new Date(parseInt(e.target.value), currentMonth.getMonth())
                );
              }}
              className="bg-primary  rounded px-2 py-1 text-sm"
            >
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - 5 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>

          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-muted rounded-md"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Dual calendar */}
        <div className="flex">
          <CalendarMonth date={currentMonth} onDateClick={handleDateSelect} />
          <CalendarMonth
            date={addMonths(currentMonth, 1)}
            onDateClick={handleDateSelect}
          />
        </div>

        {/* Action buttons */}
      </div>
    </div>
  );
};
