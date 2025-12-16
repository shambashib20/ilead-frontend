function groupLeadsByStatus(leads: any[]) {
  return leads.reduce(
    (acc, lead) => {
      const status = lead.status?.title || "Unknown";

      if (!acc[status]) acc[status] = [];
      acc[status].push(lead);

      return acc;
    },
    {} as Record<string, any[]>
  );
}

function LeadCard({ lead }: { lead: any }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-3 space-y-2">
      {/* Label */}
      <div className="flex justify-between items-center">
        {lead.labels?.[0] ? (
          <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded">
            {lead.labels[0].title}
          </span>
        ) : (
          <span className="text-xs bg-gray-300 px-2 py-0.5 rounded">
            No Label
          </span>
        )}
      </div>

      {/* Name */}
      <div className="font-medium text-sm">{lead.name}</div>

      {/* Phone */}
      <div className="text-sm text-green-600 flex items-center gap-1">
        📞 {lead.phone_number}
      </div>

      {/* Meta */}
      <div className="text-xs text-gray-500">
        CD: {new Date(lead.createdAt).toLocaleString()}
      </div>

      <div className="text-xs text-gray-500">
        TO: {lead.assigned_to?.name || "—"}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2 text-sm">
        <button className="text-red-500">🗑</button>
        <button className="text-green-500">💬</button>
        <button className="text-blue-500">📈</button>
        <button className="text-orange-500">🔄</button>
      </div>
    </div>
  );
}

function StatusColumn({ title, leads }: { title: string; leads: any[] }) {
  return (
    <div className="min-w-[320px] max-w-[320px] flex flex-col">
      {/* Header */}
      <div className="rounded-t bg-indigo-600 text-white px-3 py-2 flex justify-between mb-5">
        <span>{title}</span>
        <span className="bg-pink-500 text-xs px-2 rounded">{leads.length}</span>
      </div>

      {/* Cards */}
      <div className="bg-gray-50 p-2 space-y-2 h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300">
        {leads.map((lead) => (
          <LeadCard key={lead._id} lead={lead} />
        ))}
      </div>
    </div>
  );
}

export function LeadGridView({ leads }: { leads: any[] }) {
  const grouped = groupLeadsByStatus(leads);

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-4 pb-4">
        {Object.entries(grouped).map(([status, items]) => (
          <StatusColumn key={status} title={status} leads={items as any[]} />
        ))}
      </div>
    </div>
  );
}
