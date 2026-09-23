import type { ComponentType } from "react"; // 匯入 React 的元件型別，供圖示 props 使用
import { stats } from "@/lib/content"; // 匯入仍為靜態資料的統計數字
import { daysUntil, formatScheduleDate } from "@/lib/admin"; // 匯入計算距今天數、格式化日期的工具函式
import type { AdminSection } from "./AdminSidebar"; // 匯入後台側邊欄分頁型別
import { IconDoc, IconUpload, IconLayers, IconCalendar } from "./AdminIcons"; // 匯入待辦事項要用的各種圖示
import type { HeroSlide, NewsItem, ScheduleItem, PortfolioAlbum } from "@/lib/db"; // 匯入首頁焦點、新聞、賽事、作品集相簿的型別

export default function AdminOverview({ // 定義後台「總覽」頁面元件並預設匯出
  heroSlides, // 首頁焦點資料(來自 MongoDB)
  news, // 最新消息資料(來自 MongoDB)
  schedule, // 賽事資料(來自 MongoDB)
  portfolio, // 作品集相簿資料(來自 MongoDB)
  onNavigate, // 接收切換分頁用的回呼函式
}: {
  heroSlides: HeroSlide[];
  news: NewsItem[];
  schedule: ScheduleItem[];
  portfolio: PortfolioAlbum[];
  onNavigate: (section: AdminSection) => void;
}) {
  const totalPhotos = portfolio.reduce((sum, album) => sum + album.photos.length, 0); // 所有相簿的照片總數
  const emptyAlbumCount = portfolio.filter((album) => album.photos.length === 0).length; // 計算還沒有任何照片的相簿數量
  const draftNews = news.find((item) => item.status === "draft"); // 找出第一篇草稿(若有)
  const draftCount = news.length - news.filter((item) => item.status === "published").length; // 計算草稿篇數
  const upcomingSchedule = schedule.filter((item) => daysUntil(item.startDate) >= 0); // 只保留還沒過期的賽事(schedule 本身已依日期排序)
  const nextEvent = upcomingSchedule[0]; // 取得最近的一場賽事
  const nextEventDays = nextEvent ? daysUntil(nextEvent.startDate) : null; // 計算距離下一場賽事還有幾天(沒有賽事就不計算)

  return ( // 回傳畫面內容
    <div className="flex flex-col gap-6"> {/* 整頁垂直排列容器 */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4"> {/* 統計數字格線，手機兩欄、平板以上四欄 */}
        {stats.map((s) => ( // 走訪統計資料陣列
          <div key={s.label} className="rounded-xl border border-line bg-paper-2 px-4 py-3.5"> {/* 單一統計卡片，key 用標籤名稱 */}
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">{s.label}</p> {/* 統計項目名稱 */}
            <p className="font-clock mt-1 text-[1.9rem] leading-none text-ink">{s.value}</p> {/* 統計數值，等寬字體 */}
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]"> {/* 主要內容格線，桌機分成左寬右窄兩欄 */}
        <div className="rounded-xl border border-line bg-paper-2 p-5"> {/* 待辦事項卡片 */}
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gold">待辦事項</p> {/* 卡片小標籤 */}
          <h3 className="mt-1 text-[14px] font-bold">需要你處理的事</h3> {/* 卡片標題 */}
          <ul className="mt-3.5 flex flex-col divide-y divide-line"> {/* 待辦清單容器，項目間有分隔線 */}
            {draftNews && ( // 有草稿才顯示這一列
              <TodoRow
                icon={IconDoc}
                onClick={() => onNavigate("news")}
                title="有消息草稿待發布"
                detail={`「${draftNews.title}」`}
                tagLabel="草稿"
                tagTone="muted"
              />
            )}
            {emptyAlbumCount > 0 && ( // 有相簿還沒放照片才顯示這一列
              <TodoRow
                icon={IconUpload}
                onClick={() => onNavigate("portfolio")}
                title={`${emptyAlbumCount} 本相簿還沒有照片`}
                detail={`目前以色卡佔位・作品集共 ${portfolio.length} 本相簿、${totalPhotos} 張照片`}
                tagLabel="待上傳"
                tagTone="muted"
              />
            )}
            <TodoRow
              icon={IconLayers}
              onClick={() => onNavigate("hero")}
              title={`首頁輪播共 ${heroSlides.length} 則`}
              detail={heroSlides[0] ? `目前顯示第 1 則・「${heroSlides[0].titleLines.join("")}」` : "尚未新增任何首頁焦點"}
              tagLabel="顯示中"
              tagTone="live"
            />
            {nextEvent && ( // 有賽事才顯示這一列
              <TodoRow
                icon={IconCalendar}
                onClick={() => onNavigate("schedule")}
                title="最近賽事即將開始"
                detail={`${nextEvent.event}・${formatScheduleDate(nextEvent.startDate, nextEvent.endDate)}・${nextEvent.place}`}
                tagLabel={`${nextEventDays} 天後`}
                tagTone="soon"
              />
            )}
          </ul>
        </div>

        <div className="flex flex-col gap-4"> {/* 右側欄垂直排列容器 */}
          <div className="rounded-xl border border-line bg-paper-2 p-5"> {/* 近期賽事卡片 */}
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gold">近期賽事</p> {/* 卡片小標籤 */}
            <h3 className="mt-1 text-[14px] font-bold">接下來的拍攝行程</h3> {/* 卡片標題 */}
            <div className="mt-3 flex flex-col divide-y divide-line"> {/* 賽事清單容器，項目間有分隔線 */}
              {upcomingSchedule.length === 0 ? (
                <p className="py-2.5 text-[12.5px] text-ink-soft">尚未新增任何賽事。</p>
              ) : (
                upcomingSchedule.slice(0, 3).map((item) => { // 只取最近的 3 場賽事
                  const days = daysUntil(item.startDate); // 計算此筆賽事距今天數
                  return ( // 回傳該筆賽事的畫面
                    <div key={item._id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"> {/* 單筆賽事列，key 用 _id */}
                      <span className="font-clock w-16 flex-none rounded-md bg-paper-3 py-1 text-center text-[12px] tabular-nums"> {/* 日期標籤樣式 */}
                        {formatScheduleDate(item.startDate, item.endDate).split("–")[0].trim()} {/* 只取日期區間的起始日並去除前後空白 */}
                      </span>
                      <div className="min-w-0 flex-1"> {/* 賽事文字資訊容器 */}
                        <p className="truncate text-[12.5px] font-semibold">{item.event}</p> {/* 賽事名稱，過長截斷 */}
                        <p className="truncate text-[11.5px] text-ink-soft">{item.place}</p> {/* 賽事地點，過長截斷 */}
                      </div>
                      <span
                        className={`flex-none rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${
                          days <= 14 ? "bg-coral/10 text-coral" : "bg-paper-3 text-ink-soft" // 距今 14 天內用強調色，否則用一般色
                        }`}
                      >
                        {days <= 14 ? "即將開始" : "已排定"} {/* 依天數顯示不同狀態文字 */}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-xl border border-line bg-paper-2 p-5"> {/* 內容總覽卡片 */}
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gold">內容總覽</p> {/* 卡片小標籤 */}
            <h3 className="mt-1 text-[14px] font-bold">目前站上內容量</h3> {/* 卡片標題 */}
            <div className="mt-3 grid grid-cols-2 gap-2.5"> {/* 兩欄格線容器 */}
              <CountTile value={heroSlides.length} label="首頁焦點" /> {/* 顯示首頁輪播則數 */}
              <CountTile value={news.length} label={`最新消息(${draftCount} 草稿)`} /> {/* 顯示新聞則數與草稿數 */}
              <CountTile value={portfolio.length} label={`相簿(共 ${totalPhotos} 張照片)`} /> {/* 顯示相簿總數與照片總數 */}
              <CountTile value={schedule.length} label="賽事行程" /> {/* 顯示賽程總數 */}
            </div>
          </div>
        </div>
      </div>
    </div> // 結束整頁容器
  );
}

function TodoRow({ // 定義單筆待辦事項子元件
  icon: Icon, // 圖示元件，重新命名為 Icon 以符合 JSX 大寫慣例
  onClick, // 點擊事件回呼
  title, // 待辦標題
  detail, // 待辦細節說明
  tagLabel, // 標籤文字
  tagTone, // 標籤色調種類
}: {
  icon: ComponentType<{ className?: string }>; // icon 的型別：接收 className 的元件
  onClick: () => void; // onClick 的型別：無參數、無回傳值
  title: string; // title 的型別：字串
  detail: string; // detail 的型別：字串
  tagLabel: string; // tagLabel 的型別：字串
  tagTone: "muted" | "live" | "soon"; // tagTone 的型別：三種固定字串之一
}) {
  const tagClass = // 依照 tagTone 決定標籤的顏色樣式
    tagTone === "live" // 若色調為「顯示中」
      ? "bg-[#e3efe1] text-[#4c8c5a]" // 使用綠色系樣式
      : tagTone === "soon" // 否則若色調為「即將」
        ? "bg-coral/10 text-coral" // 使用珊瑚色系樣式
        : "border border-dashed border-line bg-paper-3 text-muted"; // 其餘（muted）使用灰色虛線樣式

  return ( // 回傳畫面內容
    <li> {/* 清單項目容器 */}
      <button
        type="button" // 按鈕類型，避免觸發表單送出
        onClick={onClick} // 綁定點擊事件
        className="flex w-full items-start gap-3 py-3 text-left first:pt-0 last:pb-0" // 按鈕排版樣式
      >
        <Icon className="mt-0.5 h-4 w-4 flex-none text-gold" /> {/* 顯示對應圖示 */}
        <span className="min-w-0 flex-1"> {/* 文字內容容器 */}
          <span className="block text-[13px] font-semibold text-ink">{title}</span> {/* 顯示待辦標題 */}
          <span className="mt-0.5 block truncate text-[11.5px] text-ink-soft">{detail}</span> {/* 顯示待辦細節，過長截斷 */}
        </span>
        <span className={`flex-none rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${tagClass}`}> {/* 狀態標籤樣式 */}
          {tagLabel} {/* 顯示標籤文字 */}
        </span>
      </button>
    </li>
  );
}

function CountTile({ value, label }: { value: number; label: string }) { // 定義數量統計小方塊子元件
  return ( // 回傳畫面內容
    <div className="rounded-lg bg-paper-3 px-3 py-2.5"> {/* 方塊容器樣式 */}
      <p className="font-clock text-[1.4rem] leading-none">{value}</p> {/* 顯示數值，等寬字體 */}
      <p className="mt-0.5 text-[11px] text-ink-soft">{label}</p> {/* 顯示說明標籤 */}
    </div>
  );
}
