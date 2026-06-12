import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/issue-flow-project",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  trailingSlash: true,
};

export default nextConfig;
