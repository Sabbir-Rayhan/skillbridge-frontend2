"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getTutors, getCategories } from "@/lib/api";
import { TutorProfile, Category } from "@/types";
import { Avatar, StarRating, TutorCardSkeleton } from "@/components/ui";
import { calcAvgRating } from "@/lib/utils";
import { Search, SlidersHorizontal, X, ArrowRight } from "lucide-react";

export default function TutorsPage() {
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const fetchTutors = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.searchTerm = search;
      if (activeCategory !== "All") params.category = activeCategory;
      const res = await getTutors(params);
      setTutors(res.data.data || []);
    } catch {}
    setLoading(false);
  }, [search, activeCategory]);

  useEffect(() => { fetchTutors(); }, [fetchTutors]);

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data.data || [])).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <div className="bg-ink py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-400 font-display font-semibold text-sm uppercase tracking-wider mb-2">Discover</p>
          <h1 className="text-5xl font-display font-black text-cream mb-6">Find Your Tutor</h1>

          {/* Search bar */}
          <div className="flex gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30" />
              <input
                type="text"
                placeholder="Search by name, subject, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-cream placeholder-cream/30 focus:outline-none focus:border-brand-500 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream">
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-cream hover:bg-white/20 transition-colors"
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>
        </div>
      </div>

      {/* Category chips */}
      <div className="sticky top-16 z-30 bg-cream border-b border-orange-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setActiveCategory("All")}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 border-2 ${
                activeCategory === "All"
                  ? "bg-ink text-cream border-ink"
                  : "bg-white text-ink border-orange-100 hover:border-ink"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.name ? "All" : cat.name)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 border-2 ${
                  activeCategory === cat.name
                    ? "bg-brand-500 text-white border-brand-500"
                    : "bg-white text-ink border-orange-100 hover:border-brand-300"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Results count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-ink/50">
            {loading ? "Searching..." : `${tutors.length} tutor${tutors.length !== 1 ? "s" : ""} found`}
            {activeCategory !== "All" && <span className="ml-1">in <strong className="text-ink">{activeCategory}</strong></span>}
          </p>
          {(search || activeCategory !== "All") && (
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => <TutorCardSkeleton key={i} />)}
          </div>
        ) : tutors.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-brand-300" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2">No tutors found</h3>
            <p className="text-ink/50 text-sm">Try a different search term or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor, i) => (
              <TutorListCard key={tutor.id} tutor={tutor} index={i} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function TutorListCard({ tutor, index }: { tutor: TutorProfile; index: number }) {
  const avg = calcAvgRating(tutor.reviews);

  return (
    <div
      className="card group p-5 animate-slide-up"
      style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s`, opacity: 0 }}
    >
      <div className="flex items-start gap-3 mb-3">
        <Avatar name={tutor.user.name} image={tutor.user.image} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-ink truncate group-hover:text-brand-600 transition-colors">{tutor.user.name}</h3>
          <div className="flex items-center gap-1 mt-0.5">
            <StarRating rating={Number(avg)} size={11} />
            <span className="text-xs text-ink/40">
              {avg > 0 ? `${avg} (${tutor.reviews.length})` : "New"}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-display font-bold text-brand-600 text-lg">${tutor.hourlyRate}</div>
          <div className="text-xs text-ink/40">/hr</div>
        </div>
      </div>

      {tutor.bio && (
        <p className="text-sm text-ink/60 line-clamp-2 mb-3">{tutor.bio}</p>
      )}

      <div className="flex flex-wrap gap-1.5 mb-4">
        {tutor.categories.slice(0, 3).map((c) => (
          <span key={c.id} className="text-xs px-2.5 py-0.5 bg-orange-50 text-brand-600 rounded-full font-medium border border-orange-100">
            {c.name}
          </span>
        ))}
        {tutor.categories.length > 3 && (
          <span className="text-xs px-2.5 py-0.5 text-ink/30">+{tutor.categories.length - 3}</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-orange-50">
        <span className="text-xs text-ink/40">{tutor.experience} yr{tutor.experience !== 1 ? "s" : ""} experience</span>
        <Link
          href={`/tutors/${tutor.id}`}
          className="flex items-center gap-1 text-sm font-display font-semibold px-3 py-1.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
        >
          Book Now <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
