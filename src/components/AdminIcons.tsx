interface IconProps { // 定義所有圖示元件共用的 props 型別
  className?: string; // 可選的 CSS class，用來控制大小顏色等
}

export function IconGrid({ className = "h-4 w-4" }: IconProps) { // 「格線」圖示元件，預設大小 h-4 w-4
  return ( // 回傳畫面內容
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"> {/* SVG 畫布設定 */}
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" /> {/* 左上角矩形 */}
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" /> {/* 右上角矩形 */}
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" /> {/* 左下角矩形 */}
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" /> {/* 右下角矩形 */}
    </svg>
  );
}

export function IconLayers({ className = "h-4 w-4" }: IconProps) { // 「圖層」圖示元件
  return ( // 回傳畫面內容
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"> {/* SVG 畫布設定 */}
      <path d="M12 3.5 20.5 8 12 12.5 3.5 8Z" /> {/* 最上層菱形 */}
      <path d="M3.5 12.5 12 17l8.5-4.5" /> {/* 中間層折線 */}
      <path d="M3.5 16.5 12 21l8.5-4.5" /> {/* 最下層折線 */}
    </svg>
  );
}

export function IconDoc({ className = "h-4 w-4" }: IconProps) { // 「文件」圖示元件
  return ( // 回傳畫面內容
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"> {/* SVG 畫布設定 */}
      <path d="M6 3h8l5 5v13H6z" /> {/* 文件外框，右上角折角 */}
      <path d="M14 3v5h5" /> {/* 折角的三角形線條 */}
      <path d="M9 13h6M9 17h6" /> {/* 兩條文字橫線 */}
    </svg>
  );
}

export function IconImage({ className = "h-4 w-4" }: IconProps) { // 「圖片」圖示元件
  return ( // 回傳畫面內容
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"> {/* SVG 畫布設定 */}
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" /> {/* 圖片外框 */}
      <circle cx="9" cy="10" r="1.6" /> {/* 代表太陽/焦點的小圓 */}
      <path d="M20 15.5 15.5 11 6 19" /> {/* 代表山脈的折線 */}
    </svg>
  );
}

export function IconCalendar({ className = "h-4 w-4" }: IconProps) { // 「行事曆」圖示元件
  return ( // 回傳畫面內容
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"> {/* SVG 畫布設定 */}
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" /> {/* 日曆外框 */}
      <path d="M3.5 9.5h17M8 3v4M16 3v4" /> {/* 頂部分隔線與兩個吊環 */}
    </svg>
  );
}

export function IconGear({ className = "h-4 w-4" }: IconProps) { // 「齒輪／設定」圖示元件
  return ( // 回傳畫面內容
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"> {/* SVG 畫布設定 */}
      <circle cx="12" cy="12" r="3.2" /> {/* 齒輪中心圓 */}
      <path d="M12 3.5v2.2M12 18.3v2.2M20.5 12h-2.2M5.7 12H3.5M17.7 6.3l-1.6 1.6M7.9 16.1l-1.6 1.6M17.7 17.7l-1.6-1.6M7.9 7.9 6.3 6.3" /> {/* 八個方向的齒尖線條 */}
    </svg>
  );
}

export function IconSearch({ className = "h-4 w-4" }: IconProps) { // 「搜尋」圖示元件
  return ( // 回傳畫面內容
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"> {/* SVG 畫布設定 */}
      <circle cx="10.5" cy="10.5" r="6.5" /> {/* 放大鏡鏡面圓形 */}
      <path d="M20 20l-4.8-4.8" /> {/* 放大鏡把手斜線 */}
    </svg>
  );
}

export function IconPencil({ className = "h-4 w-4" }: IconProps) { // 「鉛筆／編輯」圖示元件
  return ( // 回傳畫面內容
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"> {/* SVG 畫布設定 */}
      <path d="M4 20l1-4.2L15.6 5.2a1.6 1.6 0 0 1 2.3 0l1 1a1.6 1.6 0 0 1 0 2.3L8.2 19l-4.2 1Z" /> {/* 鉛筆外形路徑 */}
    </svg>
  );
}

export function IconTrash({ className = "h-4 w-4" }: IconProps) { // 「垃圾桶／刪除」圖示元件
  return ( // 回傳畫面內容
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"> {/* SVG 畫布設定 */}
      <path d="M5 7h14M9.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v2M7 7l.8 12a1.5 1.5 0 0 0 1.5 1.4h5.4a1.5 1.5 0 0 0 1.5-1.4L17 7" /> {/* 垃圾桶頂蓋、桶身與把手路徑 */}
    </svg>
  );
}

export function IconDrag({ className = "h-4 w-4" }: IconProps) { // 「拖曳把手」圖示元件（六個點）
  return ( // 回傳畫面內容
    <svg viewBox="0 0 24 24" className={className} fill="currentColor"> {/* SVG 畫布設定，實心填色 */}
      <circle cx="9" cy="6" r="1.4" /> {/* 左上點 */}
      <circle cx="15" cy="6" r="1.4" /> {/* 右上點 */}
      <circle cx="9" cy="12" r="1.4" /> {/* 左中點 */}
      <circle cx="15" cy="12" r="1.4" /> {/* 右中點 */}
      <circle cx="9" cy="18" r="1.4" /> {/* 左下點 */}
      <circle cx="15" cy="18" r="1.4" /> {/* 右下點 */}
    </svg>
  );
}

export function IconUpload({ className = "h-4 w-4" }: IconProps) { // 「上傳」圖示元件
  return ( // 回傳畫面內容
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"> {/* SVG 畫布設定 */}
      <path d="M12 15.5V4M8 8l4-4 4 4" /> {/* 向上箭頭線條 */}
      <path d="M4.5 15.5v3A1.8 1.8 0 0 0 6.3 20.3h11.4a1.8 1.8 0 0 0 1.8-1.8v-3" /> {/* 底部托盤形狀 */}
    </svg>
  );
}

export function IconCheck({ className = "h-4 w-4" }: IconProps) { // 「打勾」圖示元件
  return ( // 回傳畫面內容
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> {/* SVG 畫布設定 */}
      <path d="M5 12.5 10 17 19 7" /> {/* 打勾符號路徑 */}
    </svg>
  );
}
