import { memo } from "react";
import type { ReportLink } from "../../types";
import { Link } from "@tanstack/react-router";
import { FaAngleRight } from "react-icons/fa";

const ReportListItem = memo(function ReportListItem({
  item,
}: {
  item: ReportLink;
}) {
  return (
    <li>
      <Link
        to={"/report/$slug"}
        params={{ slug: item.to }}
        aria-label={item.label}
        className="px-3 py-4 sm:py-5 flex items-center justify-between
                   focus:outline-none focus-visible:ring focus-visible:ring-blue-400
                   transition-transform hover:translate-x-1 hover:text-white"
      >
        <span className="truncate">{item.label}</span>
        <FaAngleRight size={18} aria-hidden="true" />
      </Link>
    </li>
  );
});

export const ReportCardList = memo(function ReportCardList({
  links,
  className = "",
  emptyText = "No reports available",
}: {
  links: ReportLink[];
  className?: string;
  emptyText?: string;
}) {
  if (!links?.length) {
    return <div className="px-3 py-4 text-sm text-white/70">{emptyText}</div>;
  }

  return (
    <ul className={`divide-y divide-white/10 ${className}`} role="list">
      {links.map((link) => (
        <ReportListItem key={link.to} item={link} />
      ))}
    </ul>
  );
});
