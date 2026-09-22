import Link from "next/link"; // 匯入 Next.js 頁面導覽連結元件
import { schedule } from "@/lib/content"; // 匯入賽程靜態資料

export default function ScheduleRibbon() { // 定義並匯出首頁的賽程橫幅元件
  return ( // 回傳橫幅整體的 JSX
    <div className="border-b-2 border-ink py-6"> {/* 橫幅最外層容器，底部有邊線 */}
      <div className="mx-auto max-w-6xl px-5 sm:px-8"> {/* 置中並限制最大寬度的內容容器 */}
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3"> {/* 標題列與「查看完整賽程」連結的橫向排列容器 */}
          <div className="flex flex-wrap items-baseline gap-3"> {/* 主標題與副標籤的橫向排列容器 */}
            <h2 className="font-clock text-[1.3rem] tracking-wide"> {/* 主標題樣式 */}
              接下來,我們會出現在這些賽場 {/* 區塊主標題 */}
            </h2>
            <span className="font-clock text-[0.85rem] tracking-wide text-muted"> {/* 副標籤樣式 */}
              SCHEDULE — 持續更新 {/* 副標籤文字 */}
            </span>
          </div>
          <Link
            href="/schedule" // 連結到完整賽程頁面
            className="border-b-2 border-transparent text-[0.85rem] font-bold text-coral no-underline transition-colors hover:border-coral"
          >
            查看完整賽程 → {/* 連結文字 */}
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1.5 [scroll-snap-type:x_proximity]"> {/* 橫向可捲動的卡片清單容器，啟用捲動吸附 */}
          {/* 依賽程資料逐筆渲染橫向捲動卡片 */}
          {schedule.map((item, index) => ( // 走訪賽程陣列，並取得索引值作為顯示序號
            <div
              key={item.event} // 以賽事名稱作為 key
              className="min-w-[220px] flex-none border-t-4 border-gold bg-white px-4 py-3 [scroll-snap-align:start]" // 單張卡片樣式，固定最小寬度並設定捲動吸附點
            >
              <div className="flex items-baseline justify-between gap-2"> {/* 日期與序號的橫向排列容器 */}
                <span className="font-clock text-[1.4rem] leading-none tracking-wide text-ink">
                  {item.date} {/* 顯示賽事日期 */}
                </span>
                <span className="font-clock text-[0.85rem] text-muted">
                  {String(index + 1).padStart(2, "0")} {/* 顯示兩位數序號 */}
                </span>
              </div>
              <span className="mt-2 block text-[0.9rem] font-semibold">
                {item.event} {/* 顯示賽事名稱 */}
              </span>
              <span className="mt-0.5 block text-[0.76rem] text-muted">
                {item.place} {/* 顯示賽事地點 */}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
