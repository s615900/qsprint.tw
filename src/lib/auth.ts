import { createHash, timingSafeEqual } from "node:crypto"; // 匯入雜湊與安全比較函式，避免時間差攻擊

export const ADMIN_SESSION_COOKIE = "qsprint_admin_session"; // 後台登入狀態使用的 cookie 名稱

function adminPassword(): string { // 讀取後台密碼環境變數
  return process.env.ADMIN_PASSWORD ?? "";
}

function safeEqual(a: string, b: string): boolean { // 以固定時間比較兩個字串，避免密碼比對被側錄時間差破解
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export function verifyAdminPassword(password: string): boolean { // 驗證使用者輸入的密碼是否正確
  const secret = adminPassword();
  if (!secret) return false; // 沒有設定密碼時一律視為驗證失敗，避免意外開放後台
  return safeEqual(password, secret);
}

export function adminSessionToken(): string { // 產生登入成功後要寫入 cookie 的憑證值
  // 憑證由密碼雜湊而來：知道密碼才算得出來，且不會把明文密碼存進 cookie。
  return createHash("sha256").update(`qsprint-admin-session:${adminPassword()}`).digest("hex");
}

export function isValidAdminSession(cookieValue: string | undefined): boolean { // 驗證 cookie 是否為有效的登入憑證
  if (!cookieValue || !adminPassword()) return false;
  return safeEqual(cookieValue, adminSessionToken());
}
