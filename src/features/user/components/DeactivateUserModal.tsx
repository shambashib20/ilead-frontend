import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { useModalStore } from "@/store/useModalStore";
import {
  chatAgentService,
  type Agent,
  type Agents,
} from "@/features/leads/services/ChatAgents.service";
import Swal from "sweetalert2";

interface Props {
  agent: Agent;
  onSuccess: (agentId: string) => void;
}

function DeactivateUserModal({ agent, onSuccess }: Props) {
  const setFormActions = useModalStore((s) => s.setFormActions);
  const closeModal = useModalStore((s) => s.closeModal);

  const [telecallers, setTelecallers] = useState<Agents[]>([]);
  const [reassignTo, setReassignTo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTelecallers, setLoadingTelecallers] = useState(true);

  useEffect(() => {
    chatAgentService
      .chatAgents()
      .then((res) => {
        setTelecallers(res.data.data.filter((a) => a._id !== agent._id));
      })
      .catch((err) => console.error("Failed to fetch telecallers", err))
      .finally(() => setLoadingTelecallers(false));
  }, [agent._id]);

  const handleSubmit = async () => {
    if (!reassignTo) return;
    try {
      setIsSubmitting(true);
      await chatAgentService.toggleActiveStatus(agent._id, false, reassignTo);
      onSuccess(agent._id);
      Swal.fire({
        icon: "success",
        title: "User deactivated",
        timer: 1200,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      closeModal();
    } catch (err: any) {
      Swal.fire(
        "Error",
        err?.message || "Failed to deactivate user",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setFormActions({
      onSubmit: handleSubmit,
      onCancel: closeModal,
      canSubmit: !!reassignTo && !isSubmitting,
      isSubmitting,
    });
  }, [reassignTo, isSubmitting]);

  return (
    <div className="space-y-4 px-5 py-3">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        All leads assigned to <strong className="text-foreground">{agent.name}</strong> will be
        transferred. Select a telecaller to receive them.
      </p>
      <div>
        <Label htmlFor="reassignTo" className="mb-2 block">
          Reassign leads to
        </Label>
        <select
          id="reassignTo"
          value={reassignTo}
          onChange={(e) => setReassignTo(e.target.value)}
          disabled={loadingTelecallers}
          className="w-full border rounded px-3 py-2 bg-primary"
        >
          <option value="">
            {loadingTelecallers ? "Loading telecallers..." : "Select a telecaller"}
          </option>
          {telecallers.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default DeactivateUserModal;
