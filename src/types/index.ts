export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "student" | "tutor" | "admin";
  status: "active" | "blocked";
  createdAt: string;
  tutorProfile?: TutorProfile;
}

export interface TutorProfile {
  id: string;
  userId: string;
  bio?: string;
  hourlyRate: number;
  experience: number;
  availability?: string;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string; image?: string; email: string };
  categories: Category[];
  reviews: Review[];
  bookings?: Booking[];
}

export interface Category {
  id: string;
  name: string;
}

export interface Booking {
  id: string;
  studentId: string;
  tutorId: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  student?: { name: string; image?: string; email: string };
  tutor?: TutorProfile;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  studentId: string;
  tutorId: string;
  createdAt: string;
  student?: { name: string; image?: string };
}
