import { memo } from "react";
import type { ReportSection } from "../../types";
import { ReportCardList } from "../ReportCardList/ReportCardList";

export const ReportCard = memo(function ReportCard({
  section,
}: {
  section: ReportSection;
}) {
  return (
    <div className="rounded-md overflow-hidden bg-primary/40 border border-white/10 shadow-sm">
      <h4 className="text-xl text-center bg-blue-500/20 dark:bg-blue-500/10 text-blue-500 dark:text-blue-200 py-2 font-semibold">
        {section.title}
      </h4>
      <ReportCardList links={section.links} />
    </div>
  );
});
