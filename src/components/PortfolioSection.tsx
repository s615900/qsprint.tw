"use client"; // 標記為 Client Component，因為要處理篩選狀態

import { useMemo, useState } from "react"; // 匯入狀態與記憶化 hook
import Link from "next/link"; // 匯入頁面導覽連結元件
import ArtTile from "./ArtTile"; // 匯入純色/圖示風格的相簿封面元件
import PhotoTile from "./PhotoTile"; // 匯入真實照片方塊元件
import { formatDate } from "@/lib/admin"; // 匯入日期格式化工具函式
import type { PortfolioAlbum } from "@/lib/db"; // 匯入相簿的型別(資料來自 MongoDB)

const ALL = "全部"; // 篩選器「不限分類/地點」選項的顯示文字

export default function PortfolioSection({ portfolio }: { portfolio: PortfolioAlbum[] }) { // 定義作品集區塊元件並預設匯出，資料由父層傳入
  const [category, setCategory] = useState(ALL); // 目前選擇的賽事類別篩選
  const [place, setPlace] = useState(ALL); // 目前選擇的地點篩選

  const categories = useMemo( // 從資料中整理出所有出現過的賽事類別，供篩選按鈕使用
    () => [ALL, ...Array.from(new Set(portfolio.map((album) => album.category))).filter(Boolean)],
    [portfolio]
  );
  const places = useMemo( // 從資料中整理出所有出現過的地點，供篩選下拉選單使用
    () => [ALL, ...Array.from(new Set(portfolio.map((album) => album.place))).filter(Boolean)],
    [portfolio]
  );

  const filtered = portfolio.filter(
    (album) => (category === ALL || album.category === category) && (place === ALL || album.place === place)
  ); // 依目前選擇的類別與地點篩選出要顯示的相簿

  return ( // 回傳畫面內容
    <section id="portfolio" className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16"> {/* 作品集區塊，錨點 id 供導覽跳轉 */}
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-ink pb-4"> {/* 標題列容器，含底線 */}
        <h2 className="font-display text-[1.6rem] font-bold sm:text-[2rem] lg:text-[2.3rem]"> {/* 區塊主標題樣式 */}
          作品集精選 {/* 區塊標題文字 */}
        </h2>
        <p className="max-w-[40ch] text-[0.85rem] text-muted"> {/* 區塊說明文字樣式 */}
          每一本相簿都是一場比賽的完整記錄——起跑、交棒、衝線、頒獎。 {/* 區塊說明內容 */}
        </p>
      </div> {/* 結束標題列容器 */}

      <div className="mb-8 flex flex-wrap items-center gap-3"> {/* 篩選器容器 */}
        <div className="flex flex-wrap gap-1.5"> {/* 賽事類別篩選按鈕群 */}
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full border px-3 py-1.5 text-[12.5px] font-semibold ${
                category === c ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink-soft hover:bg-paper-3"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="ml-auto flex items-center gap-2 text-[12.5px] text-ink-soft"> {/* 地點篩選下拉選單，靠右對齊 */}
          地點
          <select
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className="rounded-full border border-line bg-paper px-3 py-1.5 text-[12.5px] focus:outline-none"
          >
            {places.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? ( // 篩選後沒有任何相簿時顯示提示文字
        <p className="py-16 text-center text-[0.9rem] text-muted">沒有符合篩選條件的相簿。</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3"> {/* 相簿封面格線容器 */}
          {filtered.map((album) => { // 走訪篩選後的陣列，逐本渲染一張相簿封面卡片
            const cover = album.photos[0]; // 第一張照片當作封面
            return (
              <Link
                key={album._id}
                href={`/portfolio/${album._id}`} // 連到這本相簿的詳情頁
                className="group block overflow-hidden rounded-lg border border-line bg-paper no-underline"
              >
                <div className="relative aspect-[4/3]"> {/* 封面圖片容器 */}
                  {cover ? (
                    <PhotoTile src={cover.src} alt={cover.alt || album.title} />
                  ) : (
                    <ArtTile toneA={album.tone.a} toneB={album.tone.b} icon={album.tone.icon} />
                  )}
                  <span className="absolute right-2 top-2 rounded-full bg-ink/70 px-2 py-1 text-[10px] font-semibold text-paper">
                    {album.photos.length} 張
                  </span>
                </div>
                <div className="p-3"> {/* 相簿資訊 */}
                  <h3 className="truncate text-[0.95rem] font-bold transition-colors group-hover:text-coral">
                    {album.title}
                  </h3>
                  <p className="mt-1 text-[0.78rem] text-muted">
                    {album.place} · {formatDate(album.date)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section> // 結束作品集區塊
  );
}
