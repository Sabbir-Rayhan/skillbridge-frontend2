"use client";
import { useSession } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { LayoutDashboard, CalendarDays, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/bookings", label: "My Bookings", icon: CalendarDays },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const user = session?.user as any;

  useEffect(() => {
    if (!isPending && !session) router.push("/login");
    if (!isPending && session && user?.role === "tutor") router.push("/tutor/dashboard");
    if (!isPending && session && user?.role === "admin") router.push("/admin");
  }, [session, isPending, router, user]);

  if (isPending) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size={36} />
    </div>
  );

  if (!session) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden md:block w-52 flex-shrink-0">
            <div className="sticky top-24">
              <div className="card p-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-sm truncate">{user?.name}</p>
                    <p className="text-xs text-ink/40 capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>
              <nav className="space-y-1">
                {NAV.map(({ href, label, icon: Icon, exact }) => {
                  const active = exact ? pathname === href : pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                        active
                          ? "bg-brand-500 text-white shadow-md"
                          : "text-ink/60 hover:bg-orange-50 hover:text-ink"
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
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                      active ? "bg-brand-500 text-white" : "bg-white text-ink/60 border border-orange-100"
                    )}
                  >
                    <Icon size={13} /> {label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
