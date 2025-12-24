// StatusColumn.tsx - Fixed version
"use client";
import { memo, useCallback, useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Lead, Status } from "@/features/leads/types";
import LeadCard from "../LeadCard";
import { useMissedFollowUps } from "../../hooks/useMissedFollowUp";

interface StatusColumnProps {
  status: Status;
  leads: Lead[];
  leadCount: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export const StatusColumn = memo(
  ({
    status,
    leads,
    leadCount,
    onLoadMore,
    hasMore = false,
    isLoadingMore = false,
  }: StatusColumnProps) => {
    const statusLeads = leads.filter((lead) => lead.status._id === status._id);
    const { missedFollowUps } = useMissedFollowUps();
    const scrollRef = useRef<HTMLDivElement>(null);
    const loadMoreCalledRef = useRef(false);

    const statusTitle = String(status.title);

    const updatedLeads = leads?.map((lead) => {
      const hasMissed = missedFollowUps.data.some(
        (item) => item.leadId === lead._id
      );
      return {
        ...lead,
        missedFollowup: hasMissed,
        count: 0,
      };
    });

    const rowVirtualizer = useVirtualizer({
      count: hasMore ? statusLeads.length + 1 : statusLeads.length,
      getScrollElement: () => scrollRef.current,
      estimateSize: () => 230,
      overscan: 2, // Reduced overscan to prevent premature loading
    });

    // FIX 1: Only load more when user actually scrolls to the bottom
    const handleScroll = useCallback(() => {
      const container = scrollRef.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrolledToBottom = scrollHeight - scrollTop - clientHeight < 50; // 50px threshold

      if (
        scrolledToBottom &&
        hasMore &&
        !isLoadingMore &&
        !loadMoreCalledRef.current &&
        onLoadMore
      ) {
        loadMoreCalledRef.current = true;
        onLoadMore();
      }
    }, [hasMore, isLoadingMore, onLoadMore]);

    // Reset the ref when loading completes
    useEffect(() => {
      if (!isLoadingMore) {
        loadMoreCalledRef.current = false;
      }
    }, [isLoadingMore]);

    // Attach scroll listener
    useEffect(() => {
      const container = scrollRef.current;
      if (!container) return;

      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    return (
      <div className="flex-shrink-0 w-[280px] rounded-lg bg-transparent">
        <div className="px-2 mb-5">
          <h3
            style={{
              backgroundColor: status.meta.color_code || "gray",
            }}
            className="font-semibold py-2 px-3 rounded text-white flex items-center"
          >
            {statusTitle}
            <span className="ms-auto bg-pink-500 h-7 w-7 rounded-full grid place-items-center text-xs">
              {leadCount}
            </span>
          </h3>
        </div>
        <div
          ref={scrollRef}
          className="px-2 max-h-[500px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#fff] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#173b78] hover:[&::-webkit-scrollbar-thumb]:bg-[#2554a5]"
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const isLoaderRow = virtualRow.index > statusLeads.length - 1;
              const lead = statusLeads[virtualRow.index];

              return (
                <div
                  key={virtualRow.index}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="flex flex-col justify-start pb-3"
                >
                  {isLoaderRow ? (
                    hasMore ? (
                      <div className="flex items-center justify-center py-4">
                        {/* <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div> */}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-4">
                        <div className="text-sm text-gray-400">
                          No more leads
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="mb-2">
                      <LeadCard
                        lead={
                          updatedLeads?.find((l) => l._id === lead._id) || lead
                        }
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

StatusColumn.displayName = "StatusColumn";

export default StatusColumn;
