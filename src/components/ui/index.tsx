"use client";
import { cn, STATUS_COLORS } from "@/lib/utils";
import { Star } from "lucide-react";

// ─── Star Rating ──────────────────────────────────────────
export function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= Math.round(rating) ? "star-filled fill-brand-500" : "star-empty fill-orange-100"}
        />
      ))}
    </div>
  );
}

// ─── Interactive Star Picker ──────────────────────────────
export function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" onClick={() => onChange(s)}>
          <Star
            size={24}
            className={cn(
              "transition-colors cursor-pointer",
              s <= value ? "star-filled fill-brand-500" : "star-empty fill-orange-100 hover:fill-orange-200"
            )}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("badge", STATUS_COLORS[status] || "bg-gray-100 text-gray-700 border-gray-200")}>
      {status}
    </span>
  );
}

// ─── Avatar ───────────────────────────────────────────────
export function Avatar({ name, image, size = "md" }: { name: string; image?: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg" };
  const initials = name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={cn(sizes[size], "rounded-full object-cover border-2 border-orange-100")}
      />
    );
  }

  return (
    <div className={cn(sizes[size], "rounded-full bg-gradient-to-br from-brand-400 to-rose-400 flex items-center justify-center text-white font-bold")}>
      {initials}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}

export function TutorCardSkeleton() {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex gap-3">
        <Skeleton className="w-14 h-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-24 rounded-xl" />
      </div>
    </div>
  );
}

// ─── Loading Spinner ─────────────────────────────────────
export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="animate-spin text-brand-500">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ─── Empty State ──────────────────────────────────────────
export function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4 text-brand-400">
        {icon}
      </div>
      <h3 className="font-display font-bold text-lg text-ink">{title}</h3>
      {description && <p className="text-sm text-ink/50 mt-1 max-w-xs">{description}</p>}
    </div>
  );
}
