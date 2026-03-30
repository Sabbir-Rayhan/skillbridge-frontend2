"use client";
import { useEffect, useState } from "react";
import { adminGetBookings } from "@/lib/api";
import { Booking } from "@/types";
import { StatusBadge, EmptyState, Spinner } from "@/components/ui";
import { formatDate, formatTime } from "@/lib/utils";
import { CalendarDays, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminGetBookings()
      .then((r) => setBookings(r.data.data || []))
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  }, []);

  const FILTERS = ["all", "pending", "confirmed", "completed", "cancelled"];

  const filtered = bookings.filter((b) => {
    const matchStatus = filter === "all" || b.status === filter;
    const matchSearch =
      !search ||
      (b.student as any)?.name?.toLowerCase().includes(search.toLowerCase()) ||
      (b.tutor as any)?.user?.name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-ink">All Bookings</h1>
          <p className="text-ink/40 text-sm mt-1">{bookings.length} total sessions on platform</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
          <input
            placeholder="Search student or tutor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-4 py-2 bg-white border-2 border-orange-100 rounded-xl text-sm focus:outline-none focus:border-brand-500 w-60"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium capitalize border transition-all ${
              filter === f ? "bg-ink text-cream border-ink" : "bg-white text-ink/60 border-orange-100 hover:border-ink/20"
            }`}
          >
            {f}
            <span className="ml-1 text-xs opacity-60">
              ({f === "all" ? bookings.length : bookings.filter((b) => b.status === f).length})
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner size={32} /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<CalendarDays size={28} />} title="No bookings found" />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-orange-100 bg-orange-50/50">
                  {["Student", "Tutor", "Date & Time", "Status"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-display font-bold text-ink/50 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium">{(b.student as any)?.name || "—"}</td>
                    <td className="px-4 py-3 text-sm">{(b.tutor as any)?.user?.name || "—"}</td>
                    <td className="px-4 py-3 text-sm text-ink/60">
                      {formatDate(b.startTime)}<br />
                      <span className="text-xs">{formatTime(b.startTime)} – {formatTime(b.endTime)}</span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
