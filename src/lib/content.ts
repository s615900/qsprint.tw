import type { IconId } from "@/components/ArtTile"; // 從 ArtTile 元件匯入圖示 ID 的型別，供下面資料標註使用

export interface Tone { // 定義「色調」的型別：用兩個顏色加一個圖示代表一組視覺風格
  a: string; // 第一個顏色（通常是主色）
  b: string; // 第二個顏色（通常是輔色）
  icon: IconId; // 對應的圖示代號
} // 結束 Tone 型別定義

// 首頁焦點(HeroSlide)、最新消息(NewsItem)、賽事行事曆(ScheduleItem)已改由 MongoDB 提供資料，
// 對應型別與 CRUD 函式請見 src/lib/db.ts；這裡只保留仍為靜態資料的內容。

export interface PortfolioShot { // 定義作品集單張照片的資料結構
  caption: string; // 照片說明文字
  place: string; // 拍攝地點
  date: string; // 拍攝日期
  tone: Tone; // 對應的色調設定
  photo?: string; // 可選的實際照片路徑（沒有的話用色塊代替）
} // 結束 PortfolioShot 型別定義

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
