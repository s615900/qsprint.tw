"use client"; // 標記為 Client Component，因為要用到 useActionState

import { useActionState } from "react"; // 匯入 React 的表單狀態 hook
import { login, type LoginState } from "./actions"; // 匯入登入 Server Action 與狀態型別

const initialState: LoginState = {}; // 表單初始狀態，尚未有錯誤訊息

export default function LoginForm() { // 匯出登入表單元件
  const [state, formAction, pending] = useActionState(login, initialState); // 綁定 Server Action，取得狀態、送出函式與送出中旗標

  return (
    <form action={formAction} className="mt-5 flex flex-col gap-3"> {/* 表單容器，送出時呼叫 login action */}
      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-semibold text-ink-soft">密碼</span> {/* 欄位標籤 */}
        <input
          type="password"
          name="password" // 對應 formData 裡的欄位名稱
          required
          autoFocus
          className="rounded-lg border border-line bg-paper-2 px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-gold/40"
        />
      </label>
      {state.error && <p className="text-[12.5px] text-coral">{state.error}</p>} {/* 有錯誤訊息才顯示 */}
      <button
        type="submit"
        disabled={pending}
        className="mt-1.5 rounded-full bg-gold px-4 py-2 text-[13px] font-semibold text-paper hover:bg-gold/90 disabled:opacity-60"
      >
        {pending ? "登入中…" : "登入"} {/* 依送出狀態切換按鈕文字 */}
      </button>
    </form>
  );
}
