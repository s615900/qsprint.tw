"use server"; // 標記這個檔案裡的函式都是 Server Function，只會在伺服器執行

import { randomUUID } from "node:crypto"; // 匯入亂數 ID 產生器，用來命名上傳的圖片檔案
import { mkdir, writeFile } from "node:fs/promises"; // 匯入檔案系統工具，本機開發時把圖片寫進 public/uploads
import path from "node:path"; // 匯入路徑工具
import { put } from "@vercel/blob"; // 匯入 Vercel Blob 用戶端，備用的雲端圖床
import { cookies } from "next/headers"; // 匯入 cookies 存取工具
import { revalidatePath } from "next/cache"; // 匯入按路徑刷新快取的函式
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/auth"; // 匯入登入驗證相關函式
import { isR2Configured, uploadToR2 } from "@/lib/r2"; // 匯入 Cloudflare R2 上傳工具
import { applyWatermark } from "@/lib/watermark"; // 匯入浮水印處理工具
import {
  createHeroSlide, updateHeroSlide, deleteHeroSlide, nextHeroSlideOrder, type HeroSlideInput,
  createNews, updateNews, deleteNews, type NewsInput,
  createSchedule, updateSchedule, deleteSchedule, type ScheduleInput,
  createPortfolioAlbum, updatePortfolioAlbum, deletePortfolioAlbum,
  type PortfolioAlbumInput, type PortfolioPhoto,
} from "@/lib/db"; // 匯入資料存取層的 CRUD 函式與輸入型別
import { tonePresets } from "@/lib/tone-presets"; // 匯入配色預設清單

// Proxy 已經擋掉未登入的 /admin 請求，但 Server Function 是可以被單獨打到的獨立端點，
// 所以每個會修改資料的 action 都要自己再驗證一次登入狀態，不能只依賴 Proxy。
async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidAdminSession(session)) {
    throw new Error("Unauthorized"); // 未登入就直接中止，不執行任何資料庫操作
  }
}

function revalidateAfterHeroChange() { // 首頁焦點異動後，同時刷新後台與前台首頁
  revalidatePath("/admin");
  revalidatePath("/");
}

function revalidateAfterNewsChange() { // 最新消息異動後，同時刷新後台、前台新聞列表頁、文章詳情頁，以及首頁(精選報導可能來自這裡)
  revalidatePath("/admin");
  revalidatePath("/news", "layout");
  revalidatePath("/");
}

function revalidateAfterScheduleChange() { // 賽程異動後，同時刷新後台、前台賽程頁與首頁(賽程跑馬燈)
  revalidatePath("/admin");
  revalidatePath("/schedule");
  revalidatePath("/");
}

function revalidateAfterPortfolioChange() { // 作品集異動後，同時刷新後台、前台作品集列表頁與每一本相簿的詳情頁
  revalidatePath("/admin");
  revalidatePath("/portfolio", "layout");
}

// ---------- 圖片上傳 ----------
// 依序嘗試三種儲存方式，取第一個有設定好的:
// 1. Cloudflare R2(有設定 R2_* 環境變數) —— 本機、Vercel 都能用，圖片不會因為換環境而消失
// 2. Vercel Blob(有設定 BLOB_READ_WRITE_TOKEN)
// 3. 本機檔案系統 public/uploads(開發時的最後備援，部署到 Vercel 等唯讀檔案系統的平台不能用這個)

