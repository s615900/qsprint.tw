"use client"; // 標記為 Client Component，因為要處理多檔上傳與相片清單狀態

import { useState } from "react"; // 匯入狀態 hook
import PhotoTile from "./PhotoTile"; // 匯入圖片顯示元件
import { IconTrash } from "./AdminIcons"; // 匯入刪除圖示
import { uploadPortfolioPhotoAction } from "@/app/admin/actions"; // 匯入作品集照片上傳的 Server Action(會自動加浮水印)
import type { PortfolioPhoto } from "@/lib/db"; // 匯入相簿照片的型別

export default function AdminAlbumPhotos({ // 相簿照片管理欄位:可一次選多張照片上傳，並逐張顯示縮圖、可個別刪除
  name, // 隱藏欄位的 name，表單送出時會帶著目前的照片清單(JSON 字串)
  defaultPhotos = [], // 編輯既有相簿時，帶入已經有的照片
}: {
  name: string;
  defaultPhotos?: PortfolioPhoto[];
}) {
  const [photos, setPhotos] = useState<PortfolioPhoto[]>(defaultPhotos); // 目前相簿裡的照片清單，第一張是封面
  const [uploading, setUploading] = useState<{ done: number; total: number } | null>(null); // 上傳進度(目前第幾張/總共幾張)
  const [error, setError] = useState<string | null>(null); // 上傳失敗時的錯誤訊息

  async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) { // 選取一或多個檔案後，逐張依序上傳(自動加浮水印)
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // 清空選取，讓使用者可以再次選同一批檔案
    if (files.length === 0) return;

    setError(null);
    const uploaded: PortfolioPhoto[] = [];
    for (let i = 0; i < files.length; i++) {
      setUploading({ done: i, total: files.length });
      try {
        const formData = new FormData();
        formData.set("file", files[i]);
        uploaded.push(await uploadPortfolioPhotoAction(formData));
      } catch (err) {
        setError(err instanceof Error ? `${files[i].name}: ${err.message}` : `${files[i].name} 上傳失敗`);
      }
    }
    setUploading(null);
    if (uploaded.length > 0) setPhotos((prev) => [...prev, ...uploaded]);
  }

  function removePhoto(index: number) { // 從清單裡移除一張照片(只是從相簿拿掉，不會刪除雲端上的檔案)
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-2"> {/* 整個欄位垂直排列容器 */}
      <input type="hidden" name={name} value={JSON.stringify(photos)} /> {/* 把目前的照片清單序列化後隨表單送出 */}

      <div className="flex items-center justify-between">
        <span className="text-[12.5px] font-semibold text-ink-soft">
          相簿照片({photos.length} 張,第一張是封面)
        </span>
        <label className="flex-none cursor-pointer whitespace-nowrap rounded-lg border border-line bg-paper-3 px-3 py-2 text-[12.5px] font-semibold hover:bg-paper">
          {uploading ? `上傳中 (${uploading.done + 1}/${uploading.total})…` : "+ 選擇照片(可多選)"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleFilesChange}
            disabled={uploading !== null}
          />
        </label>
      </div>

      {error && <p className="text-[12px] text-coral">{error}</p>} {/* 上傳失敗時顯示錯誤訊息 */}

      {photos.length > 0 && ( // 有照片才顯示縮圖格線
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {photos.map((photo, index) => (
            <div key={photo.src} className="group relative aspect-square overflow-hidden rounded-lg border border-line">
              <PhotoTile src={photo.src} alt={photo.alt} />
              {index === 0 && ( // 第一張標示為封面
                <span className="absolute left-1 top-1 rounded bg-ink/70 px-1.5 py-0.5 text-[9px] font-semibold text-paper">
                  封面
                </span>
              )}
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute right-1 top-1 rounded-md bg-ink/70 p-1 text-paper opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="移除這張照片"
              >
                <IconTrash className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
