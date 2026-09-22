import type { Metadata } from "next"; // 匯入中繼資料型別
import LoginForm from "./LoginForm"; // 匯入登入表單元件

export const metadata: Metadata = { // 登入頁的中繼資料
  title: "後台登入",
};

export default function AdminLoginPage() { // 匯出登入頁面元件
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5"> {/* 全螢幕置中容器 */}
      <div className="w-full max-w-sm rounded-2xl border border-paper/10 bg-paper p-7 text-ink"> {/* 登入卡片 */}
        <p className="font-display text-lg font-bold">青春止秒</p> {/* 品牌名稱 */}
        <p className="mt-0.5 text-[12.5px] text-ink-soft">請輸入密碼以進入管理後台</p> {/* 說明文字 */}
        <LoginForm />
      </div>
    </div>
  );
}
