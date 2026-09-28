import HeroCarousel from "./HeroCarousel"; // 匯入滿版大圖輪播元件
import type { HeroSlide } from "@/lib/db"; // 匯入首頁輪播圖的型別(資料來自 MongoDB)

export default function Hero({ slides }: { slides: HeroSlide[] }) { // 首頁主視覺區塊，只顯示後台狀態為「顯示」的輪播圖
  if (slides.length === 0) return null; // 沒有可顯示的輪播圖就不渲染這個區塊
  return (
    <section className="border-b-2 border-ink">
      <HeroCarousel slides={slides} />
    </section>
  );
}
