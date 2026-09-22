import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // 後台圖片上傳走 Server Action，預設 1MB 上限不夠放照片，調高到 10MB
    },
  },
};

export default nextConfig;
