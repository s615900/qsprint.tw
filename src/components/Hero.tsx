import HeroCarousel from "./HeroCarousel"; // 匯入主視覺輪播元件
import Parallax from "./Parallax"; // 匯入視差捲動效果元件
import type { HeroSlide } from "@/lib/db"; // 匯入首頁焦點的型別(資料來自 MongoDB)

export default function Hero({ slides }: { slides: HeroSlide[] }) { // 匯出首頁主視覺區塊元件，投影片資料由父層傳入
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

      {slides.length > 0 && <HeroCarousel slides={slides} />} {/* 有資料才渲染輪播元件 */}
    </section>
  );
}
