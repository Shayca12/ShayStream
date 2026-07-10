import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // מייצר חבילה עצמאית מינימלית (server.js + רק התלויות הנחוצות) — אידיאלי ל-Docker.
  output: 'standalone',
};

export default nextConfig;
