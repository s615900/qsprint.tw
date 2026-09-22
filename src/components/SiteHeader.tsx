"use client"; // 標記為客戶端元件，因為裡面用到 useState 等瀏覽器端 hook

import { useState } from "react"; // 匯入 React 的狀態管理 hook
import Image from "next/image"; // 匯入 Next.js 最佳化圖片元件
import Link from "next/link"; // 匯入 Next.js 客戶端導覽連結元件
import { usePathname } from "next/navigation"; // 匯入取得目前網址路徑的 hook
import { navLinks } from "@/lib/content"; // 匯入導覽選單資料
import SocialLinks from "./SocialLinks"; // 匯入社群連結元件

export default function SiteHeader() { // 網站頁首元件
  const pathname = usePathname(); // 取得目前所在的網址路徑，用來判斷高亮哪個選單項目
  const [menuOpen, setMenuOpen] = useState(false); // 手機版選單是否展開的狀態

  return ( // 回傳頁首的 JSX 內容
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-[rgba(255,251,244,0.9)] backdrop-blur-md">
      {/* 置頂固定、半透明模糊背景的頁首容器 */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        {/* 頁首內容置中、左右對齊的區塊 */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          {/* 點回首頁的 logo 連結 */}
          <Image
            src="/images/qsprint-icon-v2.png" // logo 圖片路徑
            alt="" // 裝飾用圖片，不需替代文字
            width={468} // 原始寬度
            height={341} // 原始高度
            className="h-10 w-auto flex-none" // 固定高度、寬度依比例縮放
            priority // 優先載入此圖片
          />
          <span className="leading-tight">
            {/* logo 旁的品牌文字區塊 */}
            <span className="block font-display text-[1.05rem] font-bold tracking-wide">
              青春止秒
            </span>
            {/* 中文品牌名稱 */}
            <span className="mt-0.5 block text-[0.6rem] tracking-[0.16em] text-muted">
              TIME STOPS AT YOUTH
            </span>
            {/* 英文標語 */}
          </span>
        </Link>

        <nav aria-label="主導覽" className="hidden gap-6 lg:flex">
          {/* 桌面版主導覽列，手機版隱藏 */}
          {navLinks.map((link) => ( // 走訪每個導覽連結資料
            <Link
              key={link.href} // React 列表需要的唯一 key
              href={link.href} // 連結目標網址
              className={`border-b-2 pb-0.5 text-[0.86rem] tracking-wide no-underline transition-colors ${
                pathname === link.href // 判斷目前路徑是否等於此連結
                  ? "border-gold text-ink" // 目前頁面：金色底線、深色文字
                  : "border-transparent text-ink-soft hover:border-gold hover:text-ink" // 非目前頁面：透明底線、hover 才變色
              }`}
            >
              {link.label} {/* 顯示連結文字 */}
            </Link>
          ))}
        </nav>

        <a
          href="https://lin.ee/wsZVOO7" // LINE 官方帳號連結
          target="_blank" // 開新分頁
          rel="noopener" // 安全性設定，避免新分頁存取原分頁 window 物件
          className="hidden whitespace-nowrap bg-ink px-[1.1rem] py-[0.6rem] font-clock text-[0.9rem] tracking-[0.1em] text-paper no-underline transition-colors hover:bg-coral lg:inline-block"
        >
          賽事合作洽詢 {/* 桌面版顯示的合作洽詢按鈕文字 */}
        </a>

        <button
          type="button" // 一般按鈕，非表單送出按鈕
          aria-label={menuOpen ? "關閉選單" : "開啟選單"} // 無障礙標籤依開合狀態切換文字
          aria-expanded={menuOpen} // 無障礙屬性，標示選單是否展開
          onClick={() => setMenuOpen((v) => !v)} // 點擊切換選單開合狀態
          className="flex h-10 w-10 flex-none flex-col items-center justify-center gap-[5px] border border-ink lg:hidden"
        >
          {/* 手機版漢堡選單按鈕，桌面版隱藏 */}
          <span
            className={`h-[2px] w-5 bg-ink transition-transform ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          {/* 漢堡圖示第一條線，展開時旋轉成叉叉的一半 */}
          <span
            className={`h-[2px] w-5 bg-ink transition-transform ${menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
          {/* 漢堡圖示第二條線，展開時旋轉成叉叉的另一半 */}
        </button>
      </div>

      {menuOpen && ( // 選單展開時才渲染以下手機版選單內容
        <div className="border-t-2 border-ink bg-paper lg:hidden">
          {/* 手機版下拉選單容器 */}
          <nav aria-label="行動裝置導覽" className="flex flex-col divide-y divide-line px-5 sm:px-8">
            {/* 手機版導覽列表 */}
            {navLinks.map((link) => ( // 走訪每個導覽連結資料
              <Link
                key={link.href} // React 列表需要的唯一 key
                href={link.href} // 連結目標網址
                onClick={() => setMenuOpen(false)} // 點擊連結後自動收合選單
                className={`py-3.5 text-[0.95rem] tracking-wide no-underline ${
                  pathname === link.href ? "text-coral" : "text-ink" // 目前頁面用珊瑚色，其餘用深色
                }`}
              >
                {link.label} {/* 顯示連結文字 */}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-4 border-t border-line px-5 py-4 sm:px-8">
            {/* 手機版選單下方的合作洽詢與社群連結區塊 */}
            <a
              href="https://lin.ee/wsZVOO7" // LINE 官方帳號連結
              target="_blank" // 開新分頁
              rel="noopener" // 安全性設定
              onClick={() => setMenuOpen(false)} // 點擊後收合選單
              className="inline-flex w-fit items-center bg-ink px-[1.1rem] py-[0.6rem] font-clock text-[0.9rem] tracking-[0.1em] text-paper no-underline"
            >
              賽事合作洽詢 {/* 手機版顯示的合作洽詢按鈕文字 */}
            </a>
            <SocialLinks /> {/* 顯示社群連結圖示 */}
          </div>
        </div>
      )}
    </header>
  );
}
