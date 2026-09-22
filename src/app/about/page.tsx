import type { Metadata } from "next"; // 匯入 Next.js 的 Metadata 型別，用來定義頁面 SEO 資訊
import AboutSection from "@/components/AboutSection"; // 匯入關於我們區塊元件

export const metadata: Metadata = { // 匯出這個頁面的中繼資料設定
  title: "關於我們", // 網頁標題
  description: "如果青春會老,那就讓它在跑道上「止秒」。", // 網頁描述文字
}; // metadata 設定結束

export default function AboutPage() { // 匯出關於我們頁面元件（Next.js App Router 的頁面進入點）
  return <AboutSection />; // 回傳並渲染關於我們區塊元件
} // 結束 AboutPage 元件
