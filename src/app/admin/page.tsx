"use client";
import { useEffect, useState } from "react";
import { adminGetStats } from "@/lib/api";
import { Skeleton } from "@/components/ui";
import { Users, BookOpen, CalendarDays, Tag, TrendingUp } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetStats()
      .then((r) => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const CARDS = [
    { label: "Total Users", key: "totalUsers",    icon: Users,       color: "from-blue-500 to-blue-600" },
    { label: "Tutors",      key: "totalTutors",   icon: BookOpen,    color: "from-violet-500 to-violet-600" },
    { label: "Bookings",    key: "totalBookings", icon: CalendarDays,color: "from-brand-500 to-brand-600" },
    { label: "Categories",  key: "totalCategories",icon: Tag,        color: "from-green-500 to-green-600" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-black text-ink">Admin Dashboard</h1>
        <p className="text-ink/40 text-sm mt-1">Platform overview and management</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map(({ label, key, icon: Icon, color }) => (
          <div key={key} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white relative overflow-hidden`}>
            <div className="absolute right-0 top-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <Icon size={20} className="mb-3 opacity-80" />
            {loading
              ? <Skeleton className="h-8 w-16 mb-1 bg-white/20" />
              : <div className="text-3xl font-display font-black">{stats?.[key] ?? 0}</div>
            }
            <div className="text-white/70 text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/admin/users", title: "Manage Users", desc: "View and moderate user accounts", icon: Users },
          { href: "/admin/bookings", title: "All Bookings", desc: "Oversee every session on the platform", icon: CalendarDays },
          { href: "/admin/categories", title: "Categories", desc: "Add and manage subject categories", icon: Tag },
        ].map(({ href, title, desc, icon: Icon }) => (
          <a key={href} href={href} className="card p-5 hover:shadow-md transition-shadow group">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-brand-500 transition-colors">
              <Icon size={18} className="text-brand-500 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-display font-bold text-ink">{title}</h3>
            <p className="text-xs text-ink/40 mt-0.5">{desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
