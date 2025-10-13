export type ReportLink = { label: string; to: string };
export type ReportSection = { title: string; links: ReportLink[] };
export type ReportGroup = { heading: string; sections: ReportSection[] };
