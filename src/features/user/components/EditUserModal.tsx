import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useModalStore } from "@/store/useModalStore";
import {
  chatAgentService,
  type Agent,
} from "@/features/leads/services/ChatAgents.service";
import Swal from "sweetalert2";

interface Props {
  agent: Agent;
  onSuccess: (updated: Agent) => void;
}

function EditUserModal({ agent, onSuccess }: Props) {
  const closeModal = useModalStore((s) => s.closeModal);
  const setFormActions = useModalStore((s) => s.setFormActions);

  const [formData, setFormData] = useState({
    name: agent.name || "",
    email: agent.email || "",
    phone_number: agent.phone_number || "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDirty =
    formData.name !== (agent.name || "") ||
    formData.email !== (agent.email || "") ||
    formData.phone_number !== (agent.phone_number || "");

  const canSubmit = (isDirty || formData.password.length > 0) && !isSubmitting;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      const payload: {
        name?: string;
        email?: string;
        phone_number?: string;
        password?: string;
      } = {};
      // normal field changes
      if (formData.name !== (agent.name || "")) payload.name = formData.name;
      if (formData.email !== (agent.email || ""))
        payload.email = formData.email;
      if (formData.phone_number !== (agent.phone_number || ""))
        payload.phone_number = formData.phone_number;

      // password logic
      if (formData.password.trim().length > 0) {
        payload.password = formData.password;

        // 👇 FORCE include at least one required field
        if (!payload.name && !payload.email && !payload.phone_number) {
          payload.name = agent.name; // safe fallback
        }
      }
      const res = await chatAgentService.updateChatAgent(agent._id, payload);
      onSuccess(res.data.data);
      Swal.fire({
        icon: "success",
        title: "Updated",
        text: res.data.message,
        timer: 1200,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      closeModal();
    } catch (err: any) {
      Swal.fire("Error", err?.message || "Failed to update employee", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setFormActions?.({
      onSubmit: handleSubmit,
      onCancel: closeModal,
      canSubmit,
      isSubmitting,
    });
  }, [canSubmit, isSubmitting, formData]);

  return (
    <div className="space-y-4 px-5 py-3">
      <div>
        <Label htmlFor="name" className="mb-2">
          Name
        </Label>
        <Input id="name" value={formData.name} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="email" className="mb-2">
          Email
        </Label>
        <Input id="email" value={formData.email} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="phone_number" className="mb-2">
          Phone Number
        </Label>
        <Input
          id="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="password" className="mb-2">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Leave blank to keep unchanged"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default EditUserModal;
