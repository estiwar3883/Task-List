import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  sw: "sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {}, // <-- Agrega esto para decirle a Next.js 16 que ignore el Webpack del plugin en dev
};

export default withPWA(nextConfig);