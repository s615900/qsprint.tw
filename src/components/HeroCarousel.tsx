"use client"; // 標記為 Client Component，因為內部使用了 state 與瀏覽器事件

import { useCallback, useEffect, useState } from "react"; // 匯入 React 的 hook：記憶化函式、副作用、狀態
import Link from "next/link"; // 匯入 Next.js 的頁面導覽連結元件
import PhotoTile from "./PhotoTile"; // 匯入圖片顯示元件
import ParallaxImage from "./ParallaxImage"; // 匯入具有視差效果的圖片容器元件
import Eyebrow from "./Eyebrow"; // 匯入小標籤(眉標)元件
import type { HeroSlide } from "@/lib/db"; // 匯入輪播投影片的型別定義(資料來自 MongoDB)

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) { // 定義輪播元件，接收投影片陣列作為 props
  const [index, setIndex] = useState(0); // 目前顯示的投影片索引，預設第 0 張
  const [paused, setPaused] = useState(false); // 是否暫停自動輪播(滑鼠移入時暫停)
  const slide = slides[index]; // 取出目前索引對應的投影片資料

  const go = useCallback( // 建立一個記憶化的函式，用來切換到指定索引的投影片
    (next: number) => setIndex(((next % slides.length) + slides.length) % slides.length), // 用取餘數的方式讓索引在陣列範圍內循環(避免負數或超出範圍)
    [slides.length] // 依賴陣列長度，長度變動時才重新建立函式
  );

  useEffect(() => { // 設定自動輪播的副作用
    if (paused) return; // 若目前處於暫停狀態，不啟動計時器
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // 若使用者偏好減少動態效果，也不啟動自動輪播

    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000); // 每 6 秒自動切換到下一張投影片
    return () => clearInterval(id); // 清除函式：元件卸載或依賴變動時清掉計時器
  }, [paused, slides.length]); // 依賴：暫停狀態、投影片數量

  return ( // 回傳輪播的 JSX 結構
    <div
      className="relative mx-auto grid max-w-6xl items-end gap-8 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12"
      onMouseEnter={() => setPaused(true)} // 滑鼠移入時暫停自動輪播
      onMouseLeave={() => setPaused(false)} // 滑鼠移出時恢復自動輪播
    >
      {/* 左側(桌機版)文字內容區塊，key 使用 index 讓切換投影片時觸發進場動畫 */}
      <div key={index} className="order-2 animate-[fade-in-up_0.5s_ease-out] lg:order-1">
        <Eyebrow>{slide.tag}</Eyebrow> {/* 顯示投影片的分類標籤 */}
        <h1 className="mt-4 max-w-[15ch] font-display text-[2.4rem] font-bold leading-[1.05] tracking-tight sm:text-[3rem] lg:text-[3.75rem]">
          {/* 逐行渲染標題文字，最後一行不加換行 */}
          {slide.titleLines.map((line, i) => (
            <span key={line}>
              {line} {/* 顯示這一行標題文字 */}
              {i < slide.titleLines.length - 1 && <br />} {/* 若不是最後一行，插入換行 */}
            </span>
          ))}
        </h1>
        <p className="mt-5 max-w-[44ch] border-l-2 border-gold pl-4 text-[1rem] text-ink-soft sm:text-[1.1rem]">
          {slide.description} {/* 顯示投影片的描述文字 */}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3 font-clock text-[0.95rem] tracking-wide text-muted">
          <span>{slide.author}</span> {/* 顯示作者 */}
          <span className="text-gold">/</span> {/* 分隔符號 */}
          <span>{slide.date}</span> {/* 顯示日期 */}
          <span className="text-gold">/</span> {/* 分隔符號 */}
          <span>{slide.readTime}</span> {/* 顯示閱讀時間 */}
        </div>
        <Link
          href={slide.ctaHref} // 連結到該投影片指定的目的地路徑
          className="mt-8 inline-flex items-center gap-2 bg-ink px-6 py-3 font-clock text-[1rem] tracking-[0.15em] text-paper transition-colors hover:bg-coral"
        >
          {slide.ctaLabel} {/* 顯示呼籲行動按鈕的文字 */}
        </Link>
      </div>

      {/* 右側(桌機版)圖片與控制按鈕區塊 */}
      <div className="relative order-1 aspect-[5/4] lg:order-2">
        {/* key 使用 index，讓每次切換投影片時圖片重新播放進場動畫 */}
        <div key={index} className="h-full w-full animate-[fade-in-up_0.5s_ease-out]">
          <ParallaxImage speed={0.6}> {/* 以 0.6 倍速度套用視差效果 */}
            <PhotoTile src={slide.image.src} alt={slide.image.alt} priority={index === 0} /> {/* 顯示投影片圖片，第一張優先載入 */}
          </ParallaxImage>
        </div>

        <button
          type="button" // 純按鈕，不觸發表單送出
          aria-label="上一則" // 無障礙標籤:說明按鈕用途
          onClick={() => go(index - 1)} // 點擊切換到上一張投影片
          className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-ink/70 text-paper transition-colors hover:bg-ink"
        >
          ← {/* 左箭頭圖示 */}
        </button>
        <button
          type="button" // 純按鈕，不觸發表單送出
          aria-label="下一則" // 無障礙標籤:說明按鈕用途
          onClick={() => go(index + 1)} // 點擊切換到下一張投影片
          className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-ink/70 text-paper transition-colors hover:bg-ink"
        >
          → {/* 右箭頭圖示 */}
        </button>

        <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-2">
          {/* 依投影片數量渲染對應的分頁指示點 */}
          {slides.map((s, i) => (
            <button
              key={s._id} // 以文件 id 作為 key
              type="button" // 純按鈕，不觸發表單送出
              aria-label={`前往第 ${i + 1} 則`} // 無障礙標籤:說明這是跳到第幾則投影片
              aria-current={i === index} // 標示目前是否為使用中的投影片
              onClick={() => go(i)} // 點擊直接跳到該張投影片
              className={`h-1.5 w-6 transition-colors ${i === index ? "bg-gold" : "bg-paper/60"}`} // 目前投影片用金色，其餘用半透明白色
            />
          ))}
        </div>
      </div>
    </div>
  );
}
