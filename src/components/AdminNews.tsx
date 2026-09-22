"use client"; // 標記為 Client Component，因為使用了 state 與新增/編輯視窗

import { useState } from "react"; // 匯入 React 的狀態 hook
import { IconPencil, IconTrash } from "./AdminIcons"; // 匯入編輯與刪除圖示
import AdminModal from "./AdminModal"; // 匯入共用的彈出視窗外框
import AdminImageField from "./AdminImageField"; // 匯入圖片上傳欄位元件
import type { NewsItem } from "@/lib/db"; // 匯入新聞資料的型別
import { createNewsAction, deleteNewsAction, updateNewsAction } from "@/app/admin/actions"; // 匯入新聞的 Server Actions
import { tonePresets } from "@/lib/tone-presets"; // 匯入配色預設清單

const inputClass = // 表單輸入框共用樣式
  "w-full rounded-lg border border-line bg-paper-2 px-3 py-2 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-gold/40";
const labelClass = "flex flex-col gap-1 text-[12.5px] font-semibold text-ink-soft"; // 表單欄位標籤共用樣式

type Filter = "all" | "published" | "draft"; // 定義篩選條件
type ModalState = { mode: "add" } | { mode: "edit"; item: NewsItem } | null; // 視窗狀態:關閉、新增、或編輯某一筆

