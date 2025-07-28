import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { statusService } from "@/features/leads/services/Status.service";
import Swal from "sweetalert2";
import { useModalStore } from "@/store/useModalStore";

type Props = {
  refreshStatuses: () => void;
};
export default function CreateStatusForm({ refreshStatuses }: Props) {
  const closeModal = useModalStore((state) => state.closeModal);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      Swal.fire("Error", "Title is required", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { title, description };
      const res = await statusService.createStatus(payload);
      if (res.status === "CREATED") {
        Swal.fire("Success", res.message, "success");
        refreshStatuses();
        closeModal();
      } else {
        Swal.fire("Error", res.message, "error");
      }
    } catch (err: any) {
      Swal.fire("Error", err.message || "Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 p-2">
      <div>
        <Label htmlFor="title">Status Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., In Progress"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
        />
      </div>

      {/* You can omit this if using formActions from modal */}
      <div className="submit">
        <Button onClick={handleCreate} disabled={isSubmitting}>
          {" "}
          {isSubmitting ? "Creating..." : "Create"}
        </Button>
      </div>
    </div>
  );
}
