"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { BookOpen, Eye, EyeOff, LogIn } from "lucide-react";
import { Spinner } from "@/components/ui";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn.email({ email, password, callbackURL: "/" });
      if (result.error) throw new Error(result.error.message);
      toast.success("Welcome back!");
      // Redirect based on role after a brief moment
      setTimeout(() => router.push("/"), 300);
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-ink flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-brand-600 to-brand-800 flex-col justify-between p-12">
        <div className="absolute inset-0 noise-overlay" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-ink/20 rounded-full translate-y-1/2 -translate-x-1/2" />

        <Link href="/" className="relative flex items-center gap-2 z-10">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <BookOpen size={18} className="text-white" />
          </div>
          <span className="text-xl font-display font-bold text-white">SkillBridge</span>
        </Link>

        <div className="relative z-10">
          <h2 className="text-5xl font-display font-black text-white leading-tight mb-4">
            Welcome<br />back!
          </h2>
          <p className="text-white/70 text-lg">Your next learning session is just a login away.</p>

          <div className="mt-8 space-y-3">
            {[
              "Access your bookings instantly",
              "Connect with your tutors",
              "Track your learning progress",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/80">
                <div className="w-5 h-5 bg-accent-lime/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-accent-lime rounded-full" />
                </div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-white/30 text-xs">© 2026 SkillBridge</p>
      </div>

      {/* Right panel - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <BookOpen size={14} className="text-white" />
            </div>
            <span className="font-display font-bold text-cream">SkillBridge</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-display font-black text-cream">Sign In</h1>
            <p className="text-cream/40 mt-1">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-cream/70 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-cream placeholder-cream/20 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-cream/70 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-cream placeholder-cream/20 focus:outline-none focus:border-brand-500 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/60"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-display font-bold rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-brand-500/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? <Spinner size={18} /> : <><LogIn size={16} /> Sign In</>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-cream/40">
            Don't have an account?{" "}
            <Link href="/register" className="text-brand-400 hover:text-brand-300 font-semibold">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
