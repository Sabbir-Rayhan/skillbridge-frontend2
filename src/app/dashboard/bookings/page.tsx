"use client";
import { useEffect, useState } from "react";
import { getMyBookings, updateBookingStatus } from "@/lib/api";
import { Booking } from "@/types";
import { Avatar, StatusBadge, EmptyState, Spinner } from "@/components/ui";
import { formatDate, formatTime } from "@/lib/utils";
import { CalendarDays, XCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [cancelling, setCancelling] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    getMyBookings()
      .then((r) => setBookings(r.data.data || []))
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this booking?")) return;
    setCancelling(id);
    try {
      await updateBookingStatus(id, "cancelled");
      toast.success("Booking cancelled");
      load();
    } catch {
      toast.error("Failed to cancel");
    }
    setCancelling(null);
  };

  const FILTERS = ["all", "pending", "confirmed", "completed", "cancelled"];
  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-black text-ink">My Bookings</h1>
        <p className="text-ink/40 text-sm mt-1">All your tutoring sessions in one place</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize border ${
              filter === f
                ? "bg-ink text-cream border-ink"
                : "bg-white text-ink/60 border-orange-100 hover:border-ink/20"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner size={32} /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<CalendarDays size={28} />}
          title="No bookings found"
          description={filter === "all" ? "You haven't booked any sessions yet." : `No ${filter} bookings.`}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => (
            <div key={booking.id} className="card p-5">
              <div className="flex items-start gap-4">
                <Avatar name={booking.tutor?.user.name || "T"} image={booking.tutor?.user.image} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display font-bold text-ink">{booking.tutor?.user.name}</h3>
                      <p className="text-sm text-ink/50 mt-0.5">
                        {formatDate(booking.startTime)} · {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                      </p>
                      {booking.tutor?.categories && booking.tutor.categories.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {booking.tutor.categories.slice(0, 2).map((c) => (
                            <span key={c.id} className="text-xs px-2 py-0.5 bg-orange-50 text-brand-600 rounded-full border border-orange-100">
                              {c.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                </div>
              </div>

              {(booking.status === "pending" || booking.status === "confirmed") && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-orange-50">
                  <button
                    onClick={() => handleCancel(booking.id)}
                    disabled={cancelling === booking.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-rose-500 hover:bg-rose-50 rounded-lg transition-colors font-medium border border-rose-100 disabled:opacity-50"
                  >
                    {cancelling === booking.id ? <Spinner size={13} /> : <XCircle size={13} />}
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
