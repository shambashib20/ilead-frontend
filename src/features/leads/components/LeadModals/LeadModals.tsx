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
  EllipsisVertical,
  Info,
  RefreshCcw,
  Send,
  SquarePen,
  Tag,
  Trash,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { LeadsModule } from "../../services/LeadsModule.service";

const leadsApi = new LeadsModule();

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
      <div className="space-y-4">
        <form.Field
          name="reason"
          validators={{
            onChange: ({ value }) =>
              !value ? "Please provide a reason for deletion" : undefined,
          }}
        >
          {(field) => (
            <div className="flex flex-col gap-2">
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
  return (
    <div>
      <Input placeholder="Search" className="" name="search" id="search" />
      <ul className="min-h-[200px] max-h-[100px] overflow-y-auto mt-3">
        <li>aaaa</li>
        <li>aaaa</li>
        <li>aaaa</li>
        <li>aaaa</li>
        <li>aaaa</li>
        <li>aaaa</li>
        <li>aaaa</li>
        <li>aaaa</li>
        <li>aaaa</li>
        <li>aaaa</li>
        <li>aaaa</li>
        <li>aaaa</li>
      </ul>
    </div>
  );
}

export function LeadAssign() {
  // const [setUser] = useState("");
  const { agents } = useChatAgents();

  console.log(agents);

  return (
    <div className="space-y-2">
      <Label htmlFor="user">User:</Label>
      <Select
        onValueChange={(value) => {
          console.log("Selected user:", value);
          // setUser(value);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose User" />
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
  );
}

export function LeadCreateCustomer() {
  const { closeModal } = useModalStore();
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-center ">
        <Info className="text-orange-300" size={90} strokeWidth={1} />
      </div>
      <h3 className="text-2xl text-center px-3 font-semibold text-gray-50 mx-auto">
        Are You Sure You Want To Convert This Lead To Customer ?
      </h3>
      <ul className="flex items-center justify-center gap-4">
        <li>
          <Button>Yes Convert</Button>
        </li>
        <li>
          <Button variant={"destructive"} onClick={closeModal}>
            Cancel
          </Button>
        </li>
      </ul>
    </div>
  );
}

// function LeadStatus() {}

// function LeadFollowUp() {}

export function LeadDetail() {
  const { data } = useModalStore();
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
      <div className="p-4 text-center text-white">Loading lead details...</div>
    );
  }

  if (!lead) {
    return <div className="p-4 text-center text-red-500">Lead not found.</div>;
  }

  // Extract fields

  return (
    <div className="min-h-[400px] max-h-[450px] overflow-y-auto">
      {/* Top Action Icons (static for now) */}
      <ul className="flex items-center justify-center gap-6">
        <li className="cursor-pointer">
          <SquarePen size={26} strokeWidth={1.4} />
        </li>
        <li className="cursor-pointer">
          <Send size={26} strokeWidth={1.4} />
        </li>
        <li className="cursor-pointer">
          <TrendingUp size={26} strokeWidth={1.4} />
        </li>
        <li className="cursor-pointer">
          <UserPlus size={26} strokeWidth={1.4} />
        </li>
        <li className="cursor-pointer">
          <Trash size={26} strokeWidth={1.4} />
        </li>
        <li className="cursor-pointer">
          <Tag size={26} strokeWidth={1.4} />
        </li>
        <li className="cursor-pointer">
          <RefreshCcw size={26} strokeWidth={1.4} />
        </li>
        <li className="cursor-pointer">
          <EllipsisVertical size={26} strokeWidth={1.4} />
        </li>
      </ul>

      {/* Tabs */}
      <Tabs defaultValue="details" className="mt-4">
        <TabsList className="flex flex-wrap gap-2 p-1 w-[700px] mx-auto">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="followup">Follow Up</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          {/* <TabsTrigger value="task">Task</TabsTrigger>
          <TabsTrigger value="reminder">Reminder</TabsTrigger>
          <TabsTrigger value="meeting">Meeting</TabsTrigger>
          <TabsTrigger value="quotation">Quotation</TabsTrigger>
          <TabsTrigger value="invoice">Invoice</TabsTrigger> */}
        </TabsList>

        <TabsContent value="details">
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="border border-gray-700 rounded">
              <h3 className="font-semibold text-white mb-2 bg-[#3a3285] p-4 text-center">
                Lead Information
              </h3>
              <div className="p-4">
                <p className="text-sm text-gray-300 mb-2">
                  <b>Name:</b> {lead.data.name}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Company:</b> {lead.data.company_name || "-"}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Phone:</b> {lead.data.phone_number}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Email:</b> {lead.data.email || "-"}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Address:</b> {lead.data.address || "-"}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Comment:</b> {lead.data.comment || "-"}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Reference:</b> {lead.data.reference || "-"}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="border border-gray-700 rounded">
              <h3 className="font-semibold text-white mb-2 bg-[#3a3285] p-4 text-center">
                General Information
              </h3>
              <div className="p-4">
                <p className="text-sm text-gray-300 mb-2">
                  <b>Date:</b> {new Date(lead.data.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Status:</b> {lead.data.status.title || "N/A"}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Source:</b> {lead.data.meta.source.title || "N/A"}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Labels:</b>{" "}
                  <div className="flex gap-2 flex-wrap mt-1">
                    {lead.data.labels.length > 0
                      ? lead.data.labels.map((lbl: any) => (
                          <span
                            key={lbl._id}
                            className="bg-purple-700 px-2 py-1 rounded text-xs"
                          >
                            {lbl.title}
                          </span>
                        ))
                      : "-"}
                  </div>
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Created By:</b> {lead.data.assigned_by?.name || ""}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <b>Assign To:</b> {lead.data.assigned_to?.name || "N/A"}
                </p>
              </div>
            </div>

            {/* <div className="border border-gray-700 rounded">
              <h3 className="font-semibold text-white mb-2 bg-[#3a3285] p-4 text-center">
                Lead Meta Data
              </h3>
              <div className="p-4">
                <p className="text-sm text-gray-300 mb-2">
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
          <p>No follow ups yet.</p>
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <p>No history available.</p>
        </TabsContent>
        <TabsContent value="task" className="mt-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
