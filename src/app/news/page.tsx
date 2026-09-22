import type { Metadata } from "next"; // 匯入 Next.js 的 Metadata 型別，用來定義頁面 SEO 資訊
import NewsSection from "@/components/NewsSection"; // 匯入最新消息區塊元件

export const metadata: Metadata = { // 匯出這個頁面的中繼資料設定
  title: "最新消息", // 網頁標題
  description: "賽場邊的第一手記錄,從起跑到頒獎台,每一篇都是一場比賽的側寫。", // 網頁描述文字
}; // metadata 設定結束

export default function NewsPage() { // 匯出最新消息頁面元件（Next.js App Router 的頁面進入點）
  return <NewsSection />; // 回傳並渲染最新消息區塊元件
} // 結束 NewsPage 元件
