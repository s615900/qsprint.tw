import type { Metadata } from "next"; // 匯入 Next.js 的 Metadata 型別
import Link from "next/link"; // 匯入頁面導覽連結元件
import { notFound } from "next/navigation"; // 匯入「找不到頁面」的處理函式
import Eyebrow from "@/components/Eyebrow"; // 匯入小標籤元件
import PhotoTile from "@/components/PhotoTile"; // 匯入照片卡片元件
import ArtTile from "@/components/ArtTile"; // 匯入以色塊＋圖示呈現的替代插圖元件
import ParallaxImage from "@/components/ParallaxImage"; // 匯入具視差效果的圖片元件
import { getPublishedNewsById } from "@/lib/db"; // 匯入依 id 讀取單篇已發布新聞的函式

export const dynamic = "force-dynamic"; // 內容來自資料庫，強制每次請求都重新渲染，避免建置時就把資料寫死或需要連上資料庫

export async function generateMetadata({ // 依文章內容動態產生網頁標題與描述
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = await getPublishedNewsById(id);
  if (!article) return { title: "找不到文章" };
  return { title: article.title, description: article.excerpt };
}

export default async function NewsArticlePage({ // 匯出新聞文章詳情頁元件
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getPublishedNewsById(id);
  if (!article) notFound(); // 找不到文章或文章還是草稿，顯示 404

  const paragraphs = (article.content || article.excerpt) // 舊文章沒有內文時，退回顯示摘要
    .split(/\n\s*\n/) // 把內文用空行拆成多個段落
    .map((p) => p.trim())
    .filter(Boolean);

  return ( // 回傳文章詳情頁的畫面結構
    <article className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16"> {/* 文章容器，置中並限制最大寬度 */}
      <Link
        href="/news" // 連回最新消息列表頁
        className="border-b-2 border-transparent text-[0.85rem] font-bold text-coral no-underline transition-colors hover:border-coral"
      >
        ← 回最新消息 {/* 返回列表連結文字 */}
      </Link>

      <div className="mt-6 aspect-[16/9] overflow-hidden rounded-lg"> {/* 文章主圖容器 */}
        <ParallaxImage speed={0.4}> {/* 以 0.4 倍速度做視差效果 */}
          {article.image ? ( // 有上傳照片就用照片，否則用色塊+圖示代替
            <PhotoTile src={article.image.src} alt={article.image.alt} priority />
          ) : (
            <ArtTile toneA={article.tone.a} toneB={article.tone.b} icon={article.tone.icon} />
          )}
        </ParallaxImage>
      </div>

      <Eyebrow className="mt-7">{article.tag}</Eyebrow> {/* 顯示文章分類標籤 */}
      <h1 className="mt-3 font-display text-[2rem] font-bold leading-snug sm:text-[2.5rem]"> {/* 文章標題 */}
        {article.title}
      </h1>
      <p className="mt-3 font-clock text-[0.85rem] tracking-wide text-muted">{article.meta}</p> {/* 發布資訊 */}

      <div className="mt-8 flex flex-col gap-5 text-[1.05rem] leading-relaxed text-ink-soft"> {/* 內文段落容器 */}
        {paragraphs.map((paragraph, index) => ( // 逐段渲染內文
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
