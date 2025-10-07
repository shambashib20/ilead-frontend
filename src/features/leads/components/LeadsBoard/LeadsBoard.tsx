"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import StatusColumn from "../StatusColumn";
import type { Lead, Status } from "@/features/leads/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LeadsBoardProps {
  leads: Lead[];
  statuses: Status[];
  setIsTableView: (val: boolean) => void;
}

export const LeadsBoard = memo(({ leads, statuses }: LeadsBoardProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);

  const checkScrollPosition = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  // mouse handlers for drag
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollStart(scrollRef.current.scrollLeft);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1; // multiply factor = scroll speed
    scrollRef.current.scrollLeft = scrollStart - walk;
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    checkScrollPosition();
    container.addEventListener("scroll", checkScrollPosition);
    return () => container.removeEventListener("scroll", checkScrollPosition);
  }, []);

  const leadCountsByStatus = useMemo(() => {
    return statuses.reduce(
      (acc, status) => {
        acc[status._id] = leads.filter(
          (lead) => lead.status._id === status._id
        ).length;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [leads, statuses]);

  if (!statuses.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No statuses available</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto relative">
      <div className="absolute top-2/4 left-2/4 -translate-2/4   flex justify-between w-full z-10 px-4">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className=" relative -left-10 top-5 bg-white shadow-md rounded-full p-2 z-10"
          >
            <ChevronLeft className="w-5 h-5 text-[#173b78]" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="relative -left-10 top-5 bg-white shadow-md rounded-full p-2 z-10"
          >
            <ChevronRight className="w-5 h-5 text-[#173b78]" />
          </button>
        )}
      </div>

      <div
        ref={scrollRef}
        className={`overflow-x-auto [&::-webkit-scrollbar]:w-[4px]  [&::-webkit-scrollbar-track]:rounded-full  [&::-webkit-scrollbar-track]:bg-[#fff]
                  [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-[#173b78] hover:[&::-webkit-scrollbar-thumb]:bg-[#2554a5] cursor-grab cursor-${
                  isDragging ? "grabbing" : "grab"
                }`}
        style={{}}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div
          className="mt-10 inline-flex gap-4 overflow-x-auto pb-3 [&::-webkit-scrollbar]:w-[4px] 
                [&::-webkit-scrollbar-track]:rounded-full
                [&::-webkit-scrollbar-track]:bg-[#fff]
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-[#173b78] hover:[&::-webkit-scrollbar-thumb]:bg-[#2554a5]"
        >
          {statuses.map((status) => (
            <StatusColumn
              key={status._id}
              status={status}
              leads={leads}
              leadCount={leadCountsByStatus[status._id] || 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

LeadsBoard.displayName = "LeadsBoard";
