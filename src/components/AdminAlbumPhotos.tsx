"use client"; // 標記為 Client Component，因為要處理多檔上傳與相片清單狀態

import { useState } from "react"; // 匯入狀態 hook
import PhotoTile from "./PhotoTile"; // 匯入圖片顯示元件
import AdminModal from "./AdminModal"; // 匯入共用的彈出視窗外框，用於「挑選既有照片」的選圖器
import { IconTrash } from "./AdminIcons"; // 匯入刪除圖示
import { uploadPortfolioPhotoAction, listExistingPortfolioPhotosAction } from "@/app/admin/actions"; // 匯入作品集照片上傳、列出 R2 既有照片的 Server Action
import type { PortfolioPhoto } from "@/lib/db"; // 匯入相簿照片的型別

export default function AdminAlbumPhotos({ // 相簿照片管理欄位:可一次選多張照片上傳，也可以從 R2 既有照片挑選重複使用，並逐張顯示縮圖、可個別刪除
  name, // 隱藏欄位的 name，表單送出時會帶著目前的照片清單(JSON 字串)
  albumId, // 這本相簿的 ID，上傳照片時會一起帶給伺服器，讓照片存進 R2 對應的資料夾(portfolio/{albumId}/...)
  defaultPhotos = [], // 編輯既有相簿時，帶入已經有的照片
}: {
  name: string;
  albumId: string;
  defaultPhotos?: PortfolioPhoto[];
}) {
  const [photos, setPhotos] = useState<PortfolioPhoto[]>(defaultPhotos); // 目前相簿裡的照片清單，第一張是封面
  const [uploading, setUploading] = useState<{ done: number; total: number } | null>(null); // 上傳進度(目前第幾張/總共幾張)
  const [error, setError] = useState<string | null>(null); // 上傳失敗時的錯誤訊息

  const [pickerOpen, setPickerOpen] = useState(false); // 「從既有照片挑選」視窗是否開啟
  const [existingPhotos, setExistingPhotos] = useState<PortfolioPhoto[] | null>(null); // R2 裡既有的照片清單，null 代表還沒載入過
  const [pickerLoading, setPickerLoading] = useState(false); // 正在向伺服器要既有照片清單
  const [pickerError, setPickerError] = useState<string | null>(null); // 載入既有照片清單失敗時的錯誤訊息
  const [selected, setSelected] = useState<Set<string>>(new Set()); // 選圖器裡目前勾選的照片網址

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
        formData.set("albumId", albumId);
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

  async function openPicker() { // 開啟「從既有照片挑選」視窗，第一次開啟時才向伺服器要清單
    setPickerOpen(true);
    setSelected(new Set());
    if (existingPhotos !== null) return; // 已經載入過就不用重打一次
    setPickerLoading(true);
    setPickerError(null);
    try {
      setExistingPhotos(await listExistingPortfolioPhotosAction());
    } catch (err) {
      setPickerError(err instanceof Error ? err.message : "載入既有照片失敗，請稍後再試。");
    } finally {
      setPickerLoading(false);
    }
  }

  function toggleSelected(src: string) { // 點一下縮圖切換勾選狀態
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(src)) next.delete(src);
      else next.add(src);
      return next;
    });
  }

  function addSelectedPhotos() { // 把選圖器裡勾選的照片加進這本相簿(已經在相簿裡的就不重複加)
    const alreadyIn = new Set(photos.map((p) => p.src));
    const toAdd = (existingPhotos ?? []).filter((p) => selected.has(p.src) && !alreadyIn.has(p.src));
    if (toAdd.length > 0) setPhotos((prev) => [...prev, ...toAdd]);
    setPickerOpen(false);
  }

  return (
    <div className="flex flex-col gap-2"> {/* 整個欄位垂直排列容器 */}
      <input type="hidden" name={name} value={JSON.stringify(photos)} /> {/* 把目前的照片清單序列化後隨表單送出 */}

      <div className="flex items-center justify-between gap-2">
        <span className="text-[12.5px] font-semibold text-ink-soft">
          相簿照片({photos.length} 張,第一張是封面)
        </span>
        <div className="flex flex-none gap-1.5">
          <button
            type="button"
            onClick={openPicker} // 開啟既有照片挑選器，不用每次都重新上傳同一批照片
            className="whitespace-nowrap rounded-lg border border-line bg-paper-3 px-3 py-2 text-[12.5px] font-semibold hover:bg-paper"
          >
            從既有照片挑選
          </button>
          <label className="cursor-pointer whitespace-nowrap rounded-lg border border-line bg-paper-3 px-3 py-2 text-[12.5px] font-semibold hover:bg-paper">
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

      {pickerOpen && ( // 「從既有照片挑選」視窗:列出 R2 裡所有相簿上傳過的照片，勾選後一次加進目前這本相簿
        <AdminModal title="從既有照片挑選" onClose={() => setPickerOpen(false)}>
          {pickerLoading ? (
            <p className="py-8 text-center text-[13px] text-ink-soft">載入中…</p>
          ) : pickerError ? (
            <p className="py-8 text-center text-[13px] text-coral">{pickerError}</p>
          ) : !existingPhotos || existingPhotos.length === 0 ? (
            <p className="py-8 text-center text-[13px] text-ink-soft">目前 R2 上還沒有任何已上傳過的作品集照片。</p>
          ) : (
            <>
              <p className="mb-3 text-[12px] text-ink-soft">
                點選照片可以複選,已經在這本相簿裡的照片會用勾選標記出來。
              </p>
              <div className="grid max-h-[50vh] grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-5">
                {existingPhotos.map((photo) => {
                  const isSelected = selected.has(photo.src);
                  const alreadyInAlbum = photos.some((p) => p.src === photo.src);
                  return (
                    <button
                      key={photo.src}
                      type="button"
                      onClick={() => toggleSelected(photo.src)}
                      disabled={alreadyInAlbum}
                      className={`relative aspect-square overflow-hidden rounded-lg border-2 ${
                        alreadyInAlbum
                          ? "cursor-not-allowed border-line opacity-40"
                          : isSelected
                            ? "border-gold"
                            : "border-transparent hover:border-line"
                      }`}
                    >
                      <PhotoTile src={photo.src} alt={photo.alt} />
                      {(isSelected || alreadyInAlbum) && (
                        <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-paper">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={addSelectedPhotos}
                disabled={selected.size === 0}
                className="mt-4 w-full rounded-full bg-gold px-4 py-2 text-[13px] font-semibold text-paper hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                加入已選的 {selected.size} 張照片
              </button>
            </>
          )}
        </AdminModal>
      )}
    </div>
  );
}
