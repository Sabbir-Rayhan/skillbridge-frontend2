import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "SkillBridge – Connect with Expert Tutors",
  description: "Find the perfect tutor for any subject. Book sessions instantly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "var(--font-body)",
              background: "#0f0a00",
              color: "#fdf8f0",
              borderRadius: "12px",
              border: "1px solid #f97316",
            },
            success: { iconTheme: { primary: "#c8f135", secondary: "#0f0a00" } },
            error:   { iconTheme: { primary: "#f43f5e", secondary: "#fdf8f0" } },
          }}
        />
      </body>
    </html>
  );
}
