"use client";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { useState } from "react";
import { Menu, X, BookOpen, LogOut, User, LayoutDashboard, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const user = session?.user as any;

  const dashboardHref =
    user?.role === "admin" ? "/admin" :
    user?.role === "tutor" ? "/tutor/dashboard" :
    "/dashboard";

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b-2 border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shadow-md group-hover:rotate-6 transition-transform duration-200">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="text-xl font-display font-bold text-ink">
              Skill<span className="text-brand-500">Bridge</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/tutors" className="btn-ghost text-sm">Browse Tutors</Link>

            {session ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-orange-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user?.name?.split(" ")[0]}</span>
                  <ChevronDown size={14} className={cn("transition-transform", dropOpen && "rotate-180")} />
                </button>
                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border-2 border-orange-100 shadow-xl py-2 animate-pop">
                    <Link
                      href={dashboardHref}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-orange-50 transition-colors"
                      onClick={() => setDropOpen(false)}
                    >
                      <LayoutDashboard size={14} /> Dashboard
                    </Link>
                    <Link
                      href={user?.role === "tutor" ? "/tutor/profile" : "/dashboard/profile"}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-orange-50 transition-colors"
                      onClick={() => setDropOpen(false)}
                    >
                      <User size={14} /> Profile
                    </Link>
                    <hr className="my-1 border-orange-100" />
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link href="/login" className="btn-ghost text-sm">Log In</Link>
                <Link href="/register" className="btn-primary text-sm py-2">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-orange-50"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t-2 border-orange-100 bg-cream animate-slide-up">
          <div className="px-4 py-4 space-y-2">
            <Link href="/tutors" className="block px-4 py-2 rounded-lg hover:bg-orange-50 font-medium" onClick={() => setOpen(false)}>Browse Tutors</Link>
            {session ? (
              <>
                <Link href={dashboardHref} className="block px-4 py-2 rounded-lg hover:bg-orange-50 font-medium" onClick={() => setOpen(false)}>Dashboard</Link>
                <button onClick={handleSignOut} className="w-full text-left px-4 py-2 rounded-lg text-rose-500 hover:bg-rose-50 font-medium">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-2 rounded-lg hover:bg-orange-50 font-medium" onClick={() => setOpen(false)}>Log In</Link>
                <Link href="/register" className="block btn-primary text-center" onClick={() => setOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
