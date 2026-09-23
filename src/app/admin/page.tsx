import AdminShell from "@/components/AdminShell"; // 匯入後台主要版面的 Client Component
import { listHeroSlides, listNews, listSchedule, listPortfolioAlbums } from "@/lib/db"; // 匯入從 MongoDB 讀取資料的函式

// 後台一定要看到最新資料，強制每次請求都重新渲染，避免建置時就把資料寫死或需要連上資料庫
export const dynamic = "force-dynamic";

export default async function AdminPage() { // 匯出管理後台頁面(Server Component)，負責從資料庫抓取後台要用的資料
  const [heroSlides, news, schedule, portfolio] = await Promise.all([ // 平行抓取四種內容，減少等待時間
    listHeroSlides(),
    listNews(),
    listSchedule(),
    listPortfolioAlbums(),
  ]);

  return (
    <AdminShell heroSlides={heroSlides} news={news} schedule={schedule} portfolio={portfolio} /> // 把資料交給 Client Component 渲染
  );
}
