import type { IconId } from "@/components/ArtTile"; // 從 ArtTile 元件匯入圖示 ID 的型別，供下面資料標註使用

export interface Tone { // 定義「色調」的型別：用兩個顏色加一個圖示代表一組視覺風格
  a: string; // 第一個顏色（通常是主色）
  b: string; // 第二個顏色（通常是輔色）
  icon: IconId; // 對應的圖示代號
} // 結束 Tone 型別定義

export interface HeroSlide { // 定義首頁大圖輪播（Hero）單一投影片的資料結構
  tag: string; // 分類標籤文字，例如「賽事直擊」
  titleLines: string[]; // 標題文字，拆成多行陣列方便版面換行
  description: string; // 這張投影片的說明文字
  author: string; // 作者/編輯部名稱
  date: string; // 發佈日期
  readTime: string; // 閱讀時間或行動提示文字
  ctaLabel: string; // 行動呼籲按鈕的文字
  ctaHref: string; // 行動呼籲按鈕的連結網址
  image: { src: string; alt: string }; // 投影片的圖片來源與替代文字
} // 結束 HeroSlide 型別定義

export const heroSlides: HeroSlide[] = [ // 匯出首頁輪播用的投影片資料陣列
  { // 第一張投影片開始
    tag: "賽事直擊", // 標籤：賽事直擊
    titleLines: ["終點線前", "0.03 秒", "我們替你按下快門"], // 三行標題文字
    description: // 說明文字（下一行接續）
      "115學年度全國中等學校運動會落幕,四天賽程、超過六十場徑賽決賽,青春止秒的鏡頭沒有錯過任何一次衝線。", // 說明內容本文
    author: "青春止秒編輯部", // 作者
    date: "2026.04.23", // 日期
    readTime: "閱讀 4 分鐘", // 預估閱讀時間
    ctaLabel: "閱讀全文 →", // 按鈕文字
    ctaHref: "/news", // 按鈕連結到新聞頁
    image: { src: "/images/track-03-hurdles.jpg", alt: "選手在起跑器上握著接力棒,準備起跑" }, // 圖片路徑與替代文字
  }, // 第一張投影片結束
  { // 第二張投影片開始
    tag: "賽事直擊", // 標籤：賽事直擊
    titleLines: ["大隊接力最後一棒", "交棒零點幾秒", "決定了名次"], // 三行標題文字
    description: // 說明文字（下一行接續）
      "接力區裡沒有人在乎誰跑得漂亮,只有誰先把棒子穩穩交出去。這一次,我們蹲在交接區外側,等那零點幾秒。", // 說明內容本文
    author: "青春止秒編輯部", // 作者
    date: "2026.04.20", // 日期
    readTime: "閱讀 3 分鐘", // 預估閱讀時間
    ctaLabel: "閱讀內文 →", // 按鈕文字
    ctaHref: "/news", // 按鈕連結到新聞頁
    image: { src: "/images/track-05-finish-line.jpg", alt: "大隊接力選手在交接區內全力衝刺" }, // 圖片路徑與替代文字
  }, // 第二張投影片結束
  { // 第三張投影片開始
    tag: "精選報導", // 標籤：精選報導
    titleLines: ["跑道有多長", "青春就有多長"], // 兩行標題文字
    description: // 說明文字（下一行接續）
      "她說,這是高中生涯的最後一次上場。有些照片不是為了紀錄名次,而是為了留住一個人曾經那麼用力活過的證據。", // 說明內容本文
    author: "青春止秒編輯部", // 作者
    date: "2026.03.29", // 日期
    readTime: "閱讀 5 分鐘", // 預估閱讀時間
    ctaLabel: "閱讀內文 →", // 按鈕文字
    ctaHref: "/news", // 按鈕連結到新聞頁
    image: { src: "/images/track-01-sprint-start.jpg", alt: "夕陽餘光灑落在田徑跑道的彎道上" }, // 圖片路徑與替代文字
  }, // 第三張投影片結束
  { // 第四張投影片開始
    tag: "賽事公告", // 標籤：賽事公告
    titleLines: ["115學年度下半年", "賽程總覽", "我們接下來會在哪裡"], // 三行標題文字
    description: // 說明文字（下一行接續）
      "從新北到高雄,秋季田徑賽季正式開跑,以下是青春止秒團隊確定進場拍攝的賽事清單。", // 說明內容本文
    author: "青春止秒編輯部", // 作者
    date: "2026.09.01", // 日期
    readTime: "查看完整賽程", // 這裡用來顯示行動提示文字而非閱讀時間
    ctaLabel: "查看賽事行事曆 →", // 按鈕文字
    ctaHref: "/schedule", // 按鈕連結到賽程頁
    image: { // 圖片欄位開始（拆成多行）
      src: "/images/track-04-stadium.jpg", // 圖片路徑
      alt: "田徑場跑道上的 4x100 與 4x400 接力交接區標線", // 圖片替代文字
    }, // 圖片欄位結束
  }, // 第四張投影片結束
]; // heroSlides 陣列結束

