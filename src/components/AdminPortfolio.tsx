import { portfolio } from "@/lib/content"; // 匯入作品集靜態資料
import ArtTile from "./ArtTile"; // 匯入無實際照片時的色卡佔位元件
import PhotoTile from "./PhotoTile"; // 匯入實際照片顯示元件
import { IconCheck } from "./AdminIcons"; // 匯入打勾圖示

const uploadedCount = portfolio.filter((shot) => shot.photo).length;
// 計算作品集中已經有實際照片（非佔位）的數量

export default function AdminPortfolio() { // 後台「作品集」管理頁面元件
  return (
    <div className="flex flex-col gap-5">
      {/* 整個頁面的垂直排列容器 */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        {/* 標題與新增按鈕的橫向排列列 */}
        <div>
          <h2 className="font-display text-lg font-bold">作品集</h2> {/* 頁面標題 */}
          <p className="mt-1 text-[12.5px] text-ink-soft">
            {portfolio.length} 張作品,其中 {uploadedCount} 張已上傳實際照片,其餘暫以色卡佔位。
            {/* 顯示總張數與已上傳張數的說明文字 */}
          </p>
        </div>
        <button
          type="button" // 一般按鈕
          className="rounded-full bg-gold px-4 py-2 text-[13px] font-semibold text-paper hover:bg-gold/90"
        >
          + 新增作品 {/* 新增作品按鈕文字（目前無實際功能） */}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {/* 作品格線排版，依畫面寬度調整欄數 */}
        {portfolio.map((shot) => ( // 走訪每一筆作品資料
          <div key={shot.caption + shot.date} className="overflow-hidden rounded-xl border border-line bg-paper-2">
            {/* 單張作品卡片，用文字加日期組成唯一 key */}
            <div className="relative aspect-[4/3]">
              {/* 圖片區域，固定 4:3 比例 */}
              {shot.photo ? ( // 若有實際照片
                <PhotoTile src={shot.photo} alt={shot.caption} /> // 顯示實際照片
              ) : ( // 否則使用色卡佔位
                <ArtTile toneA={shot.tone.a} toneB={shot.tone.b} icon={shot.tone.icon} /> // 顯示色卡佔位插圖
              )}
              <span
                className={`absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold text-paper ${
                  shot.photo ? "bg-[#4c8c5a]" : "bg-ink/70"
                  // 已上傳用綠色標籤，佔位用深色標籤
                }`}
              >
                {shot.photo ? ( // 已上傳的狀態標籤
                  <>
                    <IconCheck className="h-2.5 w-2.5" /> {/* 打勾圖示 */}
                    已上傳 {/* 已上傳文字 */}
                  </>
                ) : ( // 尚未上傳的狀態標籤
                  "色卡佔位" // 尚未上傳文字
                )}
              </span>
            </div>
            <div className="px-3.5 py-3">
              {/* 圖片下方的文字說明區塊 */}
              <p className="text-[13px] font-semibold">{shot.caption}</p> {/* 作品說明文字 */}
              <div className="mt-0.5 flex items-center justify-between gap-2 text-[11.5px] text-ink-soft">
                {/* 地點與日期橫向對齊排列 */}
                <span className="truncate">{shot.place}</span> {/* 拍攝地點，過長時截斷 */}
                <span className="tabular-nums">{shot.date}</span> {/* 拍攝日期，使用等寬數字 */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
