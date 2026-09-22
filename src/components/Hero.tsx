import HeroCarousel from "./HeroCarousel"; // 匯入主視覺輪播元件
import Parallax from "./Parallax"; // 匯入視差捲動效果元件
import { heroSlides } from "@/lib/content"; // 匯入主視覺輪播的靜態資料

export default function Hero() { // 匯出首頁主視覺區塊元件
  return ( // 回傳畫面結構
    <section className="relative overflow-hidden border-b-2 border-ink py-10 sm:py-14 lg:py-16"> {/* 區塊容器，相對定位並隱藏溢出內容 */}
      <Parallax
        speed={0.15} // 視差捲動速度係數
        className="pointer-events-none absolute -left-4 -top-6 select-none lg:-top-10" // 背景裝飾文字的定位樣式，不可點選/選取
      >
        <span
          aria-hidden="true" // 對輔助技術隱藏，純裝飾用途
          className="block font-clock text-[9rem] leading-none text-ink/[0.06] sm:text-[13rem] lg:text-[16rem]" // 巨大淡色數字的樣式
        >
          0.03 {/* 裝飾用的巨大數字文字 */}
        </span>
      </Parallax>

      <HeroCarousel slides={heroSlides} /> {/* 渲染輪播元件，傳入輪播投影片資料 */}
    </section>
  );
}
