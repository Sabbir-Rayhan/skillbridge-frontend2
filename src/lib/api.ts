import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

// ─── Tutors ──────────────────────────────────────────────
export const getTutors = (params?: { searchTerm?: string; category?: string }) =>
  api.get("/tutors", { params });

export const getTutorById = (id: string) => api.get(`/tutors/${id}`);
export const getCategories = () => api.get("/tutors/categories");
export const getBookedSlots = (tutorId: string, date: string) =>
  api.get(`/tutors/${tutorId}/booked-slots`, { params: { date } });

// ─── Tutor Management ────────────────────────────────────
export const getMyTutorProfile = () => api.get("/tutors/profile");
export const upsertTutorProfile = (data: any) => api.post("/tutors/profile", data);
export const getTutorDashboardStats = () => api.get("/tutors/dashboard-stats");

// ─── Bookings ────────────────────────────────────────────
export const createBooking = (data: { tutorId: string; startTime: string; endTime: string }) =>
  api.post("/bookings", data);
export const getMyBookings = () => api.get("/bookings/my-bookings");
export const getTutorBookings = () => api.get("/bookings/tutor");
export const updateBookingStatus = (id: string, status: string) =>
  api.patch(`/bookings/${id}`, { status });

// ─── Reviews ─────────────────────────────────────────────
export const addReview = (data: { tutorId: string; rating: number; comment: string }) =>
  api.post("/reviews", data);
export const getTutorReviews = (tutorId: string) => api.get(`/reviews/${tutorId}`);

// ─── User ─────────────────────────────────────────────────
export const getMe = () => api.get("/users/me");
export const updateMyProfile = (data: { name?: string; image?: string }) =>
  api.patch("/users/me", data);

// ─── Admin ───────────────────────────────────────────────
export const adminGetUsers = () => api.get("/admin/users");
export const adminToggleUserStatus = (userId: string, status: string) =>
  api.patch(`/admin/users/${userId}/status`, { status });
export const adminGetBookings = () => api.get("/admin/bookings");
export const adminGetStats = () => api.get("/admin/stats");
export const adminCreateCategory = (name: string) => api.post("/admin/categories", { name });
export const adminGetCategories = () => api.get("/admin/categories");
