import dotenv from "dotenv";
import type { NextConfig } from "next";

dotenv.config();

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    return config;
  },
  experimental: {
    turbo: {
      resolveAlias: {
        canvas: "./empty-module.ts",
      },
    },
  },
  images: {
    // eslint-disable-next-line dot-notation
    domains: process.env["IMAGE_HOSTS"]?.split(",") ?? [],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
