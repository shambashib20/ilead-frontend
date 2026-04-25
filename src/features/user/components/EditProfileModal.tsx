import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useModalStore } from "@/store/useModalStore";
import { useUpdateProfile } from "@/features/leads/hooks/useUpdateProfile";
import type { UserDto } from "@/features/leads/services/User.service";

interface Props {
  user: UserDto;
}

function EditProfileModal({ user }: Props) {
  const closeModal = useModalStore((s) => s.closeModal);
  const setFormActions = useModalStore((s) => s.setFormActions);
  const { mutateAsync, isPending } = useUpdateProfile();

  const initialBio = user.meta?.bio ?? "";

  const [formData, setFormData] = useState({
    name: user.name ?? "",
    email: user.email ?? "",
    phone_number: user.phone_number ?? "",
    bio: initialBio,
  });

  const isDirty =
    formData.name !== (user.name ?? "") ||
    formData.email !== (user.email ?? "") ||
    formData.phone_number !== (user.phone_number ?? "") ||
    formData.bio !== initialBio;

  const canSubmit = isDirty && !isPending;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const payload: Record<string, string> = {};
    if (formData.name !== (user.name ?? "")) payload.name = formData.name;
    if (formData.email !== (user.email ?? "")) payload.email = formData.email;
    if (formData.phone_number !== (user.phone_number ?? ""))
      payload.phone_number = formData.phone_number;
    if (formData.bio !== initialBio) payload.bio = formData.bio;

    await mutateAsync(payload);
    closeModal();
  };

  useEffect(() => {
    setFormActions({
      onSubmit: handleSubmit,
      onCancel: closeModal,
      canSubmit,
      isSubmitting: isPending,
    });
  }, [canSubmit, isPending, formData]);

  return (
    <div className="space-y-4 px-5 py-4">
      <div>
        <Label htmlFor="name" className="mb-1.5 block">
          Name
        </Label>
        <Input id="name" value={formData.name} onChange={handleChange} />
      </div>

      <div>
        <Label htmlFor="email" className="mb-1.5 block">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="phone_number" className="mb-1.5 block">
          Phone Number
        </Label>
        <Input
          id="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="bio" className="mb-1.5 block">
          Bio
        </Label>
        <Textarea
          id="bio"
          rows={3}
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself..."
        />
      </div>
    </div>
  );
}

export default EditProfileModal;
