import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        " placeholder:text-white aria-invalid:ring-destructive/20  aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-24 w-full border border-foreground/20 bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-sm",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
