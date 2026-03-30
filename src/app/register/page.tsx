"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { BookOpen, GraduationCap, Briefcase, Eye, EyeOff, UserPlus } from "lucide-react";
import { Spinner } from "@/components/ui";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "tutor">("student");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const result = await signUp.email({
        name,
        email,
        password,
        callbackURL: role === "tutor" ? "/tutor/profile" : "/dashboard",
        // @ts-ignore – better-auth additionalFields
        role,
      });
      if (result.error) throw new Error(result.error.message);
      toast.success("Account created! Welcome to SkillBridge 🎉");
      setTimeout(() => router.push(role === "tutor" ? "/tutor/profile" : "/dashboard"), 300);
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-ink flex">
      {/* Left decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-ink to-[#1c1408] flex-col justify-between p-12 border-r border-white/10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />

        <Link href="/" className="relative flex items-center gap-2 z-10">
          <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
            <BookOpen size={18} className="text-white" />
          </div>
          <span className="text-xl font-display font-bold text-cream">SkillBridge</span>
        </Link>

        <div className="relative z-10 space-y-6">
          <h2 className="text-5xl font-display font-black text-cream leading-tight">
            Join the<br />
            <span className="text-brand-400">learning</span><br />
            revolution.
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {[
              { n: "500+", l: "Expert Tutors" },
              { n: "50+", l: "Subjects" },
              { n: "2k+", l: "Sessions Done" },
              { n: "4.9★", l: "Avg Rating" },
            ].map(({ n, l }) => (
              <div key={l} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="font-display font-black text-2xl text-brand-400">{n}</div>
                <div className="text-cream/40 text-xs mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-cream/20 text-xs">© 2026 SkillBridge</p>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md animate-fade-in">
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <BookOpen size={14} className="text-white" />
            </div>
            <span className="font-display font-bold text-cream">SkillBridge</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-display font-black text-cream">Create Account</h1>
            <p className="text-cream/40 mt-1">Start your learning journey today</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {([
              { value: "student", label: "I'm a Student", sub: "I want to learn", Icon: GraduationCap },
              { value: "tutor", label: "I'm a Tutor", sub: "I want to teach", Icon: Briefcase },
            ] as const).map(({ value, label, sub, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all duration-200",
                  role === value
                    ? "border-brand-500 bg-brand-500/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                )}
              >
                <Icon size={20} className={role === value ? "text-brand-400 mb-2" : "text-cream/30 mb-2"} />
                <div className={cn("font-display font-bold text-sm", role === value ? "text-cream" : "text-cream/50")}>{label}</div>
                <div className={cn("text-xs mt-0.5", role === value ? "text-cream/50" : "text-cream/20")}>{sub}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-cream/70 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-cream placeholder-cream/20 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
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
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-cream placeholder-cream/20 focus:outline-none focus:border-brand-500 transition-colors pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/60">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-display font-bold rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-brand-500/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? <Spinner size={18} /> : <><UserPlus size={16} /> Create {role === "tutor" ? "Tutor" : "Student"} Account</>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-cream/40">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-400 hover:text-brand-300 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
