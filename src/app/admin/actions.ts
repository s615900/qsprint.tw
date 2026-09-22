"use server"; // 標記這個檔案裡的函式都是 Server Function，只會在伺服器執行

import { randomUUID } from "node:crypto"; // 匯入亂數 ID 產生器，用來命名上傳的圖片檔案
import { mkdir, writeFile } from "node:fs/promises"; // 匯入檔案系統工具，本機開發時把圖片寫進 public/uploads
import path from "node:path"; // 匯入路徑工具
import { put } from "@vercel/blob"; // 匯入 Vercel Blob 用戶端，正式環境(部署到 Vercel)用它存圖片
import { cookies } from "next/headers"; // 匯入 cookies 存取工具
import { revalidatePath } from "next/cache"; // 匯入按路徑刷新快取的函式
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/auth"; // 匯入登入驗證相關函式
import {
  createHeroSlide, updateHeroSlide, deleteHeroSlide, nextHeroSlideOrder, type HeroSlideInput,
  createNews, updateNews, deleteNews, type NewsInput,
  createSchedule, updateSchedule, deleteSchedule, type ScheduleInput,
} from "@/lib/db"; // 匯入資料存取層的 CRUD 函式與輸入型別
import { tonePresets } from "@/lib/tone-presets"; // 匯入新聞配色預設清單

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

function revalidateAfterNewsChange() { // 最新消息異動後，同時刷新後台、前台新聞列表頁與每一篇文章詳情頁
  revalidatePath("/admin");
  revalidatePath("/news", "layout");
}

function revalidateAfterScheduleChange() { // 賽程異動後，同時刷新後台、前台賽程頁與首頁(賽程跑馬燈)
  revalidatePath("/admin");
  revalidatePath("/schedule");
  revalidatePath("/");
}

// ---------- 圖片上傳 ----------
// 本機開發(沒有設定 BLOB_READ_WRITE_TOKEN)時，圖片直接寫進專案的 public/uploads 資料夾；
// 部署到 Vercel 後(有這組環境變數)，改存進 Vercel Blob 雲端圖床，避免圖片在唯讀檔案系統上消失。

const ALLOWED_IMAGE_TYPES: Record<string, string> = { // 允許的圖片格式，及對應要儲存的副檔名
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 圖片大小上限:8MB

export async function uploadImageAction(formData: FormData): Promise<string> { // 上傳一張圖片，回傳可公開存取的路徑
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

  if (process.env.BLOB_READ_WRITE_TOKEN) { // 有設定 Vercel Blob 的權杖，代表在 Vercel 上執行
    const blob = await put(`uploads/${filename}`, bytes, {
      access: "public",
      contentType: file.type,
    });
    return blob.url;
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true }); // 資料夾不存在就先建立
  await writeFile(path.join(uploadsDir, filename), bytes);
  return `/uploads/${filename}`;
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
