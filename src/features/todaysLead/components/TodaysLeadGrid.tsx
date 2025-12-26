import { Card, CardContent } from "@/components/ui/card";
import { LeadDetail } from "@/features/leads/components/LeadModals";
import { useModalStore } from "@/store/useModalStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

// Group leads by their status._id
function groupLeadsByStatus(leads: any[], statuses: any[]) {
  const grouped: Record<string, any[]> = {};

  // Initialize empty arrays for each status
  statuses.forEach((status) => {
    grouped[status._id] = [];
  });

  // Distribute leads to their respective status groups
  leads.forEach((lead) => {
    const statusId = lead.status?._id;
    if (statusId && grouped[statusId]) {
      grouped[statusId].push(lead);
    }
  });

  return grouped;
}

function LeadCard({ lead }: { lead: any }) {
  const { openModal, setModalTitle, setData, setModalSize } = useModalStore();

  const handleOpenModal = (lead: any) => {
    setModalTitle?.("Lead Details");
    setData?.({ _id: lead._id, rayId: lead?.meta?.ray_id });
    setModalSize?.("lg");
    openModal({
      content: <LeadDetail />,
      type: "action" as const,
    });
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 space-y-2 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => handleOpenModal(lead)}
    >
      {/* Label */}
      <div className="flex justify-between items-center">
        {lead.labels?.[0]?.title ? (
          <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded">
            {lead.labels[0].title}
          </span>
        ) : (
          <span className="text-xs bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
            No Label
          </span>
        )}
      </div>

      {/* Name */}
      <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
        {lead.name || "Unknown Name"}
      </div>

      {/* Phone */}
      <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
        📞 {lead.phone_number || "No phone"}
      </div>

      {/* Meta */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        CD: {new Date(lead.createdAt).toLocaleDateString()}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        TO: {lead.assigned_to?.name || "Unassigned"}
      </div>

      {/* Follow-up info */}
      {lead.todays_follow_ups?.[0] && (
        <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-1.5 rounded">
          Next Follow-up:{" "}
          {lead.todays_follow_ups[0]?.next_followup_date
            ? new Date(
                lead.todays_follow_ups[0]?.next_followup_date
              ).toLocaleDateString()
            : "No follow-up"}
        </div>
      )}

      {/* Actions */}
      {/* <div className="flex gap-3 pt-2 text-sm border-t border-gray-100 dark:border-gray-700">
        <button className="text-red-500 hover:text-red-600" title="Delete">
        
        </button>
        <button className="text-green-500 hover:text-green-600" title="Message">
          💬
        </button>
        <button className="text-blue-500 hover:text-blue-600" title="Details">
          📈
        </button>
        <button
          className="text-orange-500 hover:text-orange-600"
          title="Update"
        >
          🔄
        </button>
      </div> */}
    </div>
  );
}

function StatusColumn({
  title,
  colorCode,
  leads,
}: {
  title: string;
  colorCode: string;
  leads: any[];
}) {
  return (
    <div className="min-w-[320px] max-w-[320px] flex flex-col flex-shrink-0">
      {/* Header */}
      <div
        className="rounded-t text-white px-3 py-2 flex justify-between items-center mb-3"
        style={{ backgroundColor: colorCode }}
      >
        <span className="font-medium">{title}</span>
        <span className="bg-white/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
          {leads.length}
        </span>
      </div>

      {/* Cards */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-b p-2 space-y-2 h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {leads.length === 0 ? (
          <div className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">
            No leads in this status
          </div>
        ) : (
          leads.map((lead) => <LeadCard key={lead._id} lead={lead} />)
        )}
      </div>
    </div>
  );
}

export function LeadGridView({ leads, status }: { leads: any[]; status: any }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Check scroll position to show/hide arrows
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [status]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiply for faster scroll
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab";
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.cursor = "grab";
      }
    }
  };

  // Arrow button handlers
  const scrollToDirection = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 340; // Column width + gap
    const newScrollLeft =
      scrollContainerRef.current.scrollLeft +
      (direction === "left" ? -scrollAmount : scrollAmount);

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  console.log(leads);

  // Edge case 1: No status data available
  if (!status?.data || status.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="p-8 text-center max-w-md">
          <CardContent>
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              No Status Configurations
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Please configure status options to organize your leads.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Edge case 2: No leads data but statuses exist
  if (!leads || leads.length === 0) {
    return (
      <div className="w-full">
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-blue-800 dark:text-blue-200 text-center">
            📅 No follow-ups scheduled for today
          </p>
        </div>
        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scrollToDirection("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          )}

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scrollToDirection("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="flex gap-4 pb-4 overflow-x-auto scrollbar-hide cursor-grab select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onScroll={checkScroll}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {status.data.map((statusItem: any) => (
              <StatusColumn
                key={statusItem._id}
                title={statusItem.title}
                colorCode={statusItem.meta?.color_code || "#6366f1"}
                leads={[]}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Normal case: Group leads by status
  const groupedLeads = groupLeadsByStatus(leads, status.data);

  return (
    <div className="w-full">
      <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <p className="text-green-800 dark:text-green-200 text-sm">
          📋 Total follow-ups today: <strong>{leads.length}</strong>
        </p>
      </div>

      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scrollToDirection("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scrollToDirection("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex gap-4 pb-4 overflow-x-auto scrollbar-hide cursor-grab select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onScroll={checkScroll}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {status.data.map((statusItem: any) => (
            <StatusColumn
              key={statusItem._id}
              title={statusItem.title}
              colorCode={statusItem.meta?.color_code || "#6366f1"}
              leads={groupedLeads[statusItem._id] || []}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
