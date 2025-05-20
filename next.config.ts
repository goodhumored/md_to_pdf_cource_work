import dotenv from "dotenv";
import type { NextConfig } from "next";

dotenv.config();

const nextConfig: NextConfig = {
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
