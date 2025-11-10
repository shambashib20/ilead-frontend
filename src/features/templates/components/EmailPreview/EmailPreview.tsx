import { Reply, Forward } from "lucide-react";
import { Button } from "@/components/ui/button";

export type EmailValues = {
  title: string;
  subject: string;
  message: string; // rich HTML
  attachments: File[];
};

type EmailPreviewProps = {
  values: EmailValues;
  fromName?: string;
  toLabel?: string;
};

export default function EmailPreview({
  values,
  fromName = "365 CRM",
  toLabel = "to me",
}: EmailPreviewProps) {
  const { subject, message, attachments } = values ?? {
    subject: "",
    message: "",
    attachments: [],
  };

  return (
    <div className="">
      <div className="w-full  bg-primary px-6 py-5 ">
        {/* Subject */}
        <h2 className="mb-4 text-[20px] font-semibold tracking-tight text-foreground">
          {subject || "—"}
        </h2>

        {/* Sender */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gray-300 dark:bg-gray-700" />
          <div className="leading-tight">
            <div className="text-[15px] font-semibold text-foreground">
              {fromName}
            </div>
            <div className="text-[13px] text-foreground">{toLabel}</div>
          </div>
        </div>

        {/* Body (rich HTML) */}
        <div
          className="mb-5 space-y-2 text-[15px] text-gray-800"
          dangerouslySetInnerHTML={{ __html: message || "" }}
        />

        <hr className="my-4 border-gray-200" />

        <div className="mb-5  text-[13px] text-gray-600">
          {attachments && attachments.length > 0 ? (
            <div className="space-y-3">
              <p className="font-semibold">
                {attachments.length} attachment
                {attachments.length > 1 ? "s" : ""}
              </p>

              {/* PREVIEW GRID */}
              <div className="grid grid-cols-1 gap-3">
                {attachments.map((file, i) => {
                  const isImage = file.type.startsWith("image/");

                  return (
                    <div key={i} className="flex flex-col">
                      {isImage ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="h-25 w-25 rounded-md object-cover border"
                        />
                      ) : (
                        <div className="h-16 w-16 flex items-center justify-center rounded-md border bg-gray-100 text-[10px] text-gray-600 p-1">
                          {file.name.slice(0, 12)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-gray-500 text-[12px]">Scanned by Gmail</p>
            </div>
          ) : (
            <p className="text-center text-[13px] text-gray-600">
              <span className="font-semibold">0 attachment</span> • Scanned by
              Gmail
            </p>
          )}
        </div>

        <ul className="flex items-center justify-center gap-3">
          <li>
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            >
              <Reply className="mr-2 h-4 w-4" />
              Reply
            </Button>
          </li>
          <li>
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            >
              <Forward className="mr-2 h-4 w-4" />
              Forward
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
}
