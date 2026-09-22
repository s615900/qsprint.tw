import type { Metadata } from "next"; // 匯入 Next.js 的 Metadata 型別，用來定義頁面 SEO 資訊
import ScheduleSection from "@/components/ScheduleSection"; // 匯入賽程區塊元件

export const metadata: Metadata = { // 匯出這個頁面的中繼資料設定
  title: "賽事行事曆", // 網頁標題
  description: "青春止秒團隊接下來確定進場拍攝的賽事清單,持續更新中。", // 網頁描述文字
}; // metadata 設定結束

export default function SchedulePage() { // 匯出賽程頁面元件（Next.js App Router 的頁面進入點）
  return <ScheduleSection />; // 回傳並渲染賽程區塊元件
} // 結束 SchedulePage 元件
