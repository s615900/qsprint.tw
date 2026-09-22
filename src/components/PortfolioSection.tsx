"use client"; // 標記為 Client Component，因為要處理篩選狀態

import { useMemo, useState } from "react"; // 匯入狀態與記憶化 hook
import ArtTile from "./ArtTile"; // 匯入純色/圖示風格的作品方塊元件
import PhotoTile from "./PhotoTile"; // 匯入真實照片方塊元件
import { formatDate } from "@/lib/admin"; // 匯入日期格式化工具函式
import type { PortfolioItem } from "@/lib/db"; // 匯入作品集的型別(資料來自 MongoDB)

const ALL = "全部"; // 篩選器「不限分類/地點」選項的顯示文字

export default function PortfolioSection({ portfolio }: { portfolio: PortfolioItem[] }) { // 定義作品集區塊元件並預設匯出，資料由父層傳入
  const [category, setCategory] = useState(ALL); // 目前選擇的賽事類別篩選
  const [place, setPlace] = useState(ALL); // 目前選擇的地點篩選

  const categories = useMemo( // 從資料中整理出所有出現過的賽事類別，供篩選按鈕使用
    () => [ALL, ...Array.from(new Set(portfolio.map((shot) => shot.category))).filter(Boolean)],
    [portfolio]
  );
  const places = useMemo( // 從資料中整理出所有出現過的地點，供篩選下拉選單使用
    () => [ALL, ...Array.from(new Set(portfolio.map((shot) => shot.place))).filter(Boolean)],
    [portfolio]
  );

  const filtered = portfolio.filter(
    (shot) => (category === ALL || shot.category === category) && (place === ALL || shot.place === place)
  ); // 依目前選擇的類別與地點篩選出要顯示的作品

  return ( // 回傳畫面內容
    <section id="portfolio" className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16"> {/* 作品集區塊，錨點 id 供導覽跳轉 */}
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-ink pb-4"> {/* 標題列容器，含底線 */}
        <h2 className="font-display text-[1.6rem] font-bold sm:text-[2rem] lg:text-[2.3rem]"> {/* 區塊主標題樣式 */}
          作品集精選 {/* 區塊標題文字 */}
        </h2>
        <p className="max-w-[40ch] text-[0.85rem] text-muted"> {/* 區塊說明文字樣式 */}
          以新聞現場的節奏整理每一場比賽的關鍵瞬間——起跑、交棒、衝線、頒獎。 {/* 區塊說明內容 */}
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

      {filtered.length === 0 ? ( // 篩選後沒有任何作品時顯示提示文字
        <p className="py-16 text-center text-[0.9rem] text-muted">沒有符合篩選條件的作品。</p>
      ) : (
        <div className="grid grid-cols-2 gap-px bg-ink sm:grid-cols-3 lg:grid-cols-4"> {/* 響應式格線容器，手機兩欄、平板三欄、桌機四欄 */}
          {filtered.map((shot, index) => ( // 走訪篩選後的陣列，逐筆渲染一張作品
            <figure key={shot._id} className="relative aspect-[4/5] overflow-hidden bg-paper"> {/* 單張作品容器 */}
              {shot.photo ? ( // 若該筆資料有實際照片
                <PhotoTile src={shot.photo.src} alt={shot.photo.alt} /> // 顯示真實照片
              ) : ( // 否則
                <ArtTile toneA={shot.tone.a} toneB={shot.tone.b} icon={shot.tone.icon} /> // 顯示純色風格圖示方塊
              )}
              <span className="absolute left-0 top-0 bg-ink px-2 py-1 font-clock text-[0.75rem] tracking-widest text-paper"> {/* 左上角道次標籤樣式 */}
                道 {(index % 8) + 1} {/* 依索引循環顯示道次編號 1~8 */}
              </span>
              <figcaption className="absolute inset-x-0 bottom-0 bg-ink/85 px-3 py-2.5 text-[0.72rem] leading-relaxed text-paper"> {/* 底部說明文字條樣式 */}
                <b className="block text-[0.78rem] font-bold">{shot.caption}</b> {/* 粗體顯示作品標題 */}
                {shot.place} · {formatDate(shot.date)} {/* 顯示地點與日期 */}
              </figcaption>
            </figure>
          ))}
        </div> // 結束格線容器
      )}
    </section> // 結束作品集區塊
  );
}
