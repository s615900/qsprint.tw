"use client"; // 標記為 Client Component，因為表單內含圖片上傳與文字編輯器

import Link from "next/link"; // 匯入頁面導覽連結元件
import AdminImageField from "./AdminImageField"; // 匯入圖片上傳欄位元件
import RichTextEditor from "./RichTextEditor"; // 匯入內文文字編輯器
import type { NewsItem } from "@/lib/db"; // 匯入新聞資料的型別
import { createNewsAction, updateNewsAction } from "@/app/admin/actions"; // 匯入新聞的 Server Actions
import { tonePresets } from "@/lib/tone-presets"; // 匯入配色預設清單

const inputClass = // 表單輸入框共用樣式
  "w-full rounded-lg border border-line bg-paper-2 px-3 py-2 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-gold/40";
const labelClass = "flex flex-col gap-1 text-[12.5px] font-semibold text-ink-soft"; // 表單欄位標籤共用樣式
const backHref = "/admin?tab=news"; // 返回後台最新消息列表

export default function AdminNewsForm({ item, initialContent }: { item?: NewsItem; initialContent: string }) {
  // 最新消息新增/編輯整頁表單；有傳 item 代表編輯，沒有代表新增；initialContent 是轉好的內文 HTML
  const editing = Boolean(item);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <form action={item ? updateNewsAction.bind(null, item._id) : createNewsAction}>
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-line bg-paper/90 px-7 py-4 backdrop-blur">
          {/* 頂部列：返回連結、頁面標題、儲存按鈕 */}
          <div className="min-w-0">
            <Link href={backHref} className="text-[12.5px] text-ink-soft hover:text-ink">
              ← 回最新消息列表
            </Link>
            <h1 className="mt-0.5 truncate font-display text-xl font-bold">{editing ? `編輯消息:${item!.title}` : "新增消息"}</h1>
          </div>
          <div className="flex flex-none items-center gap-2">
            <Link href={backHref} className="rounded-full border border-line bg-paper-2 px-4 py-2 text-[13px] font-semibold hover:bg-paper-3">
              取消
            </Link>
            <button type="submit" className="rounded-full bg-gold px-5 py-2 text-[13px] font-semibold text-paper hover:bg-gold/90">
              儲存
            </button>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-6 px-7 py-6 lg:grid-cols-[1fr_300px]">
          {/* 左側主要內容、右側發布設定 */}
          <div className="flex min-w-0 flex-col gap-4">
            <label className={labelClass}>
              標題
              <input name="title" defaultValue={item?.title ?? ""} required className={`${inputClass} text-[15px]`} />
            </label>
            <label className={labelClass}>
              摘要(顯示在列表與卡片上的簡短說明)
              <textarea name="excerpt" defaultValue={item?.excerpt ?? ""} required rows={2} className={inputClass} />
            </label>
            <div className={labelClass}>
              內容
              <RichTextEditor name="content" defaultValue={initialContent} />
            </div>
          </div>

          <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-col gap-3 rounded-xl border border-line bg-paper-2 p-4">
              <label className={labelClass}>
                狀態
                <select name="status" defaultValue={item?.status ?? "draft"} className={inputClass}>
                  <option value="draft">草稿</option>
                  <option value="published">已發布</option>
                </select>
              </label>
              <label className={labelClass}>
                分類標籤
                <input name="tag" defaultValue={item?.tag ?? ""} required className={inputClass} />
              </label>
              <label className={labelClass}>
                發布資訊(如「2026.04.20 · 田徑場邊記事」)
                <input name="meta" defaultValue={item?.meta ?? ""} required className={inputClass} />
              </label>
              <label className="flex items-center gap-2 text-[12.5px] font-semibold text-ink-soft">
                <input type="checkbox" name="featured" defaultChecked={item?.featured ?? false} className="h-4 w-4 rounded border-line accent-gold" />
                設為首頁精選報導
              </label>
              <p className="-mt-1.5 text-[11.5px] text-muted">同時間只能有一篇,勾選這篇會取消其他篇的精選。</p>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-line bg-paper-2 p-4">
              <AdminImageField
                srcName="imageSrc"
                altName="imageAlt"
                label="封面照片(選填)"
                defaultSrc={item?.image?.src ?? ""}
                defaultAlt={item?.image?.alt ?? ""}
              />
              {/* 插圖配色不開放選擇，沿用既有值(新增時用預設第一組)，沒有封面照片時前台仍用它當底圖 */}
              <input type="hidden" name="tonePreset" defaultValue={item?.tone.icon ?? tonePresets[0].id} />
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}
