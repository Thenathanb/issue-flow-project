import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/issue-flow-project",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
