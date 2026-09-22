export interface PageLinkOption { // 後台「按鈕連結」下拉選單的單一選項
  value: string; // 連結路徑
  label: string; // 選單顯示文字
}

export const pageLinkOptions: PageLinkOption[] = [ // 網站上可以連過去的頁面清單
  { value: "/", label: "首頁" },
  { value: "/news", label: "最新消息" },
  { value: "/portfolio", label: "作品集" },
  { value: "/about", label: "關於我們" },
  { value: "/schedule", label: "賽事行事曆" },
];
