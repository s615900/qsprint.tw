"use client"; // 標記為 Client Component，因為要處理新增/編輯視窗的開關狀態

import { useState } from "react"; // 匯入狀態 hook
import PhotoTile from "./PhotoTile"; // 匯入圖片顯示元件
import AdminModal from "./AdminModal"; // 匯入共用的彈出視窗外框
import AdminImageField from "./AdminImageField"; // 匯入圖片上傳欄位元件
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
          <h2 className="font-display text-lg font-bold">首頁輪播圖</h2> {/* 區塊標題 */}
          <p className="mt-1 text-[12.5px] text-ink-soft">
            狀態為「顯示」的圖片會依順序在首頁滿版輪播,順序數字小的排前面。 {/* 說明文字 */}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal({ mode: "add" })} // 點擊開啟新增視窗
          className="rounded-full bg-gold px-4 py-2 text-[13px] font-semibold text-paper hover:bg-gold/90"
        >
          + 新增輪播圖
        </button>
      </div>

      {slides.length === 0 ? ( // 沒有任何資料時顯示提示文字
        <p className="rounded-xl border border-dashed border-line bg-paper-2 p-6 text-center text-[13px] text-ink-soft">
          尚未新增任何首頁輪播圖。
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
                <h4 className="truncate text-[13.5px] font-bold">{slide.title || "(未填標題)"}</h4>
                <p className="truncate text-[12px] text-ink-soft">{slide.href || "不連結"}</p>
              </div>

              <div className="flex items-center gap-2.5"> {/* 狀態標籤與操作按鈕 */}
                <span className="flex-none text-[11px] text-ink-soft">順序 {slide.order}</span>
                <span
                  className={`flex-none rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${
                    slide.visible ? "bg-[#e3efe1] text-[#4c8c5a]" : "bg-paper-3 text-ink-soft"
                  }`}
                >
                  {slide.visible ? "顯示" : "隱藏"}
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
                    if (!confirm(`確定要刪除「${slide.title || "這張輪播圖"}」嗎?`)) e.preventDefault();
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
        <AdminModal title={modal.mode === "add" ? "新增輪播圖" : "編輯輪播圖"} onClose={() => setModal(null)}>
          <form
            action={modal.mode === "add" ? createHeroSlideAction : updateHeroSlideAction.bind(null, modal.slide._id)}
            onSubmit={() => setModal(null)} // 送出後立即關閉視窗，新資料會在儲存完成後自動刷新列表
            className="flex flex-col gap-3"
          >
            <label className={labelClass}>
              標題(後台辨識用,不會顯示在首頁)
              <input name="title" defaultValue={modal.mode === "edit" ? modal.slide.title : ""} required className={inputClass} />
            </label>
            <AdminImageField
              srcName="imageSrc"
              altName="imageAlt"
              label="圖片(建議橫式、寬度 1920px 以上)"
              defaultSrc={modal.mode === "edit" ? modal.slide.image.src : ""}
              defaultAlt={modal.mode === "edit" ? modal.slide.image.alt : ""}
              required
            />
            <label className={labelClass}>
              網址(點擊圖片前往的頁面,可填站內路徑如 /news 或外部網址,留空則不連結)
              <input
                name="href"
                defaultValue={modal.mode === "edit" ? modal.slide.href : ""}
                placeholder="https://"
                className={inputClass}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <fieldset className={labelClass}>
                狀態
                <div className="flex items-center gap-4 py-2 font-normal text-ink">
                  <label className="flex items-center gap-1.5">
                    <input type="radio" name="visible" value="visible" defaultChecked={modal.mode === "add" || modal.slide.visible} />
                    顯示
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input type="radio" name="visible" value="hidden" defaultChecked={modal.mode === "edit" && !modal.slide.visible} />
                    隱藏
                  </label>
                </div>
              </fieldset>
              <label className={labelClass}>
                順序(數字小的排前面,留空排最後)
                <input
                  name="order"
                  type="number"
                  defaultValue={modal.mode === "edit" ? modal.slide.order : ""}
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
