"use client"; // 標記為 Client Component，因為要處理新增/編輯視窗的開關狀態

import { useState } from "react"; // 匯入狀態 hook
import PhotoTile from "./PhotoTile"; // 匯入圖片顯示元件
import Eyebrow from "./Eyebrow"; // 匯入小標籤元件
import AdminModal from "./AdminModal"; // 匯入共用的彈出視窗外框
import { IconPencil, IconTrash } from "./AdminIcons"; // 匯入編輯、刪除圖示
import type { HeroSlide } from "@/lib/db"; // 匯入首頁焦點的型別
import { createHeroSlideAction, deleteHeroSlideAction, updateHeroSlideAction } from "@/app/admin/actions"; // 匯入首頁焦點的 Server Actions

const inputClass = // 表單輸入框共用樣式
  "w-full rounded-lg border border-line bg-paper-2 px-3 py-2 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-gold/40";
const labelClass = "flex flex-col gap-1 text-[12.5px] font-semibold text-ink-soft"; // 表單欄位標籤共用樣式

type ModalState = { mode: "add" } | { mode: "edit"; slide: HeroSlide } | null; // 視窗狀態:關閉、新增、或編輯某一筆

export default function AdminHeroSlides({ slides }: { slides: HeroSlide[] }) { // 定義並匯出後台「首頁焦點」管理元件，資料由父層傳入
  const [modal, setModal] = useState<ModalState>(null); // 目前彈出視窗的狀態

  return ( // 回傳整個管理清單的 JSX
    <div className="flex flex-col gap-5"> {/* 整頁垂直排列容器 */}
      <div className="flex flex-wrap items-end justify-between gap-3"> {/* 標題與新增按鈕的橫向排列列 */}
        <div> {/* 標題與說明文字容器 */}
          <h2 className="font-display text-lg font-bold">首頁焦點</h2> {/* 區塊標題 */}
          <p className="mt-1 text-[12.5px] text-ink-soft">
            首張投影片會顯示在首頁最上方,新增的項目會排在最後面。 {/* 說明文字 */}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal({ mode: "add" })} // 點擊開啟新增視窗
          className="rounded-full bg-gold px-4 py-2 text-[13px] font-semibold text-paper hover:bg-gold/90"
        >
          + 新增焦點
        </button>
      </div>

      {slides.length === 0 ? ( // 沒有任何資料時顯示提示文字
        <p className="rounded-xl border border-dashed border-line bg-paper-2 p-6 text-center text-[13px] text-ink-soft">
          尚未新增任何首頁焦點。
        </p>
      ) : (
        <div className="flex flex-col gap-3"> {/* 卡片清單垂直排列容器 */}
          {slides.map((slide, index) => ( // 依 slides 資料逐筆渲染卡片
            <div
              key={slide._id}
              className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-4 rounded-xl border border-line bg-paper-2 p-3.5"
            >
              <div className="relative h-14 w-[5.5rem] flex-none overflow-hidden rounded-lg"> {/* 縮圖容器 */}
                <PhotoTile src={slide.image.src} alt={slide.image.alt} />
                <span className="font-clock absolute left-1 top-1 rounded bg-ink/60 px-1.5 py-0.5 text-[10px] text-paper">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="min-w-0"> {/* 文字資訊容器 */}
                <Eyebrow tone="gold" className="mb-1">
                  {slide.tag}
                </Eyebrow>
                <h4 className="truncate text-[13.5px] font-bold">{slide.titleLines.join("")}</h4>
                <p className="truncate text-[12px] text-ink-soft">{slide.description}</p>
              </div>

              <div className="flex items-center gap-2.5"> {/* 狀態標籤與操作按鈕 */}
                <span
                  className={`flex-none rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${
                    index === 0 ? "bg-[#e3efe1] text-[#4c8c5a]" : "bg-paper-3 text-ink-soft"
                  }`}
                >
                  {index === 0 ? "顯示中" : `排序 ${index + 1}`}
                </span>
                <button
                  type="button"
                  onClick={() => setModal({ mode: "edit", slide })} // 點擊開啟編輯視窗，帶入目前這筆資料
                  className="rounded-md p-1.5 text-ink-soft hover:bg-paper-3 hover:text-ink"
                >
                  <IconPencil className="h-3.5 w-3.5" />
                </button>
                <form
                  action={deleteHeroSlideAction.bind(null, slide._id)} // 綁定要刪除的 id
                  onSubmit={(e) => { // 送出前先跳出確認視窗
                    if (!confirm(`確定要刪除「${slide.titleLines.join("")}」嗎?`)) e.preventDefault();
                  }}
                >
                  <button type="submit" className="rounded-md p-1.5 text-ink-soft hover:bg-paper-3 hover:text-ink">
                    <IconTrash className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && ( // 有開啟視窗時才渲染
        <AdminModal title={modal.mode === "add" ? "新增首頁焦點" : "編輯首頁焦點"} onClose={() => setModal(null)}>
          <form
            action={modal.mode === "add" ? createHeroSlideAction : updateHeroSlideAction.bind(null, modal.slide._id)}
            onSubmit={() => setModal(null)} // 送出後立即關閉視窗，新資料會在儲存完成後自動刷新列表
            className="flex flex-col gap-3"
          >
            {modal.mode === "edit" && <input type="hidden" name="order" defaultValue={modal.slide.order} />}
            <label className={labelClass}>
              分類標籤
              <input name="tag" defaultValue={modal.mode === "edit" ? modal.slide.tag : ""} required className={inputClass} />
            </label>
            <label className={labelClass}>
              標題(每行一句,會依序換行顯示)
              <textarea
                name="titleLines"
                defaultValue={modal.mode === "edit" ? modal.slide.titleLines.join("\n") : ""}
                required
                rows={3}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              說明文字
              <textarea
                name="description"
                defaultValue={modal.mode === "edit" ? modal.slide.description : ""}
                required
                rows={2}
                className={inputClass}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={labelClass}>
                作者
                <input name="author" defaultValue={modal.mode === "edit" ? modal.slide.author : "青春止秒編輯部"} required className={inputClass} />
              </label>
              <label className={labelClass}>
                日期
                <input
                  name="date"
                  placeholder="2026.09.22"
                  defaultValue={modal.mode === "edit" ? modal.slide.date : ""}
                  required
                  className={inputClass}
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className={labelClass}>
                閱讀提示文字
                <input
                  name="readTime"
                  placeholder="閱讀 4 分鐘"
                  defaultValue={modal.mode === "edit" ? modal.slide.readTime : ""}
                  required
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                按鈕文字
                <input
                  name="ctaLabel"
                  placeholder="閱讀全文 →"
                  defaultValue={modal.mode === "edit" ? modal.slide.ctaLabel : ""}
                  required
                  className={inputClass}
                />
              </label>
            </div>
            <label className={labelClass}>
              按鈕連結
              <input
                name="ctaHref"
                placeholder="/news"
                defaultValue={modal.mode === "edit" ? modal.slide.ctaHref : "/news"}
                required
                className={inputClass}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={labelClass}>
                圖片路徑
                <input
                  name="imageSrc"
                  placeholder="/images/track-01-sprint-start.jpg"
                  defaultValue={modal.mode === "edit" ? modal.slide.image.src : ""}
                  required
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                圖片替代文字
                <input
                  name="imageAlt"
                  defaultValue={modal.mode === "edit" ? modal.slide.image.alt : ""}
                  required
                  className={inputClass}
                />
              </label>
            </div>
            <button type="submit" className="mt-1.5 rounded-full bg-gold px-4 py-2 text-[13px] font-semibold text-paper hover:bg-gold/90">
              儲存
            </button>
          </form>
        </AdminModal>
      )}
    </div>
  );
}