export interface NewsItem { // 定義新聞列表單筆項目的資料結構
  tag: string; // 分類標籤
  title: string; // 新聞標題
  excerpt: string; // 新聞摘要
  meta: string; // 附加資訊，如日期與分類文字
  tone: Tone; // 對應的色調設定
} // 結束 NewsItem 型別定義

export interface ScheduleItem { // 定義單一賽程項目的資料結構
  date: string; // 賽事日期
  event: string; // 賽事名稱
  place: string; // 比賽地點
} // 結束 ScheduleItem 型別定義

export interface PortfolioShot { // 定義作品集單張照片的資料結構
  caption: string; // 照片說明文字
  place: string; // 拍攝地點
  date: string; // 拍攝日期
  tone: Tone; // 對應的色調設定
  photo?: string; // 可選的實際照片路徑（沒有的話用色塊代替）
} // 結束 PortfolioShot 型別定義

export const schedule: ScheduleItem[] = [ // 匯出賽事行事曆資料陣列
  { date: "09.19 – 09.21", event: "新北市中等學校田徑錦標賽", place: "新北田徑場" }, // 第一場賽事：日期、名稱、地點
  { date: "10.03 – 10.05", event: "全國大專校院田徑公開賽", place: "高雄國家體育場" }, // 第二場賽事：日期、名稱、地點
  { date: "10.24", event: "樂活盃校際大隊接力邀請賽", place: "臺北田徑場" }, // 第三場賽事：日期、名稱、地點
  { date: "11.14 – 11.15", event: "中區聯合運動會", place: "臺中洲際田徑場" }, // 第四場賽事：日期、名稱、地點
  { date: "12.05", event: "城市青年田徑邀請賽", place: "桃園青埔田徑場" }, // 第五場賽事：日期、名稱、地點
]; // schedule 陣列結束

export const news: NewsItem[] = [ // 匯出新聞列表資料陣列
  { // 第一則新聞開始
    tag: "賽事直擊", // 分類標籤
    title: "大隊接力最後一棒:交棒零點幾秒,決定了名次", // 標題
    excerpt: // 摘要（下一行接續）
      "接力區裡沒有人在乎誰跑得漂亮,只有誰先把棒子穩穩交出去。這一次,我們蹲在交接區外側,等那零點幾秒。", // 摘要內容本文
    meta: "2026.04.20 · 田徑場邊記事", // 日期與分類文字
    tone: { a: "#FFB7C5", b: "#D58D3F", icon: "baton" }, // 色調設定：粉色、橘棕色、接力棒圖示
  }, // 第一則新聞結束
  { // 第二則新聞開始
    tag: "幕後故事", // 分類標籤
    title: "起跑槍響前的三秒,選手在想什麼?", // 標題
    excerpt: // 摘要（下一行接續）
      "起跑器卡好、深呼吸、裁判舉旗——我們把鏡頭對準的,是槍響前最安靜的三秒。", // 摘要內容本文
    meta: "2026.04.18 · 幕後故事", // 日期與分類文字
    tone: { a: "#FFD699", b: "#1E2430", icon: "blocks" }, // 色調設定：黃色、深藍灰、起跑器圖示
  }, // 第二則新聞結束
  { // 第三則新聞開始
    tag: "賽事直擊", // 分類標籤
    title: "跨欄選手的節奏課:三步上欄,一步都不能亂", // 標題
    excerpt: // 摘要（下一行接續）
      "110公尺跨欄的勝負,往往在第三欄前就已經決定。我們用連拍記錄下每一步的落地角度。", // 摘要內容本文
    meta: "2026.04.15 · 田徑場邊記事", // 日期與分類文字
    tone: { a: "#F8EFE2", b: "#D58D3F", icon: "hurdle" }, // 色調設定：米白色、橘棕色、跨欄圖示
  }, // 第三則新聞結束
  { // 第四則新聞開始
    tag: "頒獎時刻", // 分類標籤
    title: "站上頒獎台的三秒鐘,比賽跑還珍貴", // 標題
    excerpt: // 摘要（下一行接續）
      "領獎、敬禮、看著隊旗升起——這是選手們練習了一整個學期才等到的畫面。", // 摘要內容本文
    meta: "2026.04.12 · 頒獎時刻", // 日期與分類文字
    tone: { a: "#FFD699", b: "#766D63", icon: "podium" }, // 色調設定：黃色、灰棕色、頒獎台圖示
  }, // 第四則新聞結束
  { // 第五則新聞開始
    tag: "器材筆記", // 分類標籤
    title: "如何選一支追得上百米衝刺的鏡頭", // 標題
    excerpt: // 摘要（下一行接續）
      "我們最常被問的問題:拍田徑到底該用什麼鏡頭?這篇整理了這幾年在跑道邊踩過的坑。", // 摘要內容本文
    meta: "2026.04.08 · 器材筆記", // 日期與分類文字
    tone: { a: "#FDF6EC", b: "#D45757", icon: "stopwatch" }, // 色調設定：淺米色、紅色、碼表圖示
  }, // 第五則新聞結束
  { // 第六則新聞開始
    tag: "賽事公告", // 分類標籤
    title: "115學年度下半年賽程總覽:我們接下來會在哪裡", // 標題
    excerpt: // 摘要（下一行接續）
      "從新北到高雄,秋季田徑賽季正式開跑,以下是青春止秒團隊確定進場拍攝的賽事清單。", // 摘要內容本文
    meta: "2026.09.01 · 賽事公告", // 日期與分類文字
    tone: { a: "#FFB7C5", b: "#1E2430", icon: "flags" }, // 色調設定：粉色、深藍灰、旗幟圖示
  }, // 第六則新聞結束
]; // news 陣列結束

