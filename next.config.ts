import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb", // 後台圖片上傳走 Server Action，作品集照片單張最大到 20MB，這裡留一點餘裕
    },
  },
  images: {
    // next/image 預設只允許同網域的圖片，上傳到 R2(或備用的 Vercel Blob)的圖片網域要在這裡列出，
    // 不然圖片網址雖然存好了、資料庫也有，畫面上還是會顯示不出來。
    remotePatterns: [
      { protocol: "https", hostname: "pub-d65bb66034244a72a320d1ec01821cec.r2.dev" }, // Cloudflare R2 公開網址
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" }, // Vercel Blob(備用圖床)
    ],
  },
};

export default nextConfig;
