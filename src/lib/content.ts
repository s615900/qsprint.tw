// 首頁焦點(HeroSlide)、最新消息(NewsItem)、賽事行事曆(ScheduleItem)、作品集(PortfolioAlbum)已改由 MongoDB 提供資料，
// 對應型別與 CRUD 函式請見 src/lib/db.ts；這裡只保留仍為靜態資料的內容。

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