const ALLOWED_IMAGE_TYPES: Record<string, string> = { // 允許的圖片格式，及對應要儲存的副檔名
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 一般圖片(首頁焦點、最新消息)大小上限:8MB
const MAX_PHOTO_BYTES = 20 * 1024 * 1024; // 作品集照片是實際交付成品，上限放寬到 20MB

async function storeImage(filename: string, bytes: Buffer, contentType: string, prefix: string): Promise<string> { // 依序嘗試三種儲存方式，把檔案存起來並回傳可公開存取的網址
  const key = `${prefix}/${filename}`;

  if (isR2Configured()) { // 1. Cloudflare R2 —— 本機、Vercel 都能用，圖片不會因為換環境而消失
    return uploadToR2(key, bytes, contentType);
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) { // 2. Vercel Blob
    const blob = await put(key, bytes, { access: "public", contentType });
    return blob.url;
  }

  // 3. 本機檔案系統(開發時的最後備援，部署到 Vercel 等唯讀檔案系統的平台不能用這個)
  const dir = path.join(process.cwd(), "public", prefix);
  await mkdir(dir, { recursive: true }); // 資料夾不存在就先建立
  await writeFile(path.join(dir, filename), bytes);
  return `/${key}`;
}

export async function uploadImageAction(formData: FormData): Promise<string> { // 上傳一張圖片(首頁焦點/最新消息用，不加浮水印)，回傳可公開存取的路徑
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("沒有收到檔案。");
  }
  const extension = ALLOWED_IMAGE_TYPES[file.type];
  if (!extension) {
    throw new Error("只接受 JPG、PNG、WEBP 或 GIF 格式的圖片。");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("圖片檔案不能超過 8MB。");
  }

  // 檔名由伺服器產生(不採用使用者原始檔名)，避免路徑穿越或檔名衝突等問題。
  const filename = `${randomUUID()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  return storeImage(filename, bytes, file.type, "uploads");
}

export async function uploadPortfolioPhotoAction(formData: FormData): Promise<PortfolioPhoto> { // 上傳一張作品集照片，自動加上浮水印，回傳可公開存取的網址
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("沒有收到檔案。");
  }
  const format = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : file.type === "image/jpeg" ? "jpeg" : null;
  if (!format) {
    throw new Error("只接受 JPG、PNG 或 WEBP 格式的照片。");
  }
  if (file.size > MAX_PHOTO_BYTES) {
    throw new Error("照片檔案不能超過 20MB。");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const watermarked = await applyWatermark(bytes, format);
  const extension = format === "jpeg" ? "jpg" : format;
  const filename = `${randomUUID()}.${extension}`;
  // 相簿 ID 由前端先產生好傳進來，讓同一本相簿的照片都存進 R2 底下同一個資料夾(portfolio/{albumId}/...)，方便在 R2 介面裡用資料夾檢視。
  const albumId = String(formData.get("albumId") ?? "").trim();
  const prefix = albumId ? `portfolio/${albumId}` : "portfolio";
  const src = await storeImage(filename, watermarked, file.type, prefix);
  return { src, alt: "" };
}

// ---------- 首頁焦點 ----------

function heroSlideFromForm(formData: FormData, order: number): HeroSlideInput { // 把表單資料轉成資料庫要存的格式
  return {
    tag: String(formData.get("tag") ?? "").trim(),
    titleLines: String(formData.get("titleLines") ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean), // 一行一句標題，過濾掉空白行
    description: String(formData.get("description") ?? "").trim(),
    author: String(formData.get("author") ?? "").trim(),
    date: String(formData.get("date") ?? "").trim(),
    readTime: String(formData.get("readTime") ?? "").trim(),
    ctaLabel: String(formData.get("ctaLabel") ?? "").trim(),
    ctaHref: String(formData.get("ctaHref") ?? "").trim(),
    image: {
      src: String(formData.get("imageSrc") ?? "").trim(),
      alt: String(formData.get("imageAlt") ?? "").trim(),
    },
    order,
  };
}

export async function createHeroSlideAction(formData: FormData): Promise<void> { // 新增首頁焦點
  await requireAdmin();
  const order = await nextHeroSlideOrder();
  await createHeroSlide(heroSlideFromForm(formData, order));
  revalidateAfterHeroChange();
}

export async function updateHeroSlideAction(id: string, formData: FormData): Promise<void> { // 修改首頁焦點
  await requireAdmin();
  const order = Number(formData.get("order") ?? 0);
  await updateHeroSlide(id, heroSlideFromForm(formData, order));
  revalidateAfterHeroChange();
}

export async function deleteHeroSlideAction(id: string): Promise<void> { // 刪除首頁焦點
  await requireAdmin();
  await deleteHeroSlide(id);
  revalidateAfterHeroChange();
}

// ---------- 最新消息 ----------

function newsFromForm(formData: FormData): NewsInput { // 把表單資料轉成資料庫要存的格式
  const presetId = String(formData.get("tonePreset") ?? tonePresets[0].id);
  const preset = tonePresets.find((p) => p.id === presetId) ?? tonePresets[0];
  const imageSrc = String(formData.get("imageSrc") ?? "").trim();
  return {
    tag: String(formData.get("tag") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    content: String(formData.get("content") ?? "").trim(),
    meta: String(formData.get("meta") ?? "").trim(),
    tone: { a: preset.a, b: preset.b, icon: preset.id },
    image: imageSrc ? { src: imageSrc, alt: String(formData.get("imageAlt") ?? "").trim() } : null, // 沒有上傳照片就維持 null，前台會改用色塊+圖示
    featured: formData.get("featured") === "on", // 是否設為首頁精選報導
    status: formData.get("status") === "published" ? "published" : "draft",
  };
}

export async function createNewsAction(formData: FormData): Promise<void> { // 新增新聞
  await requireAdmin();
  await createNews(newsFromForm(formData));
  revalidateAfterNewsChange();
}

export async function updateNewsAction(id: string, formData: FormData): Promise<void> { // 修改新聞
  await requireAdmin();
  await updateNews(id, newsFromForm(formData));
  revalidateAfterNewsChange();
}

export async function deleteNewsAction(id: string): Promise<void> { // 刪除新聞
  await requireAdmin();
  await deleteNews(id);
  revalidateAfterNewsChange();
}

// ---------- 賽事行事曆 ----------

function scheduleFromForm(formData: FormData): ScheduleInput { // 把表單資料轉成資料庫要存的格式
  const startDate = String(formData.get("startDate") ?? "").trim();
  const endDate = String(formData.get("endDate") ?? "").trim();
  return {
    startDate,
    endDate: endDate || startDate, // 沒填結束日期就當成單日賽事
    event: String(formData.get("event") ?? "").trim(),
    place: String(formData.get("place") ?? "").trim(),
  };
}

export async function createScheduleAction(formData: FormData): Promise<void> { // 新增賽事
  await requireAdmin();
  await createSchedule(scheduleFromForm(formData));
  revalidateAfterScheduleChange();
}

export async function updateScheduleAction(id: string, formData: FormData): Promise<void> { // 修改賽事
  await requireAdmin();
  await updateSchedule(id, scheduleFromForm(formData));
  revalidateAfterScheduleChange();
}

export async function deleteScheduleAction(id: string): Promise<void> { // 刪除賽事
  await requireAdmin();
  await deleteSchedule(id);
  revalidateAfterScheduleChange();
}

// ---------- 作品集(相簿) ----------

function albumFromForm(formData: FormData): PortfolioAlbumInput { // 把表單資料轉成資料庫要存的格式
  const presetId = String(formData.get("tonePreset") ?? tonePresets[0].id);
  const preset = tonePresets.find((p) => p.id === presetId) ?? tonePresets[0];

  let photos: PortfolioPhoto[] = []; // 相簿內的照片清單，由前端在上傳完成後組成 JSON 字串傳進來
  try {
    const raw = JSON.parse(String(formData.get("photos") ?? "[]"));
    if (Array.isArray(raw)) {
      photos = raw.filter(
        (p): p is PortfolioPhoto => p && typeof p.src === "string" && typeof p.alt === "string"
      );
    }
  } catch {
    photos = []; // 格式不對就當作沒有照片，不要讓整個表單送出失敗
  }

  return {
    title: String(formData.get("title") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    place: String(formData.get("place") ?? "").trim(),
    date: String(formData.get("date") ?? "").trim(),
    photos,
    tone: { a: preset.a, b: preset.b, icon: preset.id },
  };
}

export async function createPortfolioAlbumAction(formData: FormData): Promise<void> { // 新增相簿
  await requireAdmin();
  // 沿用照片上傳時前端已經產生好的相簿 ID，讓相簿的 _id 跟 R2 裡存放照片的資料夾名稱一致。
  const albumId = String(formData.get("albumId") ?? "").trim();
  await createPortfolioAlbum(albumFromForm(formData), albumId || undefined);
  revalidateAfterPortfolioChange();
}

export async function updatePortfolioAlbumAction(id: string, formData: FormData): Promise<void> { // 修改相簿
  await requireAdmin();
  await updatePortfolioAlbum(id, albumFromForm(formData));
  revalidateAfterPortfolioChange();
}

export async function deletePortfolioAlbumAction(id: string): Promise<void> { // 刪除相簿
  await requireAdmin();
  await deletePortfolioAlbum(id);
  revalidateAfterPortfolioChange();
}
