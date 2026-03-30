"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getTutorById, getBookedSlots, createBooking, addReview } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { TutorProfile } from "@/types";
import { Avatar, StarRating, StarPicker, Spinner } from "@/components/ui";
import { calcAvgRating, formatDate, formatTime } from "@/lib/utils";
import { Calendar, Clock, BookOpen, Star, MessageSquare, ChevronLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8am - 7pm

export default function TutorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as any;

  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [bookedSlots, setBookedSlots] = useState<number[]>([]);
  const [booking, setBooking] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);

  // Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    getTutorById(id)
      .then((r) => setTutor(r.data.data))
      .catch(() => toast.error("Failed to load tutor"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (selectedDate && id) {
      getBookedSlots(id, selectedDate)
        .then((r) => setBookedSlots(r.data.data || []))
        .catch(() => {});
    }
  }, [selectedDate, id]);

  const handleBook = async () => {
    if (!session) { router.push("/login"); return; }
    if (!selectedDate || selectedHour === null) { toast.error("Pick a date and time"); return; }

    const start = new Date(selectedDate);
    start.setHours(selectedHour, 0, 0, 0);
    const end = new Date(start);
    end.setHours(selectedHour + 1, 0, 0, 0);

    setBooking(true);
    try {
      await createBooking({ tutorId: id, startTime: start.toISOString(), endTime: end.toISOString() });
      setBookingDone(true);
      toast.success("Session booked successfully!");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Booking failed");
    }
    setBooking(false);
  };

  const handleReview = async () => {
    if (!session) { router.push("/login"); return; }
    setSubmittingReview(true);
    try {
      await addReview({ tutorId: id, rating: reviewRating, comment: reviewComment });
      toast.success("Review submitted!");
      setReviewComment("");
      // Refresh tutor data
      const r = await getTutorById(id);
      setTutor(r.data.data);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to submit review");
    }
    setSubmittingReview(false);
  };

  // Min date = today
  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center py-40"><Spinner size={40} /></div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="text-center py-40">
          <h2 className="font-display font-bold text-2xl mb-4">Tutor not found</h2>
          <Link href="/tutors" className="btn-primary">Browse Tutors</Link>
        </div>
      </div>
    );
  }

  const avg = calcAvgRating(tutor.reviews);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Back */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link href="/tutors" className="inline-flex items-center gap-1 text-sm text-ink/50 hover:text-ink transition-colors">
          <ChevronLeft size={14} /> Back to tutors
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left - Profile */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header card */}
            <div className="card-pop p-8">
              <div className="flex items-start gap-5">
                <Avatar name={tutor.user.name} image={tutor.user.image} size="lg" />
                <div className="flex-1">
                  <h1 className="text-3xl font-display font-black text-ink">{tutor.user.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={Number(avg)} />
                    <span className="text-sm font-semibold text-ink">{avg > 0 ? avg : "New"}</span>
                    <span className="text-sm text-ink/40">({tutor.reviews.length} reviews)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tutor.categories.map((c) => (
                      <span key={c.id} className="text-xs px-3 py-1 bg-orange-50 text-brand-600 rounded-full font-semibold border border-orange-100">
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-display font-black text-brand-600">${tutor.hourlyRate}</div>
                  <div className="text-sm text-ink/40">per hour</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-orange-100">
                <Stat icon={<BookOpen size={16} />} label="Experience" value={`${tutor.experience} years`} />
                <Stat icon={<Star size={16} />} label="Rating" value={avg > 0 ? `${avg}/5.0` : "New"} />
                <Stat icon={<MessageSquare size={16} />} label="Reviews" value={`${tutor.reviews.length}`} />
              </div>
            </div>

            {/* Bio */}
            {tutor.bio && (
              <div className="card p-6">
                <h2 className="font-display font-bold text-xl mb-3">About</h2>
                <p className="text-ink/70 leading-relaxed">{tutor.bio}</p>
              </div>
            )}

            {/* Reviews */}
            <div className="card p-6">
              <h2 className="font-display font-bold text-xl mb-5">Reviews</h2>

              {tutor.reviews.length === 0 ? (
                <p className="text-ink/40 text-sm text-center py-6">No reviews yet. Be the first!</p>
              ) : (
                <div className="space-y-4">
                  {tutor.reviews.map((rev) => (
                    <div key={rev.id} className="flex gap-3 pb-4 border-b border-orange-50 last:border-0">
                      <Avatar name={rev.student?.name || "?"} image={rev.student?.image} size="sm" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">{rev.student?.name || "Student"}</span>
                          <span className="text-xs text-ink/30">{formatDate(rev.createdAt)}</span>
                        </div>
                        <StarRating rating={rev.rating} size={11} />
                        <p className="text-sm text-ink/70 mt-1">{rev.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add review */}
              {session && user?.role === "student" && (
                <div className="mt-6 pt-6 border-t border-orange-100">
                  <h3 className="font-display font-semibold mb-3">Leave a Review</h3>
                  <div className="space-y-3">
                    <StarPicker value={reviewRating} onChange={setReviewRating} />
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience..."
                      rows={3}
                      className="input resize-none"
                    />
                    <button
                      onClick={handleReview}
                      disabled={submittingReview || !reviewComment}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingReview ? <Spinner size={16} /> : "Submit Review"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right - Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {bookingDone ? (
                <div className="card-pop p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-2">Booked!</h3>
                  <p className="text-ink/60 text-sm mb-5">Your session has been scheduled. Check your dashboard for details.</p>
                  <Link href="/dashboard/bookings" className="btn-primary w-full justify-center">View My Bookings</Link>
                </div>
              ) : (
                <div className="card-pop p-6 space-y-5">
                  <div>
                    <h3 className="font-display font-bold text-xl mb-1">Book a Session</h3>
                    <p className="text-sm text-ink/50">Pick your date and time</p>
                  </div>

                  {/* Date picker */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <Calendar size={14} /> Select Date
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={selectedDate}
                      onChange={(e) => { setSelectedDate(e.target.value); setSelectedHour(null); }}
                      className="input"
                    />
                  </div>

                  {/* Time slots */}
                  {selectedDate && (
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                        <Clock size={14} /> Select Time
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {HOURS.map((h) => {
                          const booked = bookedSlots.includes(h);
                          const selected = selectedHour === h;
                          return (
                            <button
                              key={h}
                              disabled={booked}
                              onClick={() => setSelectedHour(h)}
                              className={`py-2 rounded-lg text-xs font-semibold transition-all duration-150 border-2 ${
                                booked
                                  ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through"
                                  : selected
                                  ? "bg-brand-500 text-white border-brand-500 scale-105"
                                  : "bg-white text-ink border-orange-100 hover:border-brand-400"
                              }`}
                            >
                              {h > 12 ? `${h - 12}PM` : h === 12 ? "12PM" : `${h}AM`}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  {selectedDate && selectedHour !== null && (
                    <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                      <p className="text-sm font-semibold text-ink">Session Summary</p>
                      <p className="text-xs text-ink/60 mt-1">{formatDate(selectedDate)} · {selectedHour > 12 ? `${selectedHour - 12}:00 PM` : `${selectedHour}:00 AM`}</p>
                      <div className="flex justify-between mt-2 pt-2 border-t border-orange-200">
                        <span className="text-xs text-ink/60">1 hour session</span>
                        <span className="text-sm font-bold text-brand-600">${tutor.hourlyRate}</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleBook}
                    disabled={booking || !selectedDate || selectedHour === null}
                    className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {booking ? <Spinner size={16} /> : "Confirm Booking"}
                  </button>

                  {!session && (
                    <p className="text-xs text-center text-ink/40">
                      <Link href="/login" className="text-brand-600 hover:underline">Log in</Link> to book a session
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-brand-500">{icon}</div>
      <div>
        <p className="text-xs text-ink/40">{label}</p>
        <p className="text-sm font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
}
