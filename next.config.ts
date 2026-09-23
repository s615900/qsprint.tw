import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb", // 後台圖片上傳走 Server Action，作品集照片單張最大到 20MB，這裡留一點餘裕
    },
  },
};

export default nextConfig;
