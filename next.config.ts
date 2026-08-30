import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/terms-of-service",
        destination: "/terms",
        statusCode: 301,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
