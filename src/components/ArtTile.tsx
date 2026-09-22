export type IconId = // 匯出可用的圖示 ID 聯合型別
  | "lanes" // 分道線圖示
  | "hurdle" // 跨欄圖示
  | "baton" // 接力棒圖示
  | "tape" // 終點線膠帶圖示
  | "podium" // 頒獎台圖示
  | "stopwatch" // 碼表圖示
  | "flags" // 旗幟圖示
  | "stands" // 看台圖示
  | "blocks"; // 起跑器圖示

interface ArtTileProps { // 定義 ArtTile 元件的 props 型別
  toneA: string; // 漸層色的第一個顏色
  toneB: string; // 漸層色的第二個顏色
  icon: IconId; // 要顯示的圖示 ID
  rounded?: boolean; // 是否使用圓角，預設不使用
  className?: string; // 額外的 CSS class
}

export default function ArtTile({ // 定義並匯出 ArtTile 元件
  toneA, // 解構取出第一個顏色
  toneB, // 解構取出第二個顏色
  icon, // 解構取出圖示 ID
  rounded = false, // 解構取出圓角設定，預設 false
  className = "", // 解構取出額外 class，預設空字串
}: ArtTileProps) {
  return ( // 回傳這個色塊/圖示磚的 JSX
    <div
      className={`relative h-full w-full overflow-hidden bg-paper-3 ${
        rounded ? "rounded-[14px]" : "" // 依 rounded 決定是否套用圓角樣式
      } ${className}`} // 附加外部傳入的 class
    >
      {/* 背景漸層層，使用內嵌 style 動態產生放射狀漸層 */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(135% 135% at 22% 15%, ${toneA} 0%, ${toneB} 72%)`, // 依 toneA/toneB 產生放射狀漸層色
        }}
      />
      {/* 圖示層，透過 <use> 參照全域定義好的 SVG symbol */}
      <svg
        className="absolute inset-0 h-full w-full text-ink/50 opacity-65"
        viewBox="0 0 400 300" // 定義 SVG 的可視座標範圍
        aria-hidden="true" // 對輔助科技隱藏，因為純為裝飾用途
      >
        <use href={`#s-${icon}`} /> {/* 依 icon 參照對應的 SVG symbol id */}
      </svg>
      {/* 內陰影層，營造邊緣暗角視覺效果，且不攔截滑鼠事件 */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_5vw_rgba(30,36,48,0.28)]" />
    </div>
  );
}
