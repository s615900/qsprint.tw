"use client"; // 標記為 Client Component，因為要處理新增/編輯視窗的開關狀態

import { useState } from "react"; // 匯入狀態 hook
import { daysUntil } from "@/lib/admin"; // 匯入計算距今剩餘天數的工具函式
import { IconPencil, IconTrash } from "./AdminIcons"; // 匯入編輯與刪除圖示
import AdminModal from "./AdminModal"; // 匯入共用的彈出視窗外框
import type { ScheduleItem } from "@/lib/db"; // 匯入賽事的型別
import { createScheduleAction, deleteScheduleAction, updateScheduleAction } from "@/app/admin/actions"; // 匯入賽事的 Server Actions

const inputClass = // 表單輸入框共用樣式
  "w-full rounded-lg border border-line bg-paper-2 px-3 py-2 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-gold/40";
const labelClass = "flex flex-col gap-1 text-[12.5px] font-semibold text-ink-soft"; // 表單欄位標籤共用樣式

type ModalState = { mode: "add" } | { mode: "edit"; item: ScheduleItem } | null; // 視窗狀態:關閉、新增、或編輯某一筆

export default function AdminSchedule({ schedule }: { schedule: ScheduleItem[] }) { // 後台「賽事行事曆」管理頁面元件，資料由父層傳入
  const [modal, setModal] = useState<ModalState>(null); // 目前彈出視窗的狀態

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold">賽事行事曆</h2>
          <p className="mt-1 text-[12.5px] text-ink-soft">確定進場拍攝的賽事清單,倒數以今日日期計算。</p>
        </div>
        <button
          type="button"
          onClick={() => setModal({ mode: "add" })} // 點擊開啟新增視窗
          className="rounded-full bg-gold px-4 py-2 text-[13px] font-semibold text-paper hover:bg-gold/90"
        >
          + 新增賽事
        </button>
      </div>

      {schedule.length === 0 ? ( // 沒有任何資料時顯示提示文字
        <p className="rounded-xl border border-dashed border-line bg-paper-2 p-6 text-center text-[13px] text-ink-soft">
          尚未新增任何賽事。
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-paper-2">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted">
                <th className="border-b border-line px-4 py-2.5">日期</th>
                <th className="border-b border-line px-4 py-2.5">賽事名稱</th>
                <th className="border-b border-line px-4 py-2.5">地點</th>
                <th className="border-b border-line px-4 py-2.5">倒數</th>
                <th className="border-b border-line px-4 py-2.5">狀態</th>
                <th className="border-b border-line px-4 py-2.5 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((item) => { // 走訪每一筆賽程資料
                const days = daysUntil(item.date); // 計算距離該賽事還有幾天
                const isPast = days < 0; // 判斷賽事是否已過期
                const isSoon = !isPast && days <= 14; // 判斷是否為 14 天內即將開始的賽事
                return (
                  <tr key={item._id} className="text-[13px] hover:bg-paper-3">
                    <td className="font-clock border-b border-line px-4 py-3.5 text-[15px] tabular-nums">
                      {item.date}
                    </td>
                    <td className="border-b border-line px-4 py-3.5 font-semibold">{item.event}</td>
                    <td className="border-b border-line px-4 py-3.5 text-ink-soft">{item.place}</td>
                    <td className="border-b border-line px-4 py-3.5 tabular-nums">
                      {isPast ? "已結束" : `${days} 天`}
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${
                          isPast
                            ? "bg-paper-3 text-muted"
                            : isSoon
                              ? "bg-coral/10 text-coral"
                              : "bg-paper-3 text-ink-soft"
                        }`}
                      >
                        {isPast ? "已結束" : isSoon ? "即將開始" : "已排定"}
                      </span>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setModal({ mode: "edit", item })} // 點擊開啟編輯視窗，帶入這筆資料
                          className="rounded-md p-1.5 text-ink-soft hover:bg-paper-3 hover:text-ink"
                        >
                          <IconPencil className="h-3.5 w-3.5" />
                        </button>
                        <form
                          action={deleteScheduleAction.bind(null, item._id)} // 綁定要刪除的 id
                          onSubmit={(e) => { // 送出前先跳出確認視窗
                            if (!confirm(`確定要刪除「${item.event}」嗎?`)) e.preventDefault();
                          }}
                        >
                          <button type="submit" className="rounded-md p-1.5 text-ink-soft hover:bg-paper-3 hover:text-ink">
                            <IconTrash className="h-3.5 w-3.5" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal && ( // 有開啟視窗時才渲染
        <AdminModal title={modal.mode === "add" ? "新增賽事" : "編輯賽事"} onClose={() => setModal(null)}>
          <form
            action={modal.mode === "add" ? createScheduleAction : updateScheduleAction.bind(null, modal.item._id)}
            onSubmit={() => setModal(null)} // 送出後立即關閉視窗
            className="flex flex-col gap-3"
          >
            {modal.mode === "edit" && <input type="hidden" name="order" defaultValue={modal.item.order} />}
            <label className={labelClass}>
              日期(格式如 09.19 或 09.19 – 09.21)
              <input
                name="date"
                placeholder="09.19 – 09.21"
                defaultValue={modal.mode === "edit" ? modal.item.date : ""}
                required
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              賽事名稱
              <input
                name="event"
                defaultValue={modal.mode === "edit" ? modal.item.event : ""}
                required
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              地點
              <input
                name="place"
                defaultValue={modal.mode === "edit" ? modal.item.place : ""}
                required
                className={inputClass}
              />
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
