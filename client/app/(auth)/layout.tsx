// app/(auth)/layout.tsx
// Full-page image background layout — all auth pages share this.

import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sign In — Hospital Management System",
  description: "Sign in to the Hospital Management System staff portal.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Full-viewport container with the BG image
    <div className="relative min-h-screen w-full flex items-center justify-center">
      {/* ── Background image (Next.js optimised) ───────────────────────── */}
      <Image
        src="/images/auth-images/loginimage.jpg"
        alt="Hospital Management System"
        fill
        priority
        quality={85}
        className="object-cover"
        sizes="100vw"
      />

      {/* ── Dark overlay for readability ───────────────────────────────── */}
      <div className="absolute inset-0 bg-black/50" />

      {/* ── Centered content (glassmorphism card) ─────────────────────── */}
      <div className="relative z-10 w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}
