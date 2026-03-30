import Link from "next/link";
import { BookOpen, Star, Users, Award, ArrowRight, Zap, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FeaturedTutors from "@/components/tutor/FeaturedTutors";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-ink hero-diagonal pb-32 pt-20">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-violet/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        {/* Floating chips */}
        <div className="absolute top-16 left-8 hidden lg:flex items-center gap-1 bg-white/10 backdrop-blur-sm text-cream text-xs px-3 py-1.5 rounded-full border border-white/20 animate-bounce-slow">
          <Zap size={10} className="text-brand-400" /> Live sessions available
        </div>
        <div className="absolute top-32 right-16 hidden lg:flex items-center gap-1 bg-accent-lime/20 backdrop-blur-sm text-accent-lime text-xs px-3 py-1.5 rounded-full border border-accent-lime/30">
          <CheckCircle size={10} /> Verified tutors
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 text-sm px-4 py-1.5 rounded-full border border-brand-500/30 mb-6">
              <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
              Expert tutors ready now
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-black text-cream leading-[0.95] mb-6">
              Learn{" "}
              <span className="relative inline-block">
                <span className="text-brand-400">Anything</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8 Q100 2 198 8" stroke="#f97316" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
              {" "}from the{" "}
              <span className="text-accent-lime">Best</span>
            </h1>

            <p className="text-lg text-cream/60 max-w-xl mb-8">
              SkillBridge connects you with hand-picked experts. From coding to music, find your perfect tutor and book a session in minutes.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/tutors" className="btn-primary text-base px-8 py-4 shadow-[0_0_30px_rgba(249,115,22,0.4)]">
                Find a Tutor <ArrowRight size={16} />
              </Link>
              <Link href="/register?role=tutor" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-cream font-display font-semibold rounded-xl transition-all duration-200 border border-white/20">
                Become a Tutor
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-12">
              {[
                { icon: Users, value: "500+", label: "Active Tutors" },
                { icon: BookOpen, value: "2,000+", label: "Sessions Booked" },
                { icon: Star, value: "4.9", label: "Avg Rating" },
                { icon: Award, value: "50+", label: "Subjects" },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-brand-500/20 rounded-lg flex items-center justify-center">
                    <Icon size={14} className="text-brand-400" />
                  </div>
                  <div>
                    <div className="text-cream font-display font-bold text-lg leading-none">{value}</div>
                    <div className="text-cream/40 text-xs">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories strip ── */}
      <section className="bg-brand-500 py-4 overflow-hidden">
        <div className="flex gap-6 animate-ticker">
          {["Mathematics", "Programming", "Physics", "English", "Music", "Design", "Chemistry", "Biology", "History", "Languages", "Mathematics", "Programming", "Physics", "English", "Music", "Design"].map((s, i) => (
            <span key={i} className="flex-shrink-0 text-white/80 text-sm font-display font-semibold uppercase tracking-widest">
              {s} <span className="text-white/30 mx-2">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* ── Featured Tutors ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-500 font-display font-semibold text-sm uppercase tracking-wider mb-1">Top Rated</p>
            <h2 className="section-title">Featured Tutors</h2>
          </div>
          <Link href="/tutors" className="hidden sm:flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <FeaturedTutors />
      </section>

      {/* ── How it works ── */}
      <section className="bg-ink py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-brand-400 font-display font-semibold text-sm uppercase tracking-wider mb-2">Simple Process</p>
            <h2 className="text-4xl font-display font-black text-cream">How SkillBridge Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Find Your Tutor", desc: "Browse hundreds of verified experts. Filter by subject, price, and rating.", color: "bg-brand-500" },
              { step: "02", title: "Book a Session", desc: "Pick a time that works for you and book instantly. No back-and-forth.", color: "bg-accent-lime" },
              { step: "03", title: "Learn & Grow", desc: "Attend your session, get personalised guidance, and leave a review.", color: "bg-accent-violet" },
            ].map(({ step, title, desc, color }) => (
              <div key={step} className="relative bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-brand-500/50 transition-all duration-300 group">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}>
                  <span className="text-ink font-display font-black text-lg">{step}</span>
                </div>
                <h3 className="text-cream font-display font-bold text-xl mb-2">{title}</h3>
                <p className="text-cream/50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative bg-gradient-to-br from-brand-500 to-brand-700 rounded-3xl p-12 overflow-hidden text-center">
          <div className="absolute inset-0 noise-overlay" />
          <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-white/5 rounded-full" />
          <div className="relative z-10">
            <h2 className="text-4xl font-display font-black text-white mb-4">Ready to start learning?</h2>
            <p className="text-white/70 mb-8 max-w-md mx-auto">Join thousands of students who have already found their perfect tutor on SkillBridge.</p>
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-ink text-cream font-display font-bold rounded-2xl hover:scale-105 transition-transform duration-200 shadow-xl">
              Create Free Account <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
