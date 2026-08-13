// next.config.ts
// ─────────────────────────────────────────────────────────────────────────────
// API Proxy: all /api/v1/* calls are forwarded to the Django backend.
// This eliminates CORS issues in development and keeps the API URL consistent.
// ─────────────────────────────────────────────────────────────────────────────

import type { NextConfig } from "next";

const DJANGO_API_URL =
  process.env.DJANGO_API_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  // ─── API Proxy ─────────────────────────────────────────────────────────────
  async rewrites() {
    return [
      {
        // Proxy all /api/v1/* requests to Django backend
        source: "/api/v1/:path*",
        destination: `${DJANGO_API_URL}/api/v1/:path*`,
      },
    ];
  },

  // ─── Images ────────────────────────────────────────────────────────────────
  images: {
    // Allow local images from /public (default) — no external domains needed yet
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
