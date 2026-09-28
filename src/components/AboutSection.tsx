import PhotoTile from "./PhotoTile"; // 匯入照片卡片元件
import ParallaxImage from "./ParallaxImage"; // 匯入具視差效果的圖片元件
import type { AboutPage } from "@/lib/db"; // 匯入關於我們的型別(內容由後台編輯)
import { sanitizeRichText, toRichTextHtml } from "@/lib/rich-text"; // 匯入內文 HTML 轉換與過濾工具

export default function AboutSection({ about }: { about: AboutPage }) { // 匯出「關於我們」區塊元件，內容來自後台
  const contentHtml = sanitizeRichText(toRichTextHtml(about.content)); // 顯示前再過濾一次 HTML

  return ( // 回傳畫面結構
    <section> {/* 區塊最外層容器 */}
      <div
        id="about" // 提供錨點連結使用的 id
        className={`mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16 ${
          about.image ? "grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14" : "max-w-3xl" // 有照片用兩欄，沒照片內文單欄置中
        }`}
      >
        {about.image && (
          <div className="aspect-[4/5] lg:sticky lg:top-28"> {/* 固定長寬比的圖片容器，捲動時停在畫面上 */}
            <ParallaxImage speed={0.5}> {/* 以 0.5 倍速度做視差效果 */}
              <PhotoTile src={about.image.src} alt={about.image.alt} />
            </ParallaxImage>
          </div>
        )}
        <div className="rich-content" dangerouslySetInnerHTML={{ __html: contentHtml }} /> {/* 後台文字編輯器排好的內文 */}
      </div>

      {about.stats.length > 0 && (
        <div className="border-y-2 border-ink bg-ink text-paper"> {/* 統計數據區塊背景容器，上下有邊線 */}
          <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-paper/15 px-5 sm:px-8 md:grid-cols-4"> {/* 手機兩欄、桌機四欄 */}
            {about.stats.map((stat, i) => ( // 走訪統計資料，為每一筆渲染一個項目
              <div key={i} className="px-4 py-8 text-center first:pl-0 sm:text-left">
                <b className="block font-clock text-[2.4rem] leading-none tracking-wide sm:text-[3rem]">{stat.value}</b>
                <span className="mt-2 block text-[0.72rem] tracking-[0.15em] text-paper/60">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
