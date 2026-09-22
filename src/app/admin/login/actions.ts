"use server"; // 標記這個檔案裡的函式都是 Server Function

import { cookies } from "next/headers"; // 匯入 Next.js 的 cookies 存取工具
import { redirect } from "next/navigation"; // 匯入導頁函式
import { ADMIN_SESSION_COOKIE, adminSessionToken, verifyAdminPassword } from "@/lib/auth"; // 匯入登入驗證相關函式

export interface LoginState { // 登入表單的狀態，用來回傳錯誤訊息給前端
  error?: string;
}

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> { // 處理登入表單送出
  const password = String(formData.get("password") ?? ""); // 取出使用者輸入的密碼

  if (!verifyAdminPassword(password)) { // 密碼錯誤就回傳錯誤訊息，讓表單顯示
    return { error: "密碼錯誤,請再試一次。" };
  }

  const cookieStore = await cookies(); // 取得可寫入的 cookie 存取器
  cookieStore.set(ADMIN_SESSION_COOKIE, adminSessionToken(), { // 寫入登入憑證
    httpOnly: true, // 禁止前端 JS 讀取，降低 XSS 風險
    secure: process.env.NODE_ENV === "production", // 正式環境限定只能透過 HTTPS 傳送
    sameSite: "lax", // 一般導覽情境下會帶上 cookie，同時降低 CSRF 風險
    path: "/", // 全站都適用
    maxAge: 60 * 60 * 24 * 7, // 有效期限 7 天
  });

  redirect("/admin"); // 登入成功導回後台首頁
}

export async function logout(): Promise<void> { // 處理登出
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE); // 清除登入憑證
  redirect("/admin/login"); // 導回登入頁
}
