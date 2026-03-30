"use client";
import { useEffect, useState } from "react";
import { getTutorBookings, getMyTutorProfile, updateBookingStatus } from "@/lib/api";
import { Booking, TutorProfile } from "@/types";
import { Avatar, StatusBadge, EmptyState, Skeleton, Spinner } from "@/components/ui";
import { formatDate, formatTime, calcAvgRating } from "@/lib/utils";
import { CalendarDays, CheckCircle, Clock, TrendingUp, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function TutorDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user as any;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [bookRes, profRes] = await Promise.all([
        getTutorBookings(),
        getMyTutorProfile(),
      ]);
      setBookings(bookRes.data.data || []);
      setProfile(profRes.data.data || null);
    } catch {
      toast.error("Failed to load dashboard");
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await updateBookingStatus(id, status);
      toast.success(`Booking ${status}`);
      load();
    } catch {
      toast.error("Update failed");
    }
    setUpdating(null);
  };

  const total     = bookings.length;
  const pending   = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const completed = bookings.filter((b) => b.status === "completed").length;
  const avgRating = profile ? calcAvgRating(profile.reviews ?? []) : 0;

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
      </div>
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );

  if (!profile) return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <CalendarDays size={28} className="text-brand-400" />
      </div>
      <p className="text-ink/50 mb-4 font-medium">No tutor profile found. Set one up first.</p>
      <Link href="/tutor/profile" className="btn-primary">Set Up Profile</Link>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-violet-600 to-brand-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <p className="text-white/70 text-sm">Welcome back,</p>
        <h1 className="text-3xl font-display font-black">{user?.name} 🎓</h1>
        <p className="text-white/60 text-sm mt-1">
          {Number(avgRating) > 0 ? `Your rating: ⭐ ${avgRating}` : "No ratings yet — keep teaching!"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Sessions", value: total,     icon: CalendarDays, color: "text-blue-500 bg-blue-50" },
          { label: "Pending",        value: pending,   icon: Clock,        color: "text-yellow-500 bg-yellow-50" },
          { label: "Confirmed",      value: confirmed, icon: TrendingUp,   color: "text-brand-500 bg-orange-50" },
          { label: "Completed",      value: completed, icon: CheckCircle,  color: "text-green-500 bg-green-50" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-4">
            <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon size={16} />
            </div>
            <div className="text-2xl font-display font-black">{value}</div>
            <div className="text-xs text-ink/40">{label}</div>
          </div>
        ))}
      </div>

      {/* Profile quick view */}
      <div className="card p-5 flex items-center gap-4 flex-wrap">
        <Avatar name={user?.name || "T"} image={user?.image} size="lg" />
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-bold text-lg">{user?.name}</h2>
          <p className="text-sm text-ink/50">
            ${profile.hourlyRate}/hr · {profile.experience} yr{profile.experience !== 1 ? "s" : ""} exp
          </p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {profile.categories?.map((c) => (
              <span key={c.id} className="text-xs px-2 py-0.5 bg-orange-50 text-brand-600 rounded-full border border-orange-100">
                {c.name}
              </span>
            ))}
          </div>
        </div>
        <Link href="/tutor/profile" className="btn-ghost text-sm flex-shrink-0 border border-orange-100 rounded-xl">
          Edit Profile
        </Link>
      </div>

      {/* Session requests */}
      <div className="card p-6">
        <h2 className="font-display font-bold text-xl mb-5">Session Requests</h2>
        {bookings.length === 0 ? (
          <EmptyState
            icon={<CalendarDays size={28} />}
            title="No sessions yet"
            description="Students will appear here once they book with you."
          />
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="flex flex-wrap items-center gap-3 p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                <Avatar name={b.student?.name || "S"} image={b.student?.image} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{b.student?.name}</p>
                  <p className="text-xs text-ink/50">
                    {formatDate(b.startTime)} · {formatTime(b.startTime)} – {formatTime(b.endTime)}
                  </p>
                </div>
                <StatusBadge status={b.status} />
                {b.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatus(b.id, "confirmed")}
                      disabled={updating === b.id}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {updating === b.id ? <Spinner size={11} /> : <Check size={11} />} Confirm
                    </button>
                    <button
                      onClick={() => handleStatus(b.id, "cancelled")}
                      disabled={updating === b.id}
                      className="flex items-center gap-1 px-3 py-1.5 bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold hover:bg-rose-200 transition-colors disabled:opacity-50"
                    >
                      <X size={11} /> Decline
                    </button>
                  </div>
                )}
                {b.status === "confirmed" && (
                  <button
                    onClick={() => handleStatus(b.id, "completed")}
                    disabled={updating === b.id}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {updating === b.id ? <Spinner size={11} /> : <CheckCircle size={11} />} Mark Complete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
