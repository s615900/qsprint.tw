import { IconSearch } from "./AdminIcons"; // 匯入搜尋圖示元件

export default function AdminTopbar({ title, subtitle }: { title: string; subtitle: string }) { // 匯出後台頂部列元件，接收標題與副標題文字
  return ( // 回傳頂部列的畫面結構
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-paper/90 px-7 py-4 backdrop-blur"> {/* 頂部列容器，固定在頂端並加上模糊背景 */}
      <div> {/* 標題與副標題的容器 */}
        <h1 className="font-display text-xl font-bold">{title}</h1> {/* 顯示頁面主標題 */}
        <p className="mt-0.5 text-[12.5px] text-ink-soft">{subtitle}</p> {/* 顯示頁面副標題說明 */}
      </div>
      <div className="flex items-center gap-2.5"> {/* 右側工具區容器(搜尋框與按鈕) */}
        <label className="hidden items-center gap-2 rounded-full border border-line bg-paper-2 px-3 py-1.5 text-muted sm:flex"> {/* 搜尋框外框，手機隱藏、桌機顯示 */}
          <IconSearch className="h-3.5 w-3.5 flex-none" /> {/* 搜尋圖示 */}
          <input
            type="text" // 輸入框型別為純文字
            placeholder="搜尋文章、作品或賽事…" // 輸入框提示文字
            className="w-44 bg-transparent text-[12.5px] text-ink placeholder:text-muted focus:outline-none" // 輸入框樣式，透明背景、無外框線
          />
        </label>
        <button
          type="button" // 按鈕型別為一般按鈕(不會觸發表單送出)
          className="rounded-full border border-line bg-paper-2 px-3.5 py-1.5 text-[13px] font-semibold hover:bg-paper-3" // 按鈕外觀樣式，含 hover 效果
        >
          檢視前台 {/* 按鈕文字 */}
        </button>
      </div>
    </header>
  );
}