export const portfolio: PortfolioShot[] = [ // 匯出作品集照片資料陣列
  { caption: "大隊接力・交棒瞬間", place: "臺北田徑場", date: "2026.04.20", tone: { a: "#FFD699", b: "#D45757", icon: "baton" } }, // 第一張作品：說明、地點、日期、色調
  { caption: "110公尺跨欄、破大會紀錄", place: "新北田徑場", date: "2026.04.15", tone: { a: "#F8EFE2", b: "#D58D3F", icon: "hurdle" } }, // 第二張作品：說明、地點、日期、色調
  { caption: "田徑跑道・分道線特寫", place: "桃園青埔田徑場", date: "2026.03.29", tone: { a: "#FFB7C5", b: "#1E2430", icon: "lanes" }, photo: "/images/track-02-relay-baton.jpg" }, // 第三張作品：多了實際照片路徑
  { caption: "頒獎典禮・大會紀錄", place: "高雄國家體育場", date: "2026.03.15", tone: { a: "#FFD699", b: "#766D63", icon: "podium" } }, // 第四張作品：說明、地點、日期、色調
  { caption: "100公尺短跑・起跑瞬間", place: "臺中洲際田徑場", date: "2026.02.28", tone: { a: "#FDF6EC", b: "#D45757", icon: "blocks" } }, // 第五張作品：說明、地點、日期、色調
  { caption: "撐竿跳高・過竿瞬間", place: "新北田徑場", date: "2026.02.20", tone: { a: "#FFB7C5", b: "#D58D3F", icon: "stopwatch" } }, // 第六張作品：說明、地點、日期、色調
  { caption: "大隊接力・最後一棒衝線", place: "臺北田徑場", date: "2026.04.20", tone: { a: "#FFD699", b: "#D45757", icon: "tape" } }, // 第七張作品：說明、地點、日期、色調
  { caption: "田徑場邊・選手賽前伸展", place: "桃園青埔田徑場", date: "2026.03.29", tone: { a: "#F8EFE2", b: "#1E2430", icon: "flags" } }, // 第八張作品：說明、地點、日期、色調
]; // portfolio 陣列結束

export const stats = [ // 匯出首頁/關於頁使用的統計數字資料
  { value: "2019", label: "成立年份" }, // 統計項目：成立年份
  { value: "87+", label: "已記錄賽事場次" }, // 統計項目：已記錄賽事場次
  { value: "42", label: "合作學校 / 社團" }, // 統計項目：合作學校/社團數
  { value: "12萬+", label: "交付選手照片張數" }, // 統計項目：交付照片張數
]; // stats 陣列結束

export const navLinks = [ // 匯出導覽列連結資料
  { href: "/news", label: "最新消息" }, // 導覽項目：連到新聞頁
  { href: "/portfolio", label: "作品集" }, // 導覽項目：連到作品集頁
  { href: "/about", label: "關於我們" }, // 導覽項目：連到關於我們頁
  { href: "/schedule", label: "賽事行事曆" }, // 導覽項目：連到賽程頁
]; // navLinks 陣列結束

export const contactInfo = [ // 匯出聯絡資訊資料
  { label: "Email", value: "weite.wu@qsprinttw.com", href: "mailto:weite.wu@qsprinttw.com" }, // 聯絡方式：Email 與 mailto 連結
  { label: "Instagram", value: "@qsprint.tw", href: "https://instagram.com/qsprint.tw" }, // 聯絡方式：Instagram 帳號與連結
  { label: "服務範圍", value: "全台巡迴,可接受外縣市邀約" }, // 聯絡方式：服務範圍說明（沒有連結）
]; // contactInfo 陣列結束

export interface SocialLink { // 定義社群連結單筆項目的資料結構
  label: string; // 平台全名
  short: string; // 平台縮寫
  href: string; // 平台連結網址
  bg: string; // 顯示用的背景顏色
} // 結束 SocialLink 型別定義

export const socialLinks: SocialLink[] = [ // 匯出社群連結資料陣列
  { label: "Facebook", short: "FB", href: "https://www.facebook.com/profile.php?id=61576004819758", bg: "#1877F2" }, // Facebook 連結與品牌色
  { label: "Instagram", short: "IG", href: "https://instagram.com/qsprint.tw", bg: "#D6249F" }, // Instagram 連結與品牌色
]; // socialLinks 陣列結束
