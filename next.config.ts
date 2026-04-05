import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "preview-chat-29723604-2506-4a02-b075-a0db14a0f6bf.space.z.ai",
  ],
};

export default nextConfig;
