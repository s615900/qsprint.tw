export default function IconSprite() { // 定義共用 SVG 圖示精靈（sprite）元件並預設匯出
  return ( // 回傳畫面內容
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true"> {/* 隱藏的 0x0 SVG，只用來定義可被 <use> 參照的符號 */}
      <defs> {/* 定義區塊，內含所有圖示符號 */}
        <symbol id="s-lanes" viewBox="0 0 400 300"> {/* 「跑道分道線」圖示符號 */}
          <path d="M-20,300 C100,175 300,175 420,300" fill="none" stroke="currentColor" strokeWidth="12" /> {/* 第一條跑道曲線，完全不透明 */}
          <path d="M-20,300 C100,210 300,210 420,300" fill="none" stroke="currentColor" strokeWidth="12" opacity=".7" /> {/* 第二條跑道曲線，透明度 0.7 */}
          <path d="M-20,300 C100,245 300,245 420,300" fill="none" stroke="currentColor" strokeWidth="12" opacity=".45" /> {/* 第三條跑道曲線，透明度 0.45 */}
        </symbol>
        <symbol id="s-hurdle" viewBox="0 0 400 300"> {/* 「跨欄」圖示符號 */}
          <g stroke="currentColor" strokeWidth="10" fill="none"> {/* 群組設定共用描邊樣式、不填色 */}
            <path d="M60,300 V170 H150 V300" /> {/* 第一個跨欄形狀 */}
            <path d="M195,300 V170 H285 V300" /> {/* 第二個跨欄形狀 */}
            <path d="M330,300 V170 H400 V300" /> {/* 第三個跨欄形狀 */}
          </g>
        </symbol>
        <symbol id="s-baton" viewBox="0 0 400 300"> {/* 「接力棒」圖示符號 */}
          <path d="M10,230 Q200,60 390,230" fill="none" stroke="currentColor" strokeWidth="10" /> {/* 拋物線代表傳遞軌跡 */}
          <rect x="185" y="45" width="34" height="12" fill="currentColor" transform="rotate(24 200 51)" /> {/* 旋轉的矩形代表接力棒本體 */}
        </symbol>
        <symbol id="s-tape" viewBox="0 0 400 300"> {/* 「終點線膠帶」圖示符號 */}
          <rect x="0" y="135" width="400" height="26" fill="currentColor" /> {/* 橫向終點膠帶主體 */}
          <g stroke="currentColor" strokeWidth="6"> {/* 群組設定共用描邊樣式 */}
            <line x1="30" y1="135" x2="55" y2="161" /> {/* 第一條斜紋裝飾線 */}
            <line x1="90" y1="135" x2="115" y2="161" /> {/* 第二條斜紋裝飾線 */}
            <line x1="150" y1="135" x2="175" y2="161" /> {/* 第三條斜紋裝飾線 */}
            <line x1="210" y1="135" x2="235" y2="161" /> {/* 第四條斜紋裝飾線 */}
            <line x1="270" y1="135" x2="295" y2="161" /> {/* 第五條斜紋裝飾線 */}
            <line x1="330" y1="135" x2="355" y2="161" /> {/* 第六條斜紋裝飾線 */}
          </g>
        </symbol>
        <symbol id="s-podium" viewBox="0 0 400 300"> {/* 「頒獎台」圖示符號 */}
          <g fill="currentColor"> {/* 群組設定共用填色 */}
            <rect x="40" y="185" width="95" height="115" /> {/* 第三名矮台座 */}
            <rect x="152" y="110" width="100" height="190" /> {/* 第一名最高台座 */}
            <rect x="270" y="155" width="95" height="145" /> {/* 第二名中等台座 */}
          </g>
        </symbol>
        <symbol id="s-stopwatch" viewBox="0 0 400 300"> {/* 「碼錶」圖示符號 */}
          <circle cx="200" cy="165" r="92" fill="none" stroke="currentColor" strokeWidth="10" /> {/* 碼錶外圈圓形 */}
          <rect x="182" y="48" width="36" height="20" fill="currentColor" /> {/* 頂部按鈕 */}
          <line x1="200" y1="165" x2="200" y2="98" stroke="currentColor" strokeWidth="7" /> {/* 分針指向上方 */}
          <line x1="200" y1="165" x2="252" y2="165" stroke="currentColor" strokeWidth="7" /> {/* 時針指向右方 */}
        </symbol>
        <symbol id="s-flags" viewBox="0 0 400 300"> {/* 「賽道旗幟」圖示符號 */}
          <line x1="0" y1="255" x2="400" y2="255" stroke="currentColor" strokeWidth="6" /> {/* 地面基準線 */}
          <g fill="currentColor"> {/* 群組設定共用填色 */}
            <polygon points="25,255 25,190 78,222" /> {/* 第一面旗幟三角形 */}
            <polygon points="150,255 150,200 198,227" /> {/* 第二面旗幟三角形 */}
            <polygon points="270,255 270,185 322,220" /> {/* 第三面旗幟三角形 */}
          </g>
        </symbol>
        <symbol id="s-stands" viewBox="0 0 400 300"> {/* 「觀眾看台」圖示符號 */}
          <g fill="currentColor"> {/* 群組設定共用填色 */}
            <rect x="0" y="235" width="400" height="22" /> {/* 最下層看台，完全不透明 */}
            <rect x="0" y="203" width="400" height="22" opacity=".78" /> {/* 第二層看台，透明度 0.78 */}
            <rect x="0" y="171" width="400" height="22" opacity=".56" /> {/* 第三層看台，透明度 0.56 */}
            <rect x="0" y="139" width="400" height="22" opacity=".38" /> {/* 第四層看台，透明度 0.38 */}
          </g>
        </symbol>
        <symbol id="s-blocks" viewBox="0 0 400 300"> {/* 「起跑器」圖示符號 */}
          <g fill="currentColor"> {/* 群組設定共用填色 */}
            <polygon points="40,300 40,235 105,258 105,300" /> {/* 第一個起跑器形狀 */}
            <polygon points="165,300 165,235 230,258 230,300" /> {/* 第二個起跑器形狀 */}
            <polygon points="290,300 290,235 355,258 355,300" /> {/* 第三個起跑器形狀 */}
          </g>
        </symbol>
      </defs> {/* 結束定義區塊 */}
    </svg> // 結束整個 SVG 精靈
  );
}
