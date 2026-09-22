import { NextResponse } from "next/server"; // 匯入 Next.js 的回應工具
import type { NextRequest } from "next/server"; // 匯入請求型別
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/auth"; // 匯入後台登入驗證相關函式

// 保護 /admin 路徑：沒有有效登入憑證就導向登入頁。
// 注意：Server Actions 是以 POST 打到頁面自己的路徑，所以這裡的保護也涵蓋了後台的新增/修改/刪除操作；
// 但每個 Server Action 內部仍會各自再檢查一次登入狀態，避免只靠這層防護。
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") { // 登入頁本身不需要驗證，否則會導向迴圈
    return NextResponse.next();
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidAdminSession(session)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
