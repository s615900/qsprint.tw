import ArtTile from "./ArtTile"; // 匯入純色/圖示風格的作品方塊元件
import PhotoTile from "./PhotoTile"; // 匯入真實照片方塊元件
import { portfolio } from "@/lib/content"; // 匯入作品集靜態資料陣列

export default function PortfolioSection() { // 定義作品集區塊元件並預設匯出
  return ( // 回傳畫面內容
    <section id="portfolio" className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16"> {/* 作品集區塊，錨點 id 供導覽跳轉 */}
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-ink pb-4"> {/* 標題列容器，含底線 */}
        <h2 className="font-display text-[1.6rem] font-bold sm:text-[2rem] lg:text-[2.3rem]"> {/* 區塊主標題樣式 */}
          作品集精選 {/* 區塊標題文字 */}
        </h2>
        <p className="max-w-[40ch] text-[0.85rem] text-muted"> {/* 區塊說明文字樣式 */}
          以新聞現場的節奏整理每一場比賽的關鍵瞬間——起跑、交棒、衝線、頒獎。 {/* 區塊說明內容 */}
        </p>
      </div> {/* 結束標題列容器 */}

      <div className="grid grid-cols-2 gap-px bg-ink sm:grid-cols-3 lg:grid-cols-4"> {/* 響應式格線容器，手機兩欄、平板三欄、桌機四欄 */}
        {portfolio.map((shot, index) => ( // 走訪 portfolio 陣列，逐筆渲染一張作品
          <figure key={shot.caption + shot.date} className="relative aspect-[4/5] overflow-hidden bg-paper"> {/* 單張作品容器，key 用標題+日期組成 */}
            {shot.photo ? ( // 若該筆資料有實際照片路徑
              <PhotoTile src={shot.photo} alt={shot.caption} /> // 顯示真實照片
            ) : ( // 否則
              <ArtTile toneA={shot.tone.a} toneB={shot.tone.b} icon={shot.tone.icon} /> // 顯示純色風格圖示方塊
            )}
            <span className="absolute left-0 top-0 bg-ink px-2 py-1 font-clock text-[0.75rem] tracking-widest text-paper"> {/* 左上角道次標籤樣式 */}
              道 {(index % 8) + 1} {/* 依索引循環顯示道次編號 1~8 */}
            </span>
            <figcaption className="absolute inset-x-0 bottom-0 bg-ink/85 px-3 py-2.5 text-[0.72rem] leading-relaxed text-paper"> {/* 底部說明文字條樣式 */}
              <b className="block text-[0.78rem] font-bold">{shot.caption}</b> {/* 粗體顯示作品標題 */}
              {shot.place} · {shot.date} {/* 顯示地點與日期 */}
            </figcaption>
          </figure>
        ))}
      </div> {/* 結束格線容器 */}
    </section> // 結束作品集區塊
  );
}
