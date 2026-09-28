import type { Metadata } from "next"; // 匯入 Next.js 的 Metadata 型別，用來定義頁面 SEO 資訊
import AboutSection from "@/components/AboutSection"; // 匯入關於我們區塊元件
import { getAboutPage } from "@/lib/db"; // 匯入讀取關於我們內容的函式

export const dynamic = "force-dynamic"; // 內容來自資料庫，強制每次請求都重新渲染，避免建置時需要連上資料庫

export const metadata: Metadata = { // 匯出這個頁面的中繼資料設定
  title: "關於我們", // 網頁標題
  description: "如果青春會老,那就讓它在跑道上「止秒」。", // 網頁描述文字
}; // metadata 設定結束

export default async function AboutPage() { // 匯出關於我們頁面元件，內容由後台編輯
  const about = await getAboutPage();
  return <AboutSection about={about} />;
}
