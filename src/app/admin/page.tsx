"use client";

import { useState } from "react";
import AdminSidebar, { type AdminSection } from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import AdminOverview from "@/components/AdminOverview";
import AdminHeroSlides from "@/components/AdminHeroSlides";
import AdminNews from "@/components/AdminNews";
import AdminPortfolio from "@/components/AdminPortfolio";
import AdminSchedule from "@/components/AdminSchedule";
import AdminSettings from "@/components/AdminSettings";

const sectionMeta: Record<AdminSection, { title: string; subtitle: string }> = {
  dashboard: { title: "總覽", subtitle: "青春止秒內容總覽與待辦事項" },
  hero: { title: "首頁焦點", subtitle: "管理首頁輪播的精選報導順序" },
  news: { title: "最新消息", subtitle: "賽事直擊、幕後故事與公告文章" },
  portfolio: { title: "作品集", subtitle: "賽事攝影作品與素材上傳狀態" },
  schedule: { title: "賽事行事曆", subtitle: "確定進場拍攝的賽事清單" },
  settings: { title: "網站設定", subtitle: "品牌資訊、社群連結與主選單" },
};

export default function AdminPage() {
  const [section, setSection] = useState<AdminSection>("dashboard");
  const meta = sectionMeta[section];

  return (
    <div className="flex min-h-screen bg-paper text-ink">
      <AdminSidebar active={section} onSelect={setSection} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar title={meta.title} subtitle={meta.subtitle} />
        <div className="flex-1 px-7 py-6">
          {section === "dashboard" && <AdminOverview onNavigate={setSection} />}
          {section === "hero" && <AdminHeroSlides />}
          {section === "news" && <AdminNews />}
          {section === "portfolio" && <AdminPortfolio />}
          {section === "schedule" && <AdminSchedule />}
          {section === "settings" && <AdminSettings />}
        </div>
      </div>
    </div>
  );
}
