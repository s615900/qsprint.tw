import Hero from "@/components/Hero"; // 匯入首頁的主視覺 Hero 元件
import ScheduleRibbon from "@/components/ScheduleRibbon"; // 匯入賽事跑馬燈/摘要條元件
import FeaturedSpread from "@/components/FeaturedSpread"; // 匯入精選內容區塊元件
import { listHeroSlides, listSchedule } from "@/lib/db"; // 匯入從 MongoDB 讀取首頁焦點與賽程的函式

export default async function Home() { // 匯出首頁元件(對應路由 "/")
  const [heroSlides, schedule] = await Promise.all([listHeroSlides(), listSchedule()]); // 平行抓取首頁焦點與賽程資料

  return ( // 回傳首頁的畫面結構
    <> {/* 使用 Fragment 包裹多個區塊，不會產生多餘的 DOM 節點 */}
      <Hero slides={heroSlides} /> {/* 渲染主視覺區塊 */}
      <ScheduleRibbon schedule={schedule} /> {/* 渲染賽事跑馬燈區塊 */}
      <FeaturedSpread /> {/* 渲染精選內容區塊 */}
    </>
  );
}
