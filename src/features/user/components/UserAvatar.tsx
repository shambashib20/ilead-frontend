import React, { useEffect, useRef, useState } from "react";
import { User, Pencil } from "lucide-react";
import { useUploadFile } from "@/features/fileUpload/hooks/useUploadFile";
import { useUpdateProfileImage } from "@/features/leads/hooks/useUpdateProfileImage";

interface UserAvatarProps {
  img?: string | null;
  name?: string | null;
}

function UserAvatar({ img, name }: UserAvatarProps) {
  const [preview, setPreview] = useState<string | null>(img ?? null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutate: uploadFile, isPending: isUploading } = useUploadFile();
  const { mutate: updateProfileImage, isPending: isUpdating } =
    useUpdateProfileImage();

  useEffect(() => {
    if (img && !preview) {
      setPreview(img);
    }
  }, [img, preview]);

  function handleButtonClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    uploadFile(file, {
      onSuccess: (res) => {
        const fileUrl = res?.data?.file_url;
        if (!fileUrl) {
          console.error("file_url missing in upload response", res);
          return;
        }
        updateProfileImage(fileUrl);
      },
      onError: (err) => console.error("Upload failed:", err),
    });
  }

  const isBusy = isUploading || isUpdating;

  const firstLetter =
    name && typeof name === "string" && name.trim().length > 0
      ? name.trim().charAt(0).toUpperCase()
      : null;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Avatar */}
      <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-gray-700 font-bold text-xl">
        {preview ? (
          <img
            src={preview}
            alt="User avatar"
            className="h-full w-full object-cover"
          />
        ) : img ? (
          <img
            src={img}
            alt="User avatar"
            className="h-full w-full object-cover"
          />
        ) : firstLetter ? (
          <span>{firstLetter}</span>
        ) : (
          <User className="h-10 w-10 text-gray-500" />
        )}
      </div>

      {/* Pencil button */}
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={isBusy}
        className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Pencil className="h-3 w-3" />
        {isBusy ? "Saving..." : "Change photo"}
      </button>

      {/* Hidden input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default UserAvatar;
