import type { Metadata } from "next"; // 匯入 Next.js 的 Metadata 型別，用來定義頁面 SEO 資訊

export const metadata: Metadata = { // 匯出管理後台區段共用的中繼資料設定
  title: "管理後台", // 網頁標題
}; // metadata 設定結束

export default function AdminLayout({ children }: { children: React.ReactNode }) { // 匯出管理後台的版面配置元件，接收子頁面內容
  return children; // 直接原樣回傳子頁面內容，不額外包裝版面
} // 結束 AdminLayout 元件
