"use client"; // 標記為 Client Component，因為要處理縮圖點擊與全螢幕檢視器的開關狀態

import { useCallback, useEffect, useState } from "react"; // 匯入狀態、副作用、記憶化回呼 hook
import Image from "next/image"; // 匯入 Next.js 最佳化圖片元件
import PhotoTile from "./PhotoTile"; // 匯入圖片方塊元件
import type { PortfolioPhoto } from "@/lib/db"; // 匯入相簿照片的型別

export default function AlbumGallery({ photos }: { photos: PortfolioPhoto[] }) { // 相簿照片牆，點照片會開全螢幕檢視器
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // 目前在全螢幕檢視器裡顯示的照片索引；null 代表檢視器關閉

  const showPrev = useCallback(() => { // 切換到上一張(循環到最後一張)
    setActiveIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  }, [photos.length]);
  const showNext = useCallback(() => { // 切換到下一張(循環到第一張)
    setActiveIndex((i) => (i === null ? null : (i + 1) % photos.length));
  }, [photos.length]);

  useEffect(() => { // 檢視器開啟時支援鍵盤操作:左右鍵切換、Esc 關閉
    if (activeIndex === null) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, showPrev, showNext]);

  if (photos.length === 0) { // 這本相簿還沒有任何照片
    return <p className="py-16 text-center text-[0.9rem] text-muted">這本相簿還沒有照片,敬請期待。</p>;
  }

  const active = activeIndex === null ? null : photos[activeIndex];

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"> {/* 照片牆格線容器；照片張數不是欄數倍數時，最後一列會留白而不是黑底 */}
        {photos.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setActiveIndex(index)} // 點擊縮圖開啟全螢幕檢視器，並定位到這張照片
            className="relative aspect-[4/5] overflow-hidden rounded-sm bg-paper-3"
          >
            <PhotoTile src={photo.src} alt={photo.alt || `照片 ${index + 1}`} />
          </button>
        ))}
      </div>

      {active && ( // 檢視器開啟時才渲染全螢幕覆蓋層
        <div
          className="fixed inset-0 z-50 flex flex-col bg-ink/95 px-4 py-6 sm:px-10" // 全螢幕半透明黑底覆蓋層
          onClick={() => setActiveIndex(null)} // 點擊背景關閉檢視器
        >
          <div className="flex items-center justify-between text-paper"> {/* 頂部工具列:張數與關閉按鈕 */}
            <span className="font-clock text-[0.85rem] tracking-widest">
              {activeIndex! + 1} / {photos.length}
            </span>
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              aria-label="關閉"
              className="flex h-9 w-9 items-center justify-center text-2xl leading-none hover:text-coral"
            >
              ×
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center"> {/* 大圖顯示區域 */}
            <div
              className="relative h-full max-h-[80vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()} // 阻止點擊圖片本身時觸發背景的關閉事件
            >
              <Image
                src={active.src}
                alt={active.alt || `照片 ${activeIndex! + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>

            {photos.length > 1 && ( // 超過一張照片才顯示上一張/下一張按鈕
              <>
                <button
                  type="button"
                  aria-label="上一張"
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrev();
                  }}
                  className="absolute left-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-paper/10 text-paper hover:bg-paper/20"
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="下一張"
                  onClick={(e) => {
                    e.stopPropagation();
                    showNext();
                  }}
                  className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-paper/10 text-paper hover:bg-paper/20"
                >
                  →
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
