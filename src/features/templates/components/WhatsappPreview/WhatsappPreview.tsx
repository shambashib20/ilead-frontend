"use client";

export type WhatsappValues = {
  title: string;
  message: string; // plain text with \n, optional *bold* _italic_ ~strike~
  attachments: File[]; // local files selected in form
};

type WhatsAppPreviewProps = {
  values: WhatsappValues;
};

function formatWhatsText(msg: string) {
  // super-light WhatsApp-style formatting: *bold* _italic_ ~strike~
  // escape then replace, finally convert newlines to <br>
  const esc = msg
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const rich = esc
    .replace(/\*(.+?)\*/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/~(.+?)~/g, "<s>$1</s>")
    .replace(/\n/g, "<br />");
  return { __html: rich };
}

export default function WhatsAppPreview({ values }: WhatsAppPreviewProps) {
  const { title, message, attachments } = values ?? {
    title: "",
    message: "",
    attachments: [],
  };

  const hasContent = Boolean(message?.trim()) || (attachments?.length ?? 0) > 0;

  return (
    <div className="h-full flex flex-col min-h-96 rounded-xl overflow-hidden border-3 border-black">
      {/* Header */}
      <div className="bg-emerald-700 text-white p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-bold">
          365
        </div>
        <div className="leading-tight">
          <p className="font-semibold text-sm">{title || "365 CRM"}</p>
          <p className="text-xs opacity-75">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#e5ded5] ">
        {hasContent ? (
          <div className="flex flex-col items-end gap-2">
            {/* Text bubble */}
            {message?.trim() && (
              <div className="bg-[#d3ffc5] text-gray-900 rounded-lg rounded-tr-none px-3 py-2 max-w-xs text-sm shadow-sm">
                <p dangerouslySetInnerHTML={formatWhatsText(message)} />
              </div>
            )}

            {/* Attachments bubble */}
            {(attachments?.length ?? 0) > 0 && (
              <div className="bg-[#d3ffc5] text-gray-900 rounded-lg rounded-tr-none p-2 max-w-[260px] shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                  {attachments.map((f, i) => {
                    const isImage = f.type.startsWith("image/");
                    const url = URL.createObjectURL(f);
                    return (
                      <div
                        key={i}
                        className="overflow-hidden rounded-md border"
                      >
                        {isImage ? (
                          <img
                            src={url}
                            alt={f.name}
                            className="h-24 w-full object-cover"
                            onLoad={() => URL.revokeObjectURL(url)}
                          />
                        ) : (
                          <div className="h-24 w-full bg-white/70 flex items-center justify-center px-2 text-xs text-gray-600">
                            <span className="line-clamp-2 text-center break-all">
                              {f.name}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-foreground text-opacity-60 text-sm">
              Message preview will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
