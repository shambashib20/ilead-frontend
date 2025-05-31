import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";
// import LeadTab from "../LeadTab";

function LeadCard({
  title = "Lead Title",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <Card className="py-2 mt-5">
      <CardHeader className="border-b-[1px] pt-1 border-gray-200 dark:border-gray-700 [.border-b]:pb-1 text-center">
        <CardTitle className="text-lg font-medium pb-0">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}

export default LeadCard;
