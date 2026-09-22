"use client"; // 標記為 Client Component，因為要處理新增/編輯視窗的開關狀態

import { useState } from "react"; // 匯入狀態 hook
import ArtTile from "./ArtTile"; // 匯入無實際照片時的色卡佔位元件
import PhotoTile from "./PhotoTile"; // 匯入實際照片顯示元件
import AdminModal from "./AdminModal"; // 匯入共用的彈出視窗外框
import AdminImageField from "./AdminImageField"; // 匯入圖片上傳欄位元件
import { IconCheck, IconPencil, IconTrash } from "./AdminIcons"; // 匯入打勾、編輯、刪除圖示
import { formatDate } from "@/lib/admin"; // 匯入日期格式化工具函式
import type { PortfolioItem } from "@/lib/db"; // 匯入作品集的型別
import { createPortfolioAction, deletePortfolioAction, updatePortfolioAction } from "@/app/admin/actions"; // 匯入作品集的 Server Actions
import { tonePresets } from "@/lib/tone-presets"; // 匯入配色預設清單

const inputClass = // 表單輸入框共用樣式
  "w-full rounded-lg border border-line bg-paper-2 px-3 py-2 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-gold/40";
const labelClass = "flex flex-col gap-1 text-[12.5px] font-semibold text-ink-soft"; // 表單欄位標籤共用樣式

type ModalState = { mode: "add" } | { mode: "edit"; item: PortfolioItem } | null; // 視窗狀態:關閉、新增、或編輯某一筆

export default function AdminPortfolio({ portfolio }: { portfolio: PortfolioItem[] }) { // 後台「作品集」管理頁面元件，資料由父層傳入
  const [modal, setModal] = useState<ModalState>(null); // 目前彈出視窗的狀態
  const uploadedCount = portfolio.filter((shot) => shot.photo).length; // 計算已上傳實際照片的數量

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold">作品集</h2>
          <p className="mt-1 text-[12.5px] text-ink-soft">
            {portfolio.length} 張作品,其中 {uploadedCount} 張已上傳實際照片,其餘暫以色卡佔位。
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal({ mode: "add" })} // 點擊開啟新增視窗
          className="rounded-full bg-gold px-4 py-2 text-[13px] font-semibold text-paper hover:bg-gold/90"
        >
          + 新增作品
        </button>
      </div>

      {portfolio.length === 0 ? ( // 沒有任何資料時顯示提示文字
        <p className="rounded-xl border border-dashed border-line bg-paper-2 p-6 text-center text-[13px] text-ink-soft">
          尚未新增任何作品。
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {portfolio.map((shot) => ( // 走訪每一筆作品資料
            <div key={shot._id} className="overflow-hidden rounded-xl border border-line bg-paper-2">
              <div className="relative aspect-[4/3]">
                {shot.photo ? ( // 若有實際照片
                  <PhotoTile src={shot.photo.src} alt={shot.photo.alt} />
                ) : ( // 否則使用色卡佔位
                  <ArtTile toneA={shot.tone.a} toneB={shot.tone.b} icon={shot.tone.icon} />
                )}
                <span
                  className={`absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold text-paper ${
                    shot.photo ? "bg-[#4c8c5a]" : "bg-ink/70"
                  }`}
                >
                  {shot.photo ? (
                    <>
                      <IconCheck className="h-2.5 w-2.5" />
                      已上傳
                    </>
                  ) : (
                    "色卡佔位"
                  )}
                </span>
                <div className="absolute right-2 top-2 flex gap-1"> {/* 編輯/刪除按鈕，疊在圖片右上角 */}
                  <button
                    type="button"
                    onClick={() => setModal({ mode: "edit", item: shot })}
                    className="rounded-md bg-paper/90 p-1.5 text-ink-soft hover:bg-paper hover:text-ink"
                  >
                    <IconPencil className="h-3 w-3" />
                  </button>
                  <form
                    action={deletePortfolioAction.bind(null, shot._id)}
                    onSubmit={(e) => {
                      if (!confirm(`確定要刪除「${shot.caption}」嗎?`)) e.preventDefault();
                    }}
                  >
                    <button type="submit" className="rounded-md bg-paper/90 p-1.5 text-ink-soft hover:bg-paper hover:text-ink">
                      <IconTrash className="h-3 w-3" />
                    </button>
                  </form>
                </div>
              </div>
              <div className="px-3.5 py-3">
                <p className="text-[13px] font-semibold">{shot.caption}</p>
                <p className="mt-0.5 text-[11px] text-gold">{shot.category}</p>
                <div className="mt-0.5 flex items-center justify-between gap-2 text-[11.5px] text-ink-soft">
                  <span className="truncate">{shot.place}</span>
                  <span className="tabular-nums">{formatDate(shot.date)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && ( // 有開啟視窗時才渲染
        <AdminModal title={modal.mode === "add" ? "新增作品" : "編輯作品"} onClose={() => setModal(null)}>
          <form
            action={modal.mode === "add" ? createPortfolioAction : updatePortfolioAction.bind(null, modal.item._id)}
            onSubmit={() => setModal(null)} // 送出後立即關閉視窗
            className="flex flex-col gap-3"
          >
            {modal.mode === "edit" && <input type="hidden" name="order" defaultValue={modal.item.order} />}
            <label className={labelClass}>
              作品說明
              <input
                name="caption"
                placeholder="大隊接力・交棒瞬間"
                defaultValue={modal.mode === "edit" ? modal.item.caption : ""}
                required
                className={inputClass}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={labelClass}>
                賽事類別(用於前台篩選)
                <input
                  name="category"
                  placeholder="大隊接力"
                  defaultValue={modal.mode === "edit" ? modal.item.category : ""}
                  required
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                地點(用於前台篩選)
                <input
                  name="place"
                  placeholder="臺北田徑場"
                  defaultValue={modal.mode === "edit" ? modal.item.place : ""}
                  required
                  className={inputClass}
                />
              </label>
            </div>
            <label className={labelClass}>
              拍攝日期
              <input
                type="date"
                name="date"
                defaultValue={modal.mode === "edit" ? modal.item.date : ""}
                required
                className={inputClass}
              />
            </label>
            <AdminImageField
              srcName="photoSrc"
              altName="photoAlt"
              label="照片(選填,沒有上傳就用下方插圖配色代替)"
              defaultSrc={modal.mode === "edit" ? (modal.item.photo?.src ?? "") : ""}
              defaultAlt={modal.mode === "edit" ? (modal.item.photo?.alt ?? "") : ""}
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
            <button type="submit" className="mt-1.5 rounded-full bg-gold px-4 py-2 text-[13px] font-semibold text-paper hover:bg-gold/90">
              儲存
            </button>
          </form>
        </AdminModal>
      )}
    </div>
  );
}
