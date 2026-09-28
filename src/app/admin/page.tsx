import AdminShell from "@/components/AdminShell"; // 匯入後台主要版面的 Client Component
import { adminSections, type AdminSection } from "@/components/AdminSidebar"; // 匯入後台分頁清單，用來驗證網址上的 tab
import { listHeroSlides, listNews, listSchedule, listPortfolioAlbums, getAboutPage } from "@/lib/db"; // 匯入從 MongoDB 讀取資料的函式

// 後台一定要看到最新資料，強制每次請求都重新渲染，避免建置時就把資料寫死或需要連上資料庫
export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string | string[] }> }) { // 匯出管理後台頁面(Server Component)，負責從資料庫抓取後台要用的資料
  const [heroSlides, news, schedule, portfolio, about] = await Promise.all([ // 平行抓取各種內容，減少等待時間
    listHeroSlides(),
    listNews(),
    listSchedule(),
    listPortfolioAlbums(),
    getAboutPage(),
  ]);
  const { tab } = await searchParams; // 讀取網址上的 ?tab=，重新整理後維持原本的分頁
  const initialSection: AdminSection = adminSections.find((s) => s === tab) ?? "hero"; // 無效或沒有 tab 時預設首頁焦點

  return (
    <AdminShell initialSection={initialSection} heroSlides={heroSlides} news={news} schedule={schedule} portfolio={portfolio} about={about} /> // 把資料交給 Client Component 渲染
  );
}
