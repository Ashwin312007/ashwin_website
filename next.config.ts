import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // @ts-ignore - allowedDevOrigins is needed for development but causes issues in strict build types
  allowedDevOrigins: ['192.168.1.3'],
};

export default nextConfig;
