import { schedule } from "@/lib/content"; // 匯入賽程靜態資料
import { daysUntil } from "@/lib/admin"; // 匯入計算距今剩餘天數的工具函式
import { IconPencil, IconTrash } from "./AdminIcons"; // 匯入編輯與刪除圖示

export default function AdminSchedule() { // 後台「賽事行事曆」管理頁面元件
  return (
    <div className="flex flex-col gap-5">
      {/* 整個頁面的垂直排列容器 */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        {/* 標題與新增按鈕的橫向排列列 */}
        <div>
          <h2 className="font-display text-lg font-bold">賽事行事曆</h2> {/* 頁面標題 */}
          <p className="mt-1 text-[12.5px] text-ink-soft">確定進場拍攝的賽事清單,倒數以今日日期計算。</p>
          {/* 頁面說明文字 */}
        </div>
        <button
          type="button" // 一般按鈕
          className="rounded-full bg-gold px-4 py-2 text-[13px] font-semibold text-paper hover:bg-gold/90"
        >
          + 新增賽事 {/* 新增賽事按鈕文字（目前無實際功能） */}
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line bg-paper-2">
        {/* 表格外層容器，寬度不足時可橫向捲動 */}
        <table className="w-full min-w-[640px] border-collapse">
          {/* 賽程表格，設定最小寬度避免欄位擠壓 */}
          <thead>
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted">
              {/* 表頭列 */}
              <th className="border-b border-line px-4 py-2.5">日期</th> {/* 日期欄標題 */}
              <th className="border-b border-line px-4 py-2.5">賽事名稱</th> {/* 賽事名稱欄標題 */}
              <th className="border-b border-line px-4 py-2.5">地點</th> {/* 地點欄標題 */}
              <th className="border-b border-line px-4 py-2.5">倒數</th> {/* 倒數天數欄標題 */}
              <th className="border-b border-line px-4 py-2.5">狀態</th> {/* 狀態欄標題 */}
              <th className="border-b border-line px-4 py-2.5 text-right">操作</th> {/* 操作欄標題 */}
            </tr>
          </thead>
          <tbody>
            {schedule.map((item) => { // 走訪每一筆賽程資料
              const days = daysUntil(item.date); // 計算距離該賽事還有幾天
              const isPast = days < 0; // 判斷賽事是否已過期
              const isSoon = !isPast && days <= 14; // 判斷是否為 14 天內即將開始的賽事
              return ( // 回傳一列表格資料
                <tr key={item.event} className="text-[13px] hover:bg-paper-3">
                  {/* 每一筆賽程的資料列，用賽事名稱當 key */}
                  <td className="font-clock border-b border-line px-4 py-3.5 text-[15px] tabular-nums">
                    {item.date} {/* 顯示賽事日期 */}
                  </td>
                  <td className="border-b border-line px-4 py-3.5 font-semibold">{item.event}</td>
                  {/* 顯示賽事名稱 */}
                  <td className="border-b border-line px-4 py-3.5 text-ink-soft">{item.place}</td>
                  {/* 顯示賽事地點 */}
                  <td className="border-b border-line px-4 py-3.5 tabular-nums">
                    {isPast ? "已結束" : `${days} 天`} {/* 已過期顯示已結束，否則顯示剩餘天數 */}
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    {/* 狀態欄位 */}
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${
                        isPast
                          ? "bg-paper-3 text-muted" // 已結束的樣式
                          : isSoon
                            ? "bg-coral/10 text-coral" // 即將開始的樣式
                            : "bg-paper-3 text-ink-soft" // 已排定但尚未接近的樣式
                      }`}
                    >
                      {isPast ? "已結束" : isSoon ? "即將開始" : "已排定"} {/* 依狀態顯示對應文字 */}
                    </span>
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    {/* 操作欄位 */}
                    <div className="flex justify-end gap-1">
                      {/* 操作按鈕靠右排列 */}
                      <button type="button" className="rounded-md p-1.5 text-ink-soft hover:bg-paper-3 hover:text-ink">
                        <IconPencil className="h-3.5 w-3.5" /> {/* 編輯按鈕 */}
                      </button>
                      <button type="button" className="rounded-md p-1.5 text-ink-soft hover:bg-paper-3 hover:text-ink">
                        <IconTrash className="h-3.5 w-3.5" /> {/* 刪除按鈕 */}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
