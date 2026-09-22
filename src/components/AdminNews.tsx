"use client"; // 標記為 Client Component，因為使用了 state

import { useState } from "react"; // 匯入 React 的狀態 hook
import { news } from "@/lib/content"; // 匯入已發布的新聞靜態資料
import { IconPencil, IconTrash } from "./AdminIcons"; // 匯入編輯與刪除圖示

type Status = "published" | "draft"; // 定義文章狀態：已發布 或 草稿
type Filter = "all" | Status; // 定義篩選條件：全部 或 特定狀態

interface AdminNewsRow { // 定義後台新聞列表單一列的資料型別
  status: Status; // 狀態:已發布或草稿
  tag: string; // 分類標籤
  title: string; // 標題
  excerpt: string; // 摘要
  info: string; // 發布相關資訊文字
}

const draftItem: AdminNewsRow = { // 建立一筆固定的草稿範例資料
  status: "draft", // 狀態為草稿
  tag: "賽事公告", // 分類標籤
  title: "新北市中等學校田徑錦標賽・賽前預告", // 標題
  excerpt: "整理選手名單與場地資訊,賽前搶先看。", // 摘要
  info: "預計 2026.09.15 前發布", // 預計發布時間說明
};

const rows: AdminNewsRow[] = [ // 組合成完整的列表資料
  draftItem, // 先放入草稿項目
  ...news.map((item) => ({ // 再展開所有已發布新聞，轉換成統一格式
    status: "published" as const, // 狀態固定為已發布
    tag: item.tag, // 沿用原始分類標籤
    title: item.title, // 沿用原始標題
    excerpt: item.excerpt, // 沿用原始摘要
    info: item.meta, // 將原始 meta 欄位對應到 info
  })),
];

const publishedCount = rows.filter((r) => r.status === "published").length; // 計算已發布篇數
const draftCount = rows.length - publishedCount; // 計算草稿篇數(總數減已發布)

export default function AdminNews() { // 定義並匯出後台「最新消息」管理元件
  const [filter, setFilter] = useState<Filter>("all"); // 目前選擇的篩選條件，預設全部
  const visibleRows = rows.filter((row) => filter === "all" || row.status === filter); // 依篩選條件過濾出要顯示的列

  return ( // 回傳整個管理頁面的 JSX
    <div className="flex flex-col gap-5"> {/* 整頁垂直排列容器 */}
      <div className="flex flex-wrap items-end justify-between gap-3"> {/* 標題與新增按鈕的橫向排列列 */}
        <div> {/* 標題與說明文字容器 */}
          <h2 className="font-display text-lg font-bold">最新消息</h2> {/* 區塊標題 */}
          <p className="mt-1 text-[12.5px] text-ink-soft">
            共 {rows.length} 篇,{draftCount} 篇草稿待發布。 {/* 顯示總篇數與草稿數量 */}
          </p>
        </div>
        <button
          type="button" // 純按鈕，不觸發表單送出
          className="rounded-full bg-gold px-4 py-2 text-[13px] font-semibold text-paper hover:bg-gold/90"
        >
          + 新增消息 {/* 新增按鈕文字 */}
        </button>
      </div>

      <div className="flex gap-1.5"> {/* 篩選分頁按鈕的橫向排列容器 */}
        {/* 篩選分頁：全部 */}
        <FilterTab label={`全部 ${rows.length}`} active={filter === "all"} onClick={() => setFilter("all")} />
        {/* 篩選分頁：已發布 */}
        <FilterTab
          label={`已發布 ${publishedCount}`}
          active={filter === "published"}
          onClick={() => setFilter("published")}
        />
        {/* 篩選分頁：草稿 */}
        <FilterTab label={`草稿 ${draftCount}`} active={filter === "draft"} onClick={() => setFilter("draft")} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-line bg-paper-2"> {/* 表格外層容器，寬度不足時可橫向捲動 */}
        <table className="w-full min-w-[640px] border-collapse"> {/* 新聞列表表格，設定最小寬度避免欄位擠壓 */}
          <thead> {/* 表頭區塊 */}
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted"> {/* 表頭列 */}
              <th className="border-b border-line px-4 py-2.5">狀態</th> {/* 表頭:狀態欄 */}
              <th className="border-b border-line px-4 py-2.5">標籤</th> {/* 表頭:標籤欄 */}
              <th className="border-b border-line px-4 py-2.5">標題</th> {/* 表頭:標題欄 */}
              <th className="border-b border-line px-4 py-2.5">發布資訊</th> {/* 表頭:發布資訊欄 */}
              <th className="border-b border-line px-4 py-2.5 text-right">操作</th> {/* 表頭:操作欄 */}
            </tr>
          </thead>
          <tbody>
            {/* 依篩選後的資料逐列渲染表格內容 */}
            {visibleRows.map((row) => (
              <tr
                key={row.title} // 以標題作為 key
                className={`text-[13px] hover:bg-paper-3 ${row.status === "draft" ? "bg-paper-3/60" : ""}`} // 草稿列套用較淡的背景色
              >
                <td className="border-b border-line px-4 py-3.5"> {/* 狀態欄位 */}
                  {row.status === "draft" ? ( // 依狀態顯示不同樣式的標籤
                    <span className="rounded-full border border-dashed border-line bg-paper-3 px-2.5 py-1 text-[11px] font-semibold text-muted">
                      草稿 {/* 草稿狀態標籤 */}
                    </span>
                  ) : (
                    <span className="rounded-full bg-[#e3efe1] px-2.5 py-1 text-[11px] font-semibold text-[#4c8c5a]">
                      已發布 {/* 已發布狀態標籤 */}
                    </span>
                  )}
                </td>
                <td className="border-b border-line px-4 py-3.5"> {/* 標籤欄位 */}
                  <span className="whitespace-nowrap rounded-md bg-gold/10 px-2 py-0.5 text-[11px] text-gold">
                    {row.tag} {/* 顯示分類標籤文字 */}
                  </span>
                </td>
                <td className="max-w-[360px] border-b border-line px-4 py-3.5 font-semibold"> {/* 標題與摘要欄位 */}
                  {row.title} {/* 顯示標題 */}
                  <span className="mt-0.5 block truncate text-[11.5px] font-normal text-ink-soft">
                    {row.excerpt} {/* 顯示摘要，過長則截斷 */}
                  </span>
                </td>
                <td className="border-b border-line px-4 py-3.5 text-ink-soft">{row.info}</td> {/* 顯示發布資訊 */}
                <td className="border-b border-line px-4 py-3.5"> {/* 操作欄位 */}
                  <div className="flex justify-end gap-1"> {/* 操作按鈕靠右排列 */}
                    <button type="button" className="rounded-md p-1.5 text-ink-soft hover:bg-paper-3 hover:text-ink">
                      <IconPencil className="h-3.5 w-3.5" /> {/* 編輯按鈕圖示 */}
                    </button>
                    <button type="button" className="rounded-md p-1.5 text-ink-soft hover:bg-paper-3 hover:text-ink">
                      <IconTrash className="h-3.5 w-3.5" /> {/* 刪除按鈕圖示 */}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) { // 定義篩選分頁子元件
  return ( // 回傳分頁按鈕的 JSX
    <button
      type="button" // 純按鈕，不觸發表單送出
      onClick={onClick} // 點擊時觸發傳入的回呼函式
      className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold ${
        active ? "border-ink bg-ink text-paper" : "border-line bg-paper-2 text-ink-soft hover:bg-paper-3" // 依是否為目前選中分頁套用不同樣式
      }`}
    >
      {label} {/* 顯示分頁文字 */}
    </button>
  );
}
