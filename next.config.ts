import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Stop the workspace-root warning when multiple lockfiles exist
  outputFileTracingRoot: path.join(__dirname),

  // Don’t fail the production build on ESLint issues
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Keep TS build errors enabled (safer). Set to true only if you must unblock.
  typescript: {
    ignoreBuildErrors: false,
  },

  // 🔹 Add this block to configure Server Actions
  experimental: {
    serverActions: {
      // choose the limit you like: "5mb", "10mb", "20mb", ...
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
