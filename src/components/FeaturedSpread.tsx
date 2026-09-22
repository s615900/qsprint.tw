import PhotoTile from "./PhotoTile"; // 匯入照片方塊元件
import ArtTile from "./ArtTile"; // 匯入以色塊＋圖示呈現的替代插圖元件
import ParallaxImage from "./ParallaxImage"; // 匯入視差捲動圖片元件
import Eyebrow from "./Eyebrow"; // 匯入小標籤元件
import type { NewsItem } from "@/lib/db"; // 匯入新聞的型別(資料來自 MongoDB)

export default function FeaturedSpread({ article }: { article: NewsItem | null }) { // 定義「精選報導」跨欄元件並預設匯出，內容來自被標記為精選的新聞文章
  if (!article) return null; // 後台還沒指定精選文章時，這個區塊就不顯示

  const paragraph = (article.content || article.excerpt).split(/\n\s*\n/)[0]?.trim() ?? ""; // 只取內文第一段當作跨欄摘要

  return ( // 回傳這個元件要渲染的畫面
    <section className="border-y-2 border-ink bg-paper-3"> {/* 區塊外框：上下有邊框、底色為 paper-3 */}
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_1.15fr] lg:gap-14"> {/* 置中格線容器，桌機切成左右兩欄 */}
        <div className="aspect-[4/3]"> {/* 左側圖片容器，維持 4:3 比例 */}
          <ParallaxImage speed={0.5}> {/* 視差捲動效果，速度設為 0.5 */}
            {article.image ? ( // 有上傳照片就用照片，否則用色塊+圖示代替
              <PhotoTile src={article.image.src} alt={article.image.alt} />
            ) : (
              <ArtTile toneA={article.tone.a} toneB={article.tone.b} icon={article.tone.icon} />
            )}
          </ParallaxImage> {/* 結束視差圖片區塊 */}
        </div> {/* 結束左側圖片容器 */}
        <div> {/* 右側文字內容容器 */}
          <Eyebrow tone="gold">精選報導</Eyebrow> {/* 顯示金色小標籤文字 */}
          <h3 className="mt-4 max-w-[18ch] font-display text-[1.6rem] font-bold italic leading-snug sm:text-[2rem] lg:text-[2.3rem]"> {/* 主標題樣式 */}
            「{article.title}」 {/* 報導主標題文字，取自文章標題 */}
          </h3>
          <p className="mt-5 max-w-[48ch] text-[1.05rem] leading-relaxed text-ink-soft"> {/* 內文段落樣式 */}
            {paragraph} {/* 內文描述文字，取自文章內文第一段 */}
          </p>
          <p className="mt-5 font-clock text-[0.9rem] tracking-widest text-muted"> {/* 底部資訊列樣式，使用等寬字體 */}
            {article.tag} / {article.meta} {/* 分類標籤與發布資訊 */}
          </p>
        </div> {/* 結束右側文字內容容器 */}
      </div> {/* 結束格線容器 */}
    </section> // 結束整個精選報導區塊
  );
}
