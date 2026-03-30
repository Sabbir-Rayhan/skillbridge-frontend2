"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getTutors } from "@/lib/api";
import { TutorProfile } from "@/types";
import { Avatar, StarRating, TutorCardSkeleton } from "@/components/ui";
import { calcAvgRating } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function FeaturedTutors() {
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTutors()
      .then((r) => setTutors(r.data.data?.slice(0, 6) || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => <TutorCardSkeleton key={i} />)}
      </div>
    );
  }

  if (!tutors.length) {
    return (
      <div className="text-center py-12 text-ink/40">
        <p>No tutors available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tutors.map((tutor, i) => (
        <TutorCard key={tutor.id} tutor={tutor} index={i} />
      ))}
    </div>
  );
}

function TutorCard({ tutor, index }: { tutor: TutorProfile; index: number }) {
  const avg = calcAvgRating(tutor.reviews);

  return (
    <div
      className="card-pop p-5 animate-slide-up"
      style={{ animationDelay: `${index * 0.08}s`, opacity: 0 }}
    >
      <div className="flex items-start gap-3 mb-3">
        <Avatar name={tutor.user.name} image={tutor.user.image} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-ink truncate">{tutor.user.name}</h3>
          <div className="flex items-center gap-1 mt-0.5">
            <StarRating rating={Number(avg)} size={12} />
            <span className="text-xs text-ink/50">({tutor.reviews.length})</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-display font-bold text-brand-600">${tutor.hourlyRate}</div>
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
          <span className="text-xs px-2.5 py-0.5 bg-orange-50 text-ink/40 rounded-full">
            +{tutor.categories.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-ink/40">{tutor.experience} yr{tutor.experience !== 1 ? "s" : ""} exp</span>
        <Link
          href={`/tutors/${tutor.id}`}
          className="flex items-center gap-1 text-sm font-display font-semibold text-brand-600 hover:text-brand-700 transition-colors"
        >
          View Profile <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
