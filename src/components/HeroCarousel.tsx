"use client"; // 標記為 Client Component，因為內部使用了 state 與瀏覽器事件

import { useCallback, useEffect, useState } from "react"; // 匯入 React 的 hook：記憶化函式、副作用、狀態
import Image from "next/image"; // 匯入 Next.js 最佳化圖片元件
import Link from "next/link"; // 匯入 Next.js 的頁面導覽連結元件
import type { HeroSlide } from "@/lib/db"; // 匯入輪播圖的型別定義(資料來自 MongoDB)

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) { // 滿版大圖輪播，點擊圖片前往後台設定的網址
  const [index, setIndex] = useState(0); // 目前顯示的輪播圖索引
  const [paused, setPaused] = useState(false); // 是否暫停自動輪播(滑鼠移入時暫停)

  const go = useCallback( // 切換到指定索引，超出範圍時循環
    (next: number) => setIndex(((next % slides.length) + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => { // 自動輪播
    if (paused || slides.length < 2) return; // 暫停中或只有一張就不輪播
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // 使用者偏好減少動態效果時不自動輪播

    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000); // 每 6 秒切換下一張
    return () => clearInterval(id);
  }, [paused, slides.length]);

  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden bg-ink sm:aspect-[16/9] lg:aspect-auto lg:h-[min(78vh,760px)]"
      onMouseEnter={() => setPaused(true)} // 滑鼠移入時暫停自動輪播
      onMouseLeave={() => setPaused(false)} // 滑鼠移出時恢復自動輪播
    >
      {slides.map((slide, i) => {
        const external = /^https?:\/\//.test(slide.href); // 外部網址另開新分頁
        const content = ( // 照片加上左下角標題，底部疊深色漸層讓白字在任何照片上都清楚
          <>
            <Image
              src={slide.image.src}
              alt={slide.image.alt}
              fill
              sizes="100vw"
              className="object-cover"
              priority={i === 0} // 第一張優先載入
            />
            {slide.title && (
              <>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/40 via-ink/10 to-transparent" aria-hidden /> {/* 底部漸層遮罩，提高文字對比 */}
                <div className="pointer-events-none absolute inset-x-0 bottom-3 px-3 sm:bottom-4 sm:px-6 lg:px-8">
                  <span className="mb-4 block h-1.5 w-16 bg-gold/75" aria-hidden /> {/* 標題上方的金色短線 */}
                  <h2 className="max-w-[92%] font-display font-bold leading-tight tracking-wide text-paper/75 [text-shadow:0_2px_16px_rgba(0,0,0,0.35)] text-3xl sm:text-5xl lg:text-7xl">
                    {slide.title}
                  </h2>
                </div>
              </>
            )}
          </>
        );
        const layerClass = `absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`; // 目前這張淡入，其餘淡出且不可點
        if (!slide.href) return <div key={slide._id} className={layerClass} aria-hidden={i !== index}>{content}</div>;
        return external ? (
          <a key={slide._id} href={slide.href} target="_blank" rel="noopener noreferrer" className={layerClass} aria-hidden={i !== index} tabIndex={i === index ? 0 : -1}>
            {content}
          </a>
        ) : (
          <Link key={slide._id} href={slide.href} className={layerClass} aria-hidden={i !== index} tabIndex={i === index ? 0 : -1}>
            {content}
          </Link>
        );
      })}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="上一張"
            onClick={() => go(index - 1)}
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-ink/60 text-paper transition-colors hover:bg-ink sm:left-6"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="下一張"
            onClick={() => go(index + 1)}
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-ink/60 text-paper transition-colors hover:bg-ink sm:right-6"
          >
            →
          </button>
          <div className="absolute inset-x-0 bottom-5 z-10 flex justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s._id}
                type="button"
                aria-label={`前往第 ${i + 1} 張`}
                aria-current={i === index}
                onClick={() => go(i)}
                className={`h-1.5 w-7 transition-colors ${i === index ? "bg-gold" : "bg-paper/60 hover:bg-paper"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
