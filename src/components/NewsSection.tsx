import ArtTile from "./ArtTile"; // 匯入以色塊＋圖示呈現的替代插圖元件
import PhotoTile from "./PhotoTile"; // 匯入照片卡片元件
import ParallaxImage from "./ParallaxImage"; // 匯入具視差效果的圖片元件
import Eyebrow from "./Eyebrow"; // 匯入小標籤元件
import { news } from "@/lib/content"; // 匯入新聞資料的靜態陣列

export default function NewsSection() { // 匯出「最新消息」區塊元件
  const [lead, ...rest] = news; // 解構出第一則新聞當作頭條，其餘放進 rest 陣列

  return ( // 回傳畫面結構
    <section id="news" className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16"> {/* 區塊容器，提供錨點 id */}
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-ink pb-4"> {/* 標題列容器 */}
        <h2 className="font-display text-[1.6rem] font-bold sm:text-[2rem] lg:text-[2.3rem]"> {/* 區塊主標題樣式 */}
          最新消息 {/* 主標題文字 */}
        </h2>
        <p className="max-w-[40ch] text-[0.85rem] text-muted"> {/* 區塊說明文字樣式 */}
          賽場邊的第一手記錄,從起跑到頒獎台,每一篇都是一場比賽的側寫。 {/* 說明文字內容 */}
        </p>
      </div>

      {/* Lead story */}
      <article className="group grid gap-6 border-b border-line pb-10 sm:grid-cols-[0.9fr_1.1fr] sm:gap-10"> {/* 頭條新聞容器，桌機分兩欄 */}
        <div className="aspect-[4/3] sm:aspect-auto"> {/* 頭條圖片容器 */}
          <ParallaxImage speed={0.5}> {/* 以 0.5 倍速度做視差效果 */}
            <PhotoTile
              src="/images/track-05-finish-line.jpg" // 頭條圖片來源路徑
              alt="大隊接力選手在交接區內全力衝刺" // 頭條圖片替代文字
            />
          </ParallaxImage>
        </div>
        <div className="flex flex-col justify-center gap-3"> {/* 頭條文字內容容器 */}
          <span className="font-clock text-[0.85rem] tracking-widest text-muted">01</span> {/* 頭條序號固定顯示 01 */}
          <Eyebrow>{lead.tag}</Eyebrow> {/* 顯示頭條分類標籤 */}
          <h3 className="font-display text-[1.5rem] font-bold leading-snug sm:text-[1.9rem]"> {/* 頭條標題樣式 */}
            <a href="#" className="no-underline transition-colors group-hover:text-coral"> {/* 頭條標題連結，hover 變色 */}
              {lead.title} {/* 頭條標題文字 */}
            </a>
          </h3>
          <p className="max-w-[52ch] text-ink-soft">{lead.excerpt}</p> {/* 頭條摘要文字 */}
          <p className="font-clock text-[0.85rem] tracking-wide text-muted">{lead.meta}</p> {/* 頭條日期/分類等中繼資訊 */}
        </div>
      </article>

      {/* Remaining dispatches */}
      <div className="divide-y divide-line"> {/* 其餘新聞清單容器，項目間有分隔線 */}
        {rest.map((item, index) => ( // 走訪除了頭條以外的其餘新聞，並取得索引值
          <article
            key={item.title} // 以新聞標題作為 key
            className="group grid grid-cols-[auto_1fr] items-start gap-5 py-7 sm:grid-cols-[3.5rem_10rem_1fr]" // 單則新聞的格線排版樣式
          >
            <span className="font-clock text-[1.6rem] leading-none text-ink/25"> {/* 序號顯示樣式 */}
              {String(index + 2).padStart(2, "0")} {/* 因為頭條是 01，這裡從 02 開始編號並補零成兩位數 */}
            </span>
            <div className="col-span-2 aspect-[16/10] sm:col-span-1"> {/* 替代插圖容器 */}
              <ArtTile toneA={item.tone.a} toneB={item.tone.b} icon={item.tone.icon} /> {/* 渲染以色調與圖示組成的插圖 */}
            </div>
            <div className="col-span-2 flex flex-col gap-2 sm:col-span-1"> {/* 文字內容容器 */}
              <Eyebrow>{item.tag}</Eyebrow> {/* 顯示分類標籤 */}
              <h3 className="text-[1.1rem] font-bold leading-snug"> {/* 新聞標題樣式 */}
                <a href="#" className="no-underline transition-colors group-hover:text-coral"> {/* 新聞標題連結 */}
                  {item.title} {/* 新聞標題文字 */}
                </a>
              </h3>
              <p className="text-[0.86rem] text-ink-soft">{item.excerpt}</p> {/* 新聞摘要文字 */}
              <p className="font-clock text-[0.8rem] tracking-wide text-muted">{item.meta}</p> {/* 新聞日期/分類等中繼資訊 */}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
