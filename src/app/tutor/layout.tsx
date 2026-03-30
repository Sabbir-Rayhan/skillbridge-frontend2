"use client";
import { useSession } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { LayoutDashboard, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui";

const NAV = [
  { href: "/tutor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tutor/profile", label: "My Profile", icon: User },
];

export default function TutorDashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const user = session?.user as any;

  useEffect(() => {
    if (!isPending && !session) router.push("/login");
    if (!isPending && session && user?.role === "student") router.push("/dashboard");
    if (!isPending && session && user?.role === "admin") router.push("/admin");
  }, [session, isPending, router, user]);

  if (isPending) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full" />
    </div>
  );

  if (!session) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside className="hidden md:block w-52 flex-shrink-0">
            <div className="sticky top-24">
              <div className="card p-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-brand-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-sm truncate">{user?.name}</p>
                    <p className="text-xs text-brand-500 font-semibold capitalize">Tutor</p>
                  </div>
                </div>
              </div>
              <nav className="space-y-1">
                {NAV.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <Link key={href} href={href}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                        active ? "bg-brand-500 text-white shadow-md" : "text-ink/60 hover:bg-orange-50 hover:text-ink"
                      )}
                    >
                      <Icon size={15} /> {label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          <div className="md:hidden w-full mb-6">
            <div className="flex gap-2">
              {NAV.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all border",
                    pathname === href ? "bg-brand-500 text-white border-brand-500" : "bg-white text-ink/60 border-orange-100"
                  )}
                >
                  <Icon size={13} /> {label}
                </Link>
              ))}
            </div>
          </div>

          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
