"use client"; // 標記這是客戶端元件，因為裡面用到 useState 等瀏覽器端狀態

import { useState } from "react"; // 匯入 React 的狀態 hook
import AdminSidebar, { type AdminSection } from "@/components/AdminSidebar"; // 匯入側邊欄元件與「目前分頁」型別
import AdminTopbar from "@/components/AdminTopbar"; // 匯入頂部標題列元件
import AdminOverview from "@/components/AdminOverview"; // 匯入總覽分頁元件
import AdminHeroSlides from "@/components/AdminHeroSlides"; // 匯入首頁焦點管理分頁元件
import AdminNews from "@/components/AdminNews"; // 匯入最新消息管理分頁元件
import AdminPortfolio from "@/components/AdminPortfolio"; // 匯入作品集管理分頁元件
import AdminSchedule from "@/components/AdminSchedule"; // 匯入賽程管理分頁元件
import AdminSettings from "@/components/AdminSettings"; // 匯入網站設定分頁元件
import type { HeroSlide, NewsItem, ScheduleItem } from "@/lib/db"; // 匯入三種已串接 MongoDB 的內容型別

const sectionMeta: Record<AdminSection, { title: string; subtitle: string }> = { // 定義每個後台分頁對應的標題與副標題文字
  dashboard: { title: "總覽", subtitle: "青春止秒內容總覽與待辦事項" }, // 總覽分頁的標題文字
  hero: { title: "首頁焦點", subtitle: "管理首頁輪播的精選報導順序" }, // 首頁焦點分頁的標題文字
  news: { title: "最新消息", subtitle: "賽事直擊、幕後故事與公告文章" }, // 最新消息分頁的標題文字
  portfolio: { title: "作品集", subtitle: "賽事攝影作品與素材上傳狀態" }, // 作品集分頁的標題文字
  schedule: { title: "賽事行事曆", subtitle: "確定進場拍攝的賽事清單" }, // 賽事行事曆分頁的標題文字
  settings: { title: "網站設定", subtitle: "品牌資訊、社群連結與主選單" }, // 網站設定分頁的標題文字
}; // sectionMeta 物件結束

export default function AdminShell({ // 匯出後台主要版面元件，資料由 Server Component(admin/page.tsx)取得後傳入
  heroSlides,
  news,
  schedule,
}: {
  heroSlides: HeroSlide[];
  news: NewsItem[];
  schedule: ScheduleItem[];
}) {
  const [section, setSection] = useState<AdminSection>("dashboard"); // 目前選中的分頁狀態，預設為總覽
  const meta = sectionMeta[section]; // 依目前分頁取出對應的標題資訊

  return ( // 回傳頁面內容
    <div className="flex min-h-screen bg-paper text-ink"> {/* 整頁外層容器：左右並排、最小高度滿版、套用底色與文字色 */}
      <AdminSidebar
        active={section}
        onSelect={setSection}
        heroCount={heroSlides.length}
        newsCount={news.length}
        scheduleCount={schedule.length}
      /> {/* 側邊欄，傳入目前分頁、切換分頁的函式，與各分類的真實筆數 */}
      <div className="flex min-w-0 flex-1 flex-col"> {/* 右側主要內容區塊：垂直排列，可以收縮不溢出 */}
        <AdminTopbar title={meta.title} subtitle={meta.subtitle} /> {/* 頂部標題列，顯示目前分頁的標題與副標題 */}
        <div className="flex-1 px-7 py-6"> {/* 主要內容區塊，帶左右與上下內距 */}
          {section === "dashboard" && (
            <AdminOverview heroSlides={heroSlides} news={news} schedule={schedule} onNavigate={setSection} />
          )}
          {section === "hero" && <AdminHeroSlides slides={heroSlides} />} {/* 首頁焦點管理，吃真實資料 */}
          {section === "news" && <AdminNews news={news} />} {/* 最新消息管理，吃真實資料 */}
          {section === "portfolio" && <AdminPortfolio />} {/* 作品集仍為介面預覽 */}
          {section === "schedule" && <AdminSchedule schedule={schedule} />} {/* 賽事行事曆管理，吃真實資料 */}
          {section === "settings" && <AdminSettings />} {/* 網站設定仍為介面預覽 */}
        </div> {/* 結束主要內容區塊 */}
      </div> {/* 結束右側主要內容區塊 */}
    </div> // 結束整頁外層容器
  ); // 結束 return
} // 結束 AdminShell 元件
