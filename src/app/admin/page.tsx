import AdminShell from "@/components/AdminShell"; // 匯入後台主要版面的 Client Component
import { listHeroSlides, listNews, listSchedule } from "@/lib/db"; // 匯入從 MongoDB 讀取資料的函式

export default async function AdminPage() { // 匯出管理後台頁面(Server Component)，負責從資料庫抓取後台要用的資料
  const [heroSlides, news, schedule] = await Promise.all([ // 平行抓取三種內容，減少等待時間
    listHeroSlides(),
    listNews(),
    listSchedule(),
  ]);

  return <AdminShell heroSlides={heroSlides} news={news} schedule={schedule} />; // 把資料交給 Client Component 渲染
}
