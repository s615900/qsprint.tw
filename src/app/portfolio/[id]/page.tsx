import type { Metadata } from "next"; // 匯入 Next.js 的 Metadata 型別
import Link from "next/link"; // 匯入頁面導覽連結元件
import { notFound } from "next/navigation"; // 匯入「找不到頁面」的處理函式
import Eyebrow from "@/components/Eyebrow"; // 匯入小標籤元件
import AlbumGallery from "@/components/AlbumGallery"; // 匯入相簿照片牆(含全螢幕檢視器)元件
import { formatDate } from "@/lib/admin"; // 匯入日期格式化工具函式
import { getPortfolioAlbumById } from "@/lib/db"; // 匯入依 id 讀取相簿的函式

export const dynamic = "force-dynamic"; // 內容來自資料庫，強制每次請求都重新渲染，避免建置時就把資料寫死或需要連上資料庫

export async function generateMetadata({ // 依相簿內容動態產生網頁標題與描述
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const album = await getPortfolioAlbumById(id);
  if (!album) return { title: "找不到相簿" };
  return { title: album.title, description: `${album.place} · ${formatDate(album.date)}` };
}

export default async function PortfolioAlbumPage({ // 匯出相簿詳情頁元件
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const album = await getPortfolioAlbumById(id);
  if (!album) notFound(); // 找不到這本相簿，顯示 404

  return ( // 回傳相簿詳情頁的畫面結構
    <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16"> {/* 區塊容器，置中並限制最大寬度 */}
      <Link
        href="/portfolio" // 連回作品集列表頁
        className="border-b-2 border-transparent text-[0.85rem] font-bold text-coral no-underline transition-colors hover:border-coral"
      >
        ← 回作品集 {/* 返回列表連結文字 */}
      </Link>

      <div className="mb-8 mt-4 border-b-2 border-ink pb-4"> {/* 相簿標題區塊 */}
        <Eyebrow tone="gold">{album.category}</Eyebrow> {/* 顯示賽事類別 */}
        <h1 className="mt-3 font-display text-[1.8rem] font-bold leading-snug sm:text-[2.3rem]"> {/* 相簿標題 */}
          {album.title}
        </h1>
        <p className="mt-2 font-clock text-[0.85rem] tracking-wide text-muted">
          {album.place} · {formatDate(album.date)} · 共 {album.photos.length} 張照片
        </p>
      </div>

      <AlbumGallery photos={album.photos} /> {/* 相簿照片牆，點照片可開全螢幕檢視器上下切換 */}
    </section>
  );
}
