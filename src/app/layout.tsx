import type { Metadata } from "next"; // 從 next 匯入 Metadata 型別，用來定義網頁的中繼資料
import IconSprite from "@/components/Icons"; // 匯入 IconSprite 元件，會在 body 內插入共用的 SVG 圖示集
import SiteChrome from "@/components/SiteChrome"; // 匯入 SiteChrome 元件，用來包裹頁面內容並提供共用外框(如 header/footer)
import "./globals.css"; // 匯入全域 CSS 樣式表

export const metadata: Metadata = { // 匯出符合 Next.js 規範的 metadata 物件，供框架自動產生 <head> 內容
  title: { // 設定網頁標題的規則
    template: "%s ・ 青春止秒", // 子頁面標題樣板，%s 會被子頁面自訂標題取代
    default: "青春止秒攝影集", // 沒有指定子頁面標題時使用的預設標題
  },
  description: // 網站的預設描述文字(SEO 用)
    "田徑賽事攝影工作室的部落格式官網示範,以新聞報導版面呈現賽事花絮、作品集與合作邀約。", // 描述內容本體
};

export default function RootLayout({ children }: LayoutProps<"/">) { // 匯出根版面元件，接收 children 作為要包裹的頁面內容
  return ( // 回傳整個 HTML 結構
    <html lang="zh-TW"> {/* 根 html 標籤，設定語系為繁體中文(台灣) */}
      <head> {/* 網頁的 head 區塊，放置中繼資料與外部資源連結 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" /> {/* 預先建立與 Google Fonts API 網域的連線，加速字型載入 */}
        <link
          rel="preconnect" // 預先建立連線
          href="https://fonts.gstatic.com" // 目標網域為實際存放字型檔的 gstatic
          crossOrigin="anonymous" // 跨網域請求不攜帶憑證
        />
        {/* next/font/google can't reliably self-host the Traditional Chinese subset for these fonts */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet" // 引入外部字型的樣式表
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@500;600;700;900&family=Noto+Sans+TC:wght@400;500;600;700&family=Bebas+Neue&display=swap" // 指定要載入的字型家族與粗細清單
        />
      </head>
      <body className="bg-paper font-body text-ink antialiased"> {/* body 標籤，套用背景色、內文字型、文字顏色與反鋸齒樣式 */}
        <IconSprite /> {/* 插入共用的 SVG 圖示集，供全站元件透過 <use> 引用 */}
        <SiteChrome>{children}</SiteChrome> {/* 用共用外框包住當前頁面內容並渲染 */}
      </body>
    </html>
  );
}
