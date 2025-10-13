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
      <h4 className="text-base sm:text-lg text-center bg-blue-500 text-white py-2 font-medium">
        {section.title}
      </h4>
      <ReportCardList links={section.links} />
    </div>
  );
});
