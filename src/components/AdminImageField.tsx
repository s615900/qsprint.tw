"use client"; // 標記為 Client Component，因為要處理檔案選取與上傳狀態

import { useState } from "react"; // 匯入狀態 hook
import PhotoTile from "./PhotoTile"; // 匯入圖片顯示元件，用來呈現預覽縮圖
import { uploadImageAction } from "@/app/admin/actions"; // 匯入圖片上傳的 Server Action

const inputClass = // 表單輸入框共用樣式(與各後台表單一致)
  "w-full rounded-lg border border-line bg-paper-2 px-3 py-2 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-gold/40";
const labelClass = "flex flex-col gap-1 text-[12.5px] font-semibold text-ink-soft"; // 表單欄位標籤共用樣式

export default function AdminImageField({ // 圖片路徑 + 替代文字的表單欄位，內建「上傳照片」按鈕
  srcName, // 圖片路徑欄位的 name(對應 Server Action 要讀取的欄位)
  altName, // 圖片替代文字欄位的 name
  label = "圖片", // 圖片路徑欄位標籤文字
  defaultSrc = "", // 初始圖片路徑(編輯時帶入既有資料)
  defaultAlt = "", // 初始替代文字
  required = false, // 是否為必填(首頁焦點必填、最新消息選填)
}: {
  srcName: string;
  altName: string;
  label?: string;
  defaultSrc?: string;
  defaultAlt?: string;
  required?: boolean;
}) {
  const [src, setSrc] = useState(defaultSrc); // 目前的圖片路徑(可能來自手動輸入或上傳結果)
  const [alt, setAlt] = useState(defaultAlt); // 目前的替代文字
  const [uploading, setUploading] = useState(false); // 是否正在上傳中
  const [error, setError] = useState<string | null>(null); // 上傳失敗時的錯誤訊息

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) { // 選取檔案後立即上傳
    const file = e.target.files?.[0];
    e.target.value = ""; // 清空選取，讓使用者能再次選同一個檔案觸發上傳
    if (!file) return;

    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const url = await uploadImageAction(formData); // 上傳完成後拿到可公開存取的路徑
      setSrc(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "上傳失敗,請再試一次。");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2"> {/* 整個欄位垂直排列容器 */}
      <label className={labelClass}>
        {label}
        <div className="flex items-center gap-2">
          <input
            name={srcName}
            value={src}
            onChange={(e) => setSrc(e.target.value)} // 也允許手動輸入既有的 /images/xxx.jpg 路徑
            placeholder="/images/xxx.jpg"
            required={required}
            className={inputClass}
          />
          <label className="flex-none cursor-pointer whitespace-nowrap rounded-lg border border-line bg-paper-3 px-3 py-2 text-[12.5px] font-semibold hover:bg-paper">
            {uploading ? "上傳中…" : "上傳照片"}
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
          </label>
        </div>
      </label>
      {error && <p className="text-[12px] text-coral">{error}</p>} {/* 上傳失敗時顯示錯誤訊息 */}
      {src && ( // 有圖片路徑時顯示預覽縮圖
        <div className="h-24 w-40 flex-none overflow-hidden rounded-lg border border-line">
          <PhotoTile src={src} alt={alt} />
        </div>
      )}
      <label className={labelClass}>
        圖片替代文字(無障礙用,簡短描述圖片內容)
        <input name={altName} value={alt} onChange={(e) => setAlt(e.target.value)} className={inputClass} />
      </label>
    </div>
  );
}
