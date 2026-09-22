import Eyebrow from "./Eyebrow"; // 匯入小標籤元件，用來標示區塊分類
import type { ScheduleItem } from "@/lib/db"; // 匯入賽事的型別(資料來自 MongoDB)
import { formatScheduleDate } from "@/lib/admin"; // 匯入日期格式化工具函式

export default function ScheduleSection({ schedule }: { schedule: ScheduleItem[] }) { // 匯出賽事行事曆區塊元件，資料由父層傳入
  return ( // 回傳整個區塊的畫面結構
    <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16"> {/* 區塊外層容器，置中並設定最大寬度與內距 */}
      <Eyebrow>賽事行事曆</Eyebrow> {/* 顯示「賽事行事曆」小標籤 */}
      <div className="mb-8 mt-4 flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-ink pb-4"> {/* 標題與說明文字的橫向排版容器，底部有分隔線 */}
        <h2 className="font-display text-[1.6rem] font-bold sm:text-[2rem] lg:text-[2.3rem]"> {/* 區塊主標題樣式 */}
          接下來,我們會出現在這些賽場 {/* 主標題文字 */}
        </h2>
        <p className="max-w-[40ch] text-[0.85rem] text-muted"> {/* 區塊說明文字樣式，限制最大寬度 */}
          以下是青春止秒團隊確定進場拍攝的賽事清單,持續更新中,歡迎邀請我們一同紀錄。 {/* 說明文字內容 */}
        </p>
      </div>

      <div className="divide-y divide-line"> {/* 賽事清單容器，項目間以分隔線區隔 */}
        {schedule.length === 0 && ( // 沒有任何賽事時顯示提示文字
          <p className="py-8 text-center text-[0.9rem] text-muted">目前尚未公布賽事,敬請期待。</p>
        )}
        {schedule.map((item) => ( // 走訪 schedule 陣列，為每一筆賽事資料渲染一列
          <div
            key={item._id} // 以文件 id 作為 React 的 key
            className="flex flex-col gap-1.5 py-6 sm:flex-row sm:items-center sm:gap-8" // 單筆賽事列的排版樣式(手機直排、桌機橫排)
          >
            <span className="font-clock text-[0.85rem] tracking-widest text-ink/25 sm:w-10"> {/* 顯示月份的小字樣式 */}
              {item.startDate.slice(5, 7)}月 {/* 取開始日期的月份部分，後面補「月」字 */}
            </span>
            <span className="font-clock text-[1.4rem] leading-none tracking-wide text-gold sm:w-52 sm:flex-none"> {/* 顯示完整日期範圍的樣式 */}
              {formatScheduleDate(item.startDate, item.endDate)} {/* 格式化後的日期範圍文字 */}
            </span>
            <div> {/* 賽事名稱與地點的容器 */}
              <h3 className="text-[1.05rem] font-bold">{item.event}</h3> {/* 賽事名稱標題 */}
              <p className="text-[0.85rem] text-muted">{item.place}</p> {/* 賽事舉辦地點 */}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
