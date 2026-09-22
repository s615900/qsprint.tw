import type { ComponentType } from "react"; // 匯入 React 元件型別，用來標註圖示元件的型別
import { portfolio } from "@/lib/content"; // 匯入仍為靜態資料的作品集，用來顯示數量徽章
import { logout } from "@/app/admin/login/actions"; // 匯入登出 Server Action
import {
  IconGrid, // 總覽圖示
  IconLayers, // 首頁焦點圖示
  IconDoc, // 最新消息圖示
  IconImage, // 作品集圖示
  IconCalendar, // 賽事行事曆圖示
  IconGear, // 網站設定圖示
} from "./AdminIcons";

export type AdminSection = // 後台可切換的分頁區段型別
  | "dashboard" // 總覽
  | "hero" // 首頁焦點
  | "news" // 最新消息
  | "portfolio" // 作品集
  | "schedule" // 賽事行事曆
  | "settings"; // 網站設定

interface NavItem {
  id: AdminSection; // 對應的分頁識別碼
  label: string; // 選單顯示文字
  icon: ComponentType<{ className?: string }>; // 選單圖示元件
  count?: number; // 選單旁顯示的數量徽章（選填）
}

const overviewNav: NavItem[] = [{ id: "dashboard", label: "總覽", icon: IconGrid }];
// 「總覽」分組的選單項目

const siteNav: NavItem[] = [{ id: "settings", label: "網站設定", icon: IconGear }];
// 「網站」分組的選單項目

export default function AdminSidebar({
  active, // 目前選中的分頁
  onSelect, // 選擇分頁時的回呼函式
  heroCount, // 首頁焦點筆數(來自 MongoDB)
  newsCount, // 最新消息筆數(來自 MongoDB)
  scheduleCount, // 賽事筆數(來自 MongoDB)
}: {
  active: AdminSection;
  onSelect: (section: AdminSection) => void;
  heroCount: number;
  newsCount: number;
  scheduleCount: number;
}) {
  const contentNav: NavItem[] = [ // 「內容管理」分組的選單項目，數量來自父層傳入的真實資料
    { id: "hero", label: "首頁焦點", icon: IconLayers, count: heroCount },
    { id: "news", label: "最新消息", icon: IconDoc, count: newsCount },
    { id: "portfolio", label: "作品集", icon: IconImage, count: portfolio.length },
    { id: "schedule", label: "賽事行事曆", icon: IconCalendar, count: scheduleCount },
  ];
  return ( // 回傳後台側邊欄的 JSX
    <aside className="sticky top-0 flex h-screen w-56 flex-none flex-col gap-6 overflow-y-auto bg-ink px-3.5 py-5 text-paper">
      {/* 固定在畫面左側、滿版高度可捲動的側邊欄 */}
      <div className="flex flex-col gap-3.5 px-2">
        {/* 品牌 logo 與標語區塊 */}
        <div className="flex items-center gap-2.5">
          {/* logo 圖示與文字橫向排列 */}
          <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br from-peach to-coral text-ink">
            {/* 漸層底色的圖示外框 */}
            <svg viewBox="0 0 400 300" className="h-5 w-5">
              {/* 碼表 svg 圖示 */}
              <use href="#s-stopwatch" /> {/* 引用共用 svg symbol */}
            </svg>
          </div>
          <div className="leading-tight">
            {/* 品牌文字區塊 */}
            <p className="font-display text-base font-bold">青春止秒</p> {/* 中文品牌名稱 */}
            <p className="text-[10.5px] tracking-wide text-paper/60">Qsprint Backstage</p>
            {/* 英文後台標語 */}
          </div>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-2.5 py-1 text-[10px] tracking-wide text-peach">
          作品集・網站設定 尚未串接資料庫 {/* 提示這兩個分頁目前仍是介面預覽 */}
        </span>
      </div>

      <nav className="flex flex-col gap-4">
        {/* 三個分組的導覽選單 */}
        <NavGroup label="總覽" items={overviewNav} active={active} onSelect={onSelect} />
        {/* 總覽分組 */}
        <NavGroup label="內容管理" items={contentNav} active={active} onSelect={onSelect} />
        {/* 內容管理分組 */}
        <NavGroup label="網站" items={siteNav} active={active} onSelect={onSelect} />
        {/* 網站設定分組 */}
      </nav>

      <div className="mt-auto flex items-center gap-2.5 border-t border-paper/10 pt-3.5">
        {/* 底部使用者資訊區塊，mt-auto 讓它貼齊底部 */}
        <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-gold text-[11px] font-bold text-ink">
          WT {/* 使用者姓名縮寫頭像 */}
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          {/* 使用者姓名與職稱文字 */}
          <p className="truncate text-[12.5px] font-semibold">吳蔚德</p> {/* 使用者姓名 */}
          <p className="text-[11px] text-paper/55">內容編輯</p> {/* 使用者職稱 */}
        </div>
        <form action={logout}> {/* 登出表單，送出即呼叫登出 Server Action */}
          <button type="submit" className="flex-none text-[11px] text-paper/55 underline-offset-2 hover:text-paper hover:underline">
            登出
          </button>
        </form>
      </div>
    </aside>
  );
}

function NavGroup({
  label, // 分組標題
  items, // 分組內的選單項目
  active, // 目前選中的分頁
  onSelect, // 選擇分頁的回呼函式
}: {
  label: string;
  items: NavItem[];
  active: AdminSection;
  onSelect: (section: AdminSection) => void;
}) {
  return ( // 回傳單一分組的選單列表
    <div>
      <p className="mb-1 px-2.5 text-[10px] tracking-[0.15em] text-paper/45">{label}</p>
      {/* 分組標題文字 */}
      <div className="flex flex-col gap-0.5">
        {/* 選單項目垂直排列 */}
        {items.map((item) => { // 走訪分組內每一個選單項目
          const isActive = item.id === active; // 判斷此項目是否為目前選中的分頁
          const Icon = item.icon; // 取出對應圖示元件（大寫開頭才能當 JSX 元件使用）
          return ( // 回傳單一選單按鈕
            <button
              key={item.id} // React 列表需要的唯一 key
              type="button" // 一般按鈕
              onClick={() => onSelect(item.id)} // 點擊時通知父層切換到此分頁
              className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium transition-colors ${
                isActive ? "bg-gold/15 text-peach" : "text-paper/65 hover:bg-paper/5 hover:text-paper"
                // 選中狀態使用金色系樣式，否則使用淡色並在 hover 時變化
              }`}
            >
              <Icon className="h-4 w-4 flex-none" /> {/* 顯示選單圖示 */}
              <span>{item.label}</span> {/* 顯示選單文字 */}
              {typeof item.count === "number" && ( // 若有提供數量才顯示徽章
                <span
                  className={`ml-auto rounded-full px-1.5 py-px text-[10.5px] ${
                    isActive ? "bg-gold/25 text-peach" : "bg-paper/10 text-paper/55"
                    // 選中狀態徽章較亮，否則使用淡色
                  }`}
                >
                  {item.count} {/* 顯示數量 */}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
