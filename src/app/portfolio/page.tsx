import type { Metadata } from "next"; // 匯入 Next.js 的 Metadata 型別，用來定義頁面 SEO 資訊
import PortfolioSection from "@/components/PortfolioSection"; // 匯入作品集區塊元件
import { listPortfolio } from "@/lib/db"; // 匯入從 MongoDB 讀取作品集的函式

export const metadata: Metadata = { // 匯出這個頁面的中繼資料設定
  title: "作品集", // 網頁標題
  description: "以新聞現場的節奏整理每一場比賽的關鍵瞬間——起跑、交棒、衝線、頒獎。", // 網頁描述文字
}; // metadata 設定結束

export const dynamic = "force-dynamic"; // 內容來自資料庫，強制每次請求都重新渲染，避免建置時就把資料寫死或需要連上資料庫

export default async function PortfolioPage() { // 匯出作品集頁面元件（Next.js App Router 的頁面進入點）
  const portfolio = await listPortfolio(); // 從資料庫抓取作品集資料
  return <PortfolioSection portfolio={portfolio} />; // 回傳並渲染作品集區塊元件
} // 結束 PortfolioPage 元件
