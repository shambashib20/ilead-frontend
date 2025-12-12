import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        " dark:bg-[#373a54] bg-gray-100 animate-pulse rounded-md",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
