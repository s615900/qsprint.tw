"use client"; // 標記為 Client Component，因為有文字編輯器、統計列的增減與儲存狀態

import { useActionState, useState } from "react"; // 匯入表單送出狀態與一般狀態 hook
import Link from "next/link"; // 匯入頁面導覽連結元件
import AdminImageField from "./AdminImageField"; // 匯入圖片上傳欄位元件
import RichTextEditor from "./RichTextEditor"; // 匯入與最新消息相同的文字編輯器
import type { AboutPage, AboutStat } from "@/lib/db"; // 匯入關於我們的型別
import { saveAboutPageAction } from "@/app/admin/actions"; // 匯入儲存關於我們的 Server Action

const inputClass = // 表單輸入框共用樣式
  "w-full rounded-lg border border-line bg-paper-2 px-3 py-2 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-gold/40";
const labelClass = "flex flex-col gap-1 text-[12.5px] font-semibold text-ink-soft"; // 表單欄位標籤共用樣式

export default function AdminAbout({ about }: { about: AboutPage }) { // 後台「關於我們」編輯分頁
  const [state, formAction, pending] = useActionState(saveAboutPageAction, { savedAt: null }); // 儲存狀態
  const [stats, setStats] = useState<(AboutStat & { key: number })[]>( // 統計數字列(key 只給 React 用)
    about.stats.map((stat, i) => ({ ...stat, key: i }))
  );

  function addStat() { // 新增一列空白統計
    setStats((prev) => [...prev, { value: "", label: "", key: Date.now() }]);
  }
  function removeStat(key: number) { // 刪除一列統計
    setStats((prev) => prev.filter((stat) => stat.key !== key));
  }

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="flex min-w-0 flex-col gap-2"> {/* 左側內文編輯器 */}
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold">關於我們內容</h2>
            <p className="mt-1 text-[12.5px] text-ink-soft">前台「關於我們」頁的主要內文。</p>
          </div>
          <Link href="/about" target="_blank" className="text-[12.5px] font-semibold text-gold hover:underline">
            檢視前台頁面 ↗
          </Link>
        </div>
        <RichTextEditor name="content" defaultValue={about.content} />
      </div>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start"> {/* 右側照片、統計、儲存 */}
        <div className="flex items-center gap-3 rounded-xl border border-line bg-paper-2 p-4">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-gold px-5 py-2 text-[13px] font-semibold text-paper hover:bg-gold/90 disabled:opacity-60"
          >
            {pending ? "儲存中…" : "儲存"}
          </button>
          {state.savedAt && !pending && <span className="text-[12px] text-[#4c8c5a]">已儲存,前台已更新</span>}
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-line bg-paper-2 p-4">
          <AdminImageField
            srcName="imageSrc"
            altName="imageAlt"
            label="內文旁的照片(留空則不顯示照片)"
            defaultSrc={about.image?.src ?? ""}
            defaultAlt={about.image?.alt ?? ""}
          />
        </div>

        <div className="flex flex-col gap-2.5 rounded-xl border border-line bg-paper-2 p-4">
          <p className={labelClass}>底部統計數字(全部刪除則不顯示)</p>
          {stats.map((stat) => (
            <div key={stat.key} className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-1.5">
              <input name="statValue" defaultValue={stat.value} placeholder="87+" aria-label="數值" className={inputClass} />
              <input name="statLabel" defaultValue={stat.label} placeholder="說明" aria-label="說明" className={inputClass} />
              <button
                type="button"
                onClick={() => removeStat(stat.key)}
                aria-label="刪除這列"
                className="rounded-md px-2 py-1 text-ink-soft hover:bg-paper-3 hover:text-coral"
              >
                ×
              </button>
            </div>
          ))}
          <button type="button" onClick={addStat} className="self-start text-[12.5px] font-semibold text-gold hover:underline">
            + 新增一列
          </button>
        </div>
      </aside>
    </form>
  );
}
