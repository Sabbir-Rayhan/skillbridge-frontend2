"use client";
import { useSession } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { LayoutDashboard, Users, CalendarDays, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/categories", label: "Categories", icon: Tag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const user = session?.user as any;

  useEffect(() => {
    if (!isPending && !session) router.push("/login");
    if (!isPending && session && user?.role !== "admin") router.push("/dashboard");
  }, [session, isPending, router, user]);

  if (isPending) return (
    <div className="min-h-screen flex items-center justify-center"><Spinner size={36} /></div>
  );
  if (!session || user?.role !== "admin") return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside className="hidden md:block w-52 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-ink rounded-2xl p-4 mb-3 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-accent-lime rounded-full animate-pulse" />
                  <span className="text-xs text-cream/40 font-medium uppercase tracking-wider">Admin Panel</span>
                </div>
                <p className="font-display font-bold text-cream text-sm truncate">{user?.name}</p>
              </div>
              <nav className="space-y-1">
                {NAV.map(({ href, label, icon: Icon, exact }) => {
                  const active = exact ? pathname === href : pathname.startsWith(href);
                  return (
                    <Link key={href} href={href}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                        active ? "bg-ink text-cream shadow-md" : "text-ink/60 hover:bg-orange-50 hover:text-ink"
                      )}
                    >
                      <Icon size={15} /> {label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Mobile nav */}
          <div className="md:hidden w-full mb-6">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {NAV.map(({ href, label, icon: Icon, exact }) => {
                const active = exact ? pathname === href : pathname.startsWith(href);
                return (
                  <Link key={href} href={href}
                    className={cn(
                      "flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border",
                      active ? "bg-ink text-cream border-ink" : "bg-white text-ink/60 border-orange-100"
                    )}
                  >
                    <Icon size={13} /> {label}
                  </Link>
                );
              })}
            </div>
          </div>

          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
