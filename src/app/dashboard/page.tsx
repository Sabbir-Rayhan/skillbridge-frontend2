"use client";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getMyBookings } from "@/lib/api";
import { Booking } from "@/types";
import { StatusBadge, Avatar, Skeleton } from "@/components/ui";
import { formatDate, formatTime } from "@/lib/utils";
import { CalendarDays, Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBookings()
      .then((r) => setBookings(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const upcoming = bookings.filter((b) => b.status === "pending" || b.status === "confirmed");
  const completed = bookings.filter((b) => b.status === "completed").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-brand-500 to-brand-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <p className="text-white/70 text-sm font-medium">Good to see you!</p>
        <h1 className="text-3xl font-display font-black mt-1">Hello, {user?.name?.split(" ")[0]} 👋</h1>
        <p className="text-white/60 text-sm mt-1">Ready to continue learning?</p>
        <Link href="/tutors" className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-white text-brand-600 rounded-xl text-sm font-display font-bold hover:bg-cream transition-colors">
          Find a Tutor <ArrowRight size={12} />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", value: bookings.length, icon: CalendarDays, color: "text-blue-500 bg-blue-50" },
          { label: "Upcoming", value: upcoming.length, icon: Clock, color: "text-brand-500 bg-orange-50" },
          { label: "Completed", value: completed, icon: CheckCircle, color: "text-green-500 bg-green-50" },
          { label: "Cancelled", value: cancelled, icon: XCircle, color: "text-rose-500 bg-rose-50" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-4">
            <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon size={16} />
            </div>
            {loading ? <Skeleton className="h-6 w-10 mb-1" /> : <div className="text-2xl font-display font-black">{value}</div>}
            <div className="text-xs text-ink/40">{label}</div>
          </div>
        ))}
      </div>

      {/* Upcoming sessions */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-xl">Upcoming Sessions</h2>
          <Link href="/dashboard/bookings" className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-3 items-center">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        ) : upcoming.length === 0 ? (
          <div className="text-center py-8">
            <CalendarDays size={32} className="text-ink/20 mx-auto mb-2" />
            <p className="text-ink/40 text-sm">No upcoming sessions</p>
            <Link href="/tutors" className="inline-flex items-center gap-1 mt-3 text-sm text-brand-600 font-medium">
              Book your first session <ArrowRight size={12} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.slice(0, 4).map((booking) => (
              <div key={booking.id} className="flex items-center gap-3 p-3 bg-orange-50/50 rounded-xl border border-orange-100">
                <Avatar name={booking.tutor?.user.name || "T"} image={booking.tutor?.user.image} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{booking.tutor?.user.name}</p>
                  <p className="text-xs text-ink/50">{formatDate(booking.startTime)} · {formatTime(booking.startTime)}</p>
                </div>
                <StatusBadge status={booking.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
