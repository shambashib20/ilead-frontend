import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-transparent text-foreground flex h-9  items-center justify-center  px-[14px] ",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "flex-1 border-b-3 border-transparent data-[state=active]:[border-image:linear-gradient(118deg,#432ee5,#e43e2b)_1] data-[state=active]:text-[#173b78]  dark:data-[state=active]:bg-[linear-gradient(118deg,#aea3ff,#ff9e93)] dark:data-[state=active]:bg-clip-text dark:data-[state=active]:text-transparent  data-[state=active]:font-semibold font-medium text-sm text-[#6e6b7b] dark:text-[#d0d2d6]  pb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
