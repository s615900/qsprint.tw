"use server"; // 標記這個檔案裡的函式都是 Server Function，只會在伺服器執行

import { cookies } from "next/headers"; // 匯入 cookies 存取工具
import { revalidatePath } from "next/cache"; // 匯入按路徑刷新快取的函式
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/auth"; // 匯入登入驗證相關函式
import {
  createHeroSlide, updateHeroSlide, deleteHeroSlide, nextHeroSlideOrder, type HeroSlideInput,
  createNews, updateNews, deleteNews, type NewsInput,
  createSchedule, updateSchedule, deleteSchedule, nextScheduleOrder, type ScheduleInput,
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

function revalidateAfterNewsChange() { // 最新消息異動後，同時刷新後台與前台新聞頁
  revalidatePath("/admin");
  revalidatePath("/news");
}

function revalidateAfterScheduleChange() { // 賽程異動後，同時刷新後台、前台賽程頁與首頁(賽程跑馬燈)
  revalidatePath("/admin");
  revalidatePath("/schedule");
  revalidatePath("/");
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
  return {
    tag: String(formData.get("tag") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    meta: String(formData.get("meta") ?? "").trim(),
    tone: { a: preset.a, b: preset.b, icon: preset.id },
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

function scheduleFromForm(formData: FormData, order: number): ScheduleInput { // 把表單資料轉成資料庫要存的格式
  return {
    date: String(formData.get("date") ?? "").trim(),
    event: String(formData.get("event") ?? "").trim(),
    place: String(formData.get("place") ?? "").trim(),
    order,
  };
}

export async function createScheduleAction(formData: FormData): Promise<void> { // 新增賽事
  await requireAdmin();
  const order = await nextScheduleOrder();
  await createSchedule(scheduleFromForm(formData, order));
  revalidateAfterScheduleChange();
}

export async function updateScheduleAction(id: string, formData: FormData): Promise<void> { // 修改賽事
  await requireAdmin();
  const order = Number(formData.get("order") ?? 0);
  await updateSchedule(id, scheduleFromForm(formData, order));
  revalidateAfterScheduleChange();
}

export async function deleteScheduleAction(id: string): Promise<void> { // 刪除賽事
  await requireAdmin();
  await deleteSchedule(id);
  revalidateAfterScheduleChange();
}
