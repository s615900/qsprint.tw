"use client"; // 標記為 Client Component，因為要處理新增/編輯視窗的開關狀態

import { useState } from "react"; // 匯入狀態 hook
import ArtTile from "./ArtTile"; // 匯入無實際照片時的色卡佔位元件
import PhotoTile from "./PhotoTile"; // 匯入實際照片顯示元件
import AdminModal from "./AdminModal"; // 匯入共用的彈出視窗外框
import AdminAlbumPhotos from "./AdminAlbumPhotos"; // 匯入相簿照片多檔上傳欄位元件
import { IconPencil, IconTrash } from "./AdminIcons"; // 匯入編輯、刪除圖示
import { formatDate } from "@/lib/admin"; // 匯入日期格式化工具函式
import type { PortfolioAlbum } from "@/lib/db"; // 匯入相簿的型別
import { createPortfolioAlbumAction, deletePortfolioAlbumAction, updatePortfolioAlbumAction } from "@/app/admin/actions"; // 匯入相簿的 Server Actions
import { tonePresets } from "@/lib/tone-presets"; // 匯入配色預設清單

const inputClass = // 表單輸入框共用樣式
  "w-full rounded-lg border border-line bg-paper-2 px-3 py-2 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-gold/40";
const labelClass = "flex flex-col gap-1 text-[12.5px] font-semibold text-ink-soft"; // 表單欄位標籤共用樣式

type ModalState = { mode: "add" } | { mode: "edit"; album: PortfolioAlbum } | null; // 視窗狀態:關閉、新增、或編輯某一本相簿

export default function AdminPortfolio({ portfolio }: { portfolio: PortfolioAlbum[] }) { // 後台「作品集」管理頁面元件，資料由父層傳入
  const [modal, setModal] = useState<ModalState>(null); // 目前彈出視窗的狀態
  const totalPhotos = portfolio.reduce((sum, album) => sum + album.photos.length, 0); // 所有相簿的照片總數

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold">作品集</h2>
          <p className="mt-1 text-[12.5px] text-ink-soft">
            {portfolio.length} 本相簿,共 {totalPhotos} 張照片。每本相簿對應一場賽事,可以一次上傳多張照片。
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal({ mode: "add" })} // 點擊開啟新增視窗
          className="rounded-full bg-gold px-4 py-2 text-[13px] font-semibold text-paper hover:bg-gold/90"
        >
          + 新增相簿
        </button>
      </div>

      {portfolio.length === 0 ? ( // 沒有任何資料時顯示提示文字
        <p className="rounded-xl border border-dashed border-line bg-paper-2 p-6 text-center text-[13px] text-ink-soft">
          尚未新增任何相簿。
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {portfolio.map((album) => { // 走訪每一本相簿資料
            const cover = album.photos[0]; // 第一張照片當作封面
            return (
              <div key={album._id} className="overflow-hidden rounded-xl border border-line bg-paper-2">
                <div className="relative aspect-[4/3]">
                  {cover ? ( // 有照片就用第一張當封面
                    <PhotoTile src={cover.src} alt={cover.alt || album.title} />
                  ) : ( // 一張都還沒有就用色卡佔位
                    <ArtTile toneA={album.tone.a} toneB={album.tone.b} icon={album.tone.icon} />
                  )}
                  <span className="absolute left-2 top-2 rounded-full bg-ink/70 px-2 py-1 text-[10px] font-bold text-paper">
                    {album.photos.length} 張照片
                  </span>
                  <div className="absolute right-2 top-2 flex gap-1"> {/* 編輯/刪除按鈕，疊在圖片右上角 */}
                    <button
                      type="button"
                      onClick={() => setModal({ mode: "edit", album })}
                      className="rounded-md bg-paper/90 p-1.5 text-ink-soft hover:bg-paper hover:text-ink"
                    >
                      <IconPencil className="h-3 w-3" />
                    </button>
                    <form
                      action={deletePortfolioAlbumAction.bind(null, album._id)}
                      onSubmit={(e) => {
                        if (!confirm(`確定要刪除相簿「${album.title}」嗎?(裡面的 ${album.photos.length} 張照片也會一起移除)`)) e.preventDefault();
                      }}
                    >
                      <button type="submit" className="rounded-md bg-paper/90 p-1.5 text-ink-soft hover:bg-paper hover:text-ink">
                        <IconTrash className="h-3 w-3" />
                      </button>
                    </form>
                  </div>
                </div>
                <div className="px-3.5 py-3">
                  <p className="text-[13px] font-semibold">{album.title}</p>
                  <p className="mt-0.5 text-[11px] text-gold">{album.category}</p>
                  <div className="mt-0.5 flex items-center justify-between gap-2 text-[11.5px] text-ink-soft">
                    <span className="truncate">{album.place}</span>
                    <span className="tabular-nums">{formatDate(album.date)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && ( // 有開啟視窗時才渲染
        <AdminModal title={modal.mode === "add" ? "新增相簿" : "編輯相簿"} onClose={() => setModal(null)}>
          <form
            action={modal.mode === "add" ? createPortfolioAlbumAction : updatePortfolioAlbumAction.bind(null, modal.album._id)}
            onSubmit={() => setModal(null)} // 送出後立即關閉視窗
            className="flex flex-col gap-3"
          >
            <label className={labelClass}>
              相簿標題
              <input
                name="title"
                placeholder="2026年新北國際田徑公開賽"
                defaultValue={modal.mode === "edit" ? modal.album.title : ""}
                required
                className={inputClass}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={labelClass}>
                賽事類別(用於前台篩選)
                <input
                  name="category"
                  placeholder="全國田徑公開賽"
                  defaultValue={modal.mode === "edit" ? modal.album.category : ""}
                  required
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                地點(用於前台篩選)
                <input
                  name="place"
                  placeholder="新北田徑場"
                  defaultValue={modal.mode === "edit" ? modal.album.place : ""}
                  required
                  className={inputClass}
                />
              </label>
            </div>
            <label className={labelClass}>
              賽事日期
              <input
                type="date"
                name="date"
                defaultValue={modal.mode === "edit" ? modal.album.date : ""}
                required
                className={inputClass}
              />
            </label>
            <AdminAlbumPhotos name="photos" defaultPhotos={modal.mode === "edit" ? modal.album.photos : []} />
            <label className={labelClass}>
              插圖配色(相簿裡一張照片都沒有時使用)
              <select
                name="tonePreset"
                defaultValue={modal.mode === "edit" ? modal.album.tone.icon : tonePresets[0].id}
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