export default function AdminNews({ news }: { news: NewsItem[] }) { // 定義並匯出後台「最新消息」管理元件，資料由父層傳入
  const [filter, setFilter] = useState<Filter>("all"); // 目前選擇的篩選條件，預設全部
  const [modal, setModal] = useState<ModalState>(null); // 目前彈出視窗的狀態
  const visibleRows = news.filter((row) => filter === "all" || row.status === filter); // 依篩選條件過濾出要顯示的列

  const publishedCount = news.filter((r) => r.status === "published").length; // 計算已發布篇數
  const draftCount = news.length - publishedCount; // 計算草稿篇數

  return ( // 回傳整個管理頁面的 JSX
    <div className="flex flex-col gap-5"> {/* 整頁垂直排列容器 */}
      <div className="flex flex-wrap items-end justify-between gap-3"> {/* 標題與新增按鈕的橫向排列列 */}
        <div> {/* 標題與說明文字容器 */}
          <h2 className="font-display text-lg font-bold">最新消息</h2> {/* 區塊標題 */}
          <p className="mt-1 text-[12.5px] text-ink-soft">
            共 {news.length} 篇,{draftCount} 篇草稿待發布。 {/* 顯示總篇數與草稿數量 */}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal({ mode: "add" })} // 點擊開啟新增視窗
          className="rounded-full bg-gold px-4 py-2 text-[13px] font-semibold text-paper hover:bg-gold/90"
        >
          + 新增消息
        </button>
      </div>

      <div className="flex gap-1.5"> {/* 篩選分頁按鈕的橫向排列容器 */}
        <FilterTab label={`全部 ${news.length}`} active={filter === "all"} onClick={() => setFilter("all")} />
        <FilterTab
          label={`已發布 ${publishedCount}`}
          active={filter === "published"}
          onClick={() => setFilter("published")}
        />
        <FilterTab label={`草稿 ${draftCount}`} active={filter === "draft"} onClick={() => setFilter("draft")} />
      </div>

      {visibleRows.length === 0 ? ( // 沒有符合篩選條件的資料時顯示提示文字
        <p className="rounded-xl border border-dashed border-line bg-paper-2 p-6 text-center text-[13px] text-ink-soft">
          目前沒有符合條件的消息。
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-paper-2"> {/* 表格外層容器，寬度不足時可橫向捲動 */}
          <table className="w-full min-w-[640px] border-collapse"> {/* 新聞列表表格，設定最小寬度避免欄位擠壓 */}
            <thead> {/* 表頭區塊 */}
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted"> {/* 表頭列 */}
                <th className="border-b border-line px-4 py-2.5">狀態</th>
                <th className="border-b border-line px-4 py-2.5">標籤</th>
                <th className="border-b border-line px-4 py-2.5">標題</th>
                <th className="border-b border-line px-4 py-2.5">發布資訊</th>
                <th className="border-b border-line px-4 py-2.5 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => ( // 依篩選後的資料逐列渲染表格內容
                <tr
                  key={row._id}
                  className={`text-[13px] hover:bg-paper-3 ${row.status === "draft" ? "bg-paper-3/60" : ""}`}
                >
                  <td className="border-b border-line px-4 py-3.5">
                    {row.status === "draft" ? (
                      <span className="rounded-full border border-dashed border-line bg-paper-3 px-2.5 py-1 text-[11px] font-semibold text-muted">
                        草稿
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#e3efe1] px-2.5 py-1 text-[11px] font-semibold text-[#4c8c5a]">
                        已發布
                      </span>
                    )}
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    <span className="whitespace-nowrap rounded-md bg-gold/10 px-2 py-0.5 text-[11px] text-gold">
                      {row.tag}
                    </span>
                  </td>
                  <td className="max-w-[360px] border-b border-line px-4 py-3.5 font-semibold">
                    {row.title}
                    {row.featured && ( // 有標記為首頁精選報導時顯示小標籤
                      <span className="ml-1.5 rounded-full bg-coral/10 px-1.5 py-0.5 text-[10px] font-semibold text-coral">
                        首頁精選
                      </span>
                    )}
                    <span className="mt-0.5 block truncate text-[11.5px] font-normal text-ink-soft">
                      {row.excerpt}
                    </span>
                  </td>
                  <td className="border-b border-line px-4 py-3.5 text-ink-soft">{row.meta}</td>
                  <td className="border-b border-line px-4 py-3.5">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setModal({ mode: "edit", item: row })} // 點擊開啟編輯視窗，帶入這筆資料
                        className="rounded-md p-1.5 text-ink-soft hover:bg-paper-3 hover:text-ink"
                      >
                        <IconPencil className="h-3.5 w-3.5" />
                      </button>
                      <form
                        action={deleteNewsAction.bind(null, row._id)} // 綁定要刪除的 id
                        onSubmit={(e) => { // 送出前先跳出確認視窗
                          if (!confirm(`確定要刪除「${row.title}」嗎?`)) e.preventDefault();
                        }}
                      >
                        <button type="submit" className="rounded-md p-1.5 text-ink-soft hover:bg-paper-3 hover:text-ink">
                          <IconTrash className="h-3.5 w-3.5" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && ( // 有開啟視窗時才渲染
        <AdminModal title={modal.mode === "add" ? "新增消息" : "編輯消息"} onClose={() => setModal(null)}>
          <form
            action={modal.mode === "add" ? createNewsAction : updateNewsAction.bind(null, modal.item._id)}
            onSubmit={() => setModal(null)} // 送出後立即關閉視窗
            className="flex flex-col gap-3"
          >
            <label className={labelClass}>
              狀態
              <select
                name="status"
                defaultValue={modal.mode === "edit" ? modal.item.status : "draft"}
                className={inputClass}
              >
                <option value="draft">草稿</option>
                <option value="published">已發布</option>
              </select>
            </label>
            <label className={labelClass}>
              分類標籤
              <input name="tag" defaultValue={modal.mode === "edit" ? modal.item.tag : ""} required className={inputClass} />
            </label>
            <label className={labelClass}>
              標題
              <input name="title" defaultValue={modal.mode === "edit" ? modal.item.title : ""} required className={inputClass} />
            </label>
            <label className={labelClass}>
              摘要(顯示在列表與卡片上的簡短說明)
              <textarea
                name="excerpt"
                defaultValue={modal.mode === "edit" ? modal.item.excerpt : ""}
                required
                rows={3}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              內文(文章詳情頁的完整內容,分段請空一行)
              <textarea
                name="content"
                defaultValue={modal.mode === "edit" ? modal.item.content || modal.item.excerpt : ""}
                required
                rows={8}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              發布資訊(顯示於文章下方,如「2026.04.20 · 田徑場邊記事」)
              <input name="meta" defaultValue={modal.mode === "edit" ? modal.item.meta : ""} required className={inputClass} />
            </label>
            <AdminImageField
              srcName="imageSrc"
              altName="imageAlt"
              label="照片(選填,沒有上傳就用下方插圖配色代替)"
              defaultSrc={modal.mode === "edit" ? (modal.item.image?.src ?? "") : ""}
              defaultAlt={modal.mode === "edit" ? (modal.item.image?.alt ?? "") : ""}
            />
            <label className={labelClass}>
              插圖配色(沒有上傳照片時使用)
              <select
                name="tonePreset"
                defaultValue={modal.mode === "edit" ? modal.item.tone.icon : tonePresets[0].id}
                className={inputClass}
              >
                {tonePresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-[12.5px] font-semibold text-ink-soft">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={modal.mode === "edit" ? modal.item.featured : false}
                className="h-4 w-4 rounded border-line accent-gold"
              />
              設為首頁精選報導(同時間只能有一篇,勾選這篇會取消其他篇的精選狀態)
            </label>
            <button type="submit" className="mt-1.5 rounded-full bg-gold px-4 py-2 text-[13px] font-semibold text-paper hover:bg-gold/90">
              儲存
            </button>
          </form>
        </AdminModal>
      )}
    </div>
  );
}

function FilterTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) { // 定義篩選分頁子元件
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold ${
        active ? "border-ink bg-ink text-paper" : "border-line bg-paper-2 text-ink-soft hover:bg-paper-3"
      }`}
    >
      {label}
    </button>
  );
}
