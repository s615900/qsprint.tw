"use client"; // 標記為客戶端元件，因為用到 usePathname

import { usePathname } from "next/navigation"; // 匯入取得目前網址路徑的 hook
import SiteHeader from "./SiteHeader"; // 匯入網站頁首元件
import SiteFooter from "./SiteFooter"; // 匯入網站頁尾元件

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  // 外層版面元件，依路徑決定是否顯示共用頁首/頁尾，children 為被包住的頁面內容
  const pathname = usePathname(); // 取得目前所在的網址路徑

  if (pathname?.startsWith("/admin")) {
    // 如果是後台管理頁面路徑
    return <>{children}</>; // 後台頁面不套用一般頁首頁尾，直接渲染內容
  }

  return ( // 一般前台頁面
    <>
      <SiteHeader /> {/* 顯示共用頁首 */}
      <main>{children}</main> {/* 顯示主要頁面內容 */}
      <SiteFooter /> {/* 顯示共用頁尾 */}
    </>
  );
}
