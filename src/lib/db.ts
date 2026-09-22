import { ObjectId, type WithId } from "mongodb"; // 匯入 ObjectId 與帶有 _id 的文件型別
import { getDb } from "./mongodb"; // 匯入取得資料庫實例的函式
import type { IconId } from "@/components/ArtTile"; // 匯入圖示 ID 型別，供新聞色調使用

// ---------- 首頁焦點 (Hero Slides) ----------

export interface HeroSlide { // 首頁輪播投影片，序列化給前端使用的型別（_id 為字串）
  _id: string;
  tag: string;
  titleLines: string[];
  description: string;
  author: string;
  date: string;
  readTime: string;
  ctaLabel: string;
  ctaHref: string;
  image: { src: string; alt: string };
  order: number;
}

export type HeroSlideInput = Omit<HeroSlide, "_id">; // 新增/修改時使用的欄位（不含 _id）

function toHeroSlide(doc: WithId<HeroSlideInput>): HeroSlide { // 把 Mongo 文件轉成前端可用的型別
  const { _id, ...rest } = doc;
  return { _id: _id.toString(), ...rest };
}

export async function listHeroSlides(): Promise<HeroSlide[]> { // 依排序取得所有首頁焦點
  const db = await getDb();
  const docs = await db.collection<HeroSlideInput>("heroSlides").find().sort({ order: 1 }).toArray();
  return docs.map(toHeroSlide);
}

export async function nextHeroSlideOrder(): Promise<number> { // 取得新增時該用的排序值（接在最後）
  const db = await getDb();
  const [last] = await db.collection<HeroSlideInput>("heroSlides").find().sort({ order: -1 }).limit(1).toArray();
  return (last?.order ?? -1) + 1;
}

export async function createHeroSlide(data: HeroSlideInput): Promise<void> { // 新增一則首頁焦點
  const db = await getDb();
  await db.collection<HeroSlideInput>("heroSlides").insertOne(data);
}

export async function updateHeroSlide(id: string, data: HeroSlideInput): Promise<void> { // 修改一則首頁焦點
  const db = await getDb();
  await db.collection<HeroSlideInput>("heroSlides").updateOne({ _id: new ObjectId(id) }, { $set: data });
}

export async function deleteHeroSlide(id: string): Promise<void> { // 刪除一則首頁焦點
  const db = await getDb();
  await db.collection("heroSlides").deleteOne({ _id: new ObjectId(id) });
}

// ---------- 最新消息 (News) ----------

export type NewsStatus = "draft" | "published"; // 文章狀態：草稿或已發布

export interface NewsItem { // 新聞文章，序列化給前端使用的型別
  _id: string;
  tag: string;
  title: string;
  excerpt: string;
  meta: string;
  tone: { a: string; b: string; icon: IconId };
  status: NewsStatus;
  createdAt: string; // ISO 字串，用來排序與顯示
}

export type NewsInput = Omit<NewsItem, "_id" | "createdAt">; // 新增/修改時由使用者填寫的欄位

function toNewsItem(doc: WithId<Omit<NewsItem, "_id">>): NewsItem { // 把 Mongo 文件轉成前端可用的型別
  const { _id, ...rest } = doc;
  return { _id: _id.toString(), ...rest };
}

export async function listNews(): Promise<NewsItem[]> { // 取得所有新聞（後台用，含草稿），依建立時間新到舊排序
  const db = await getDb();
  const docs = await db
    .collection<Omit<NewsItem, "_id">>("news")
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(toNewsItem);
}

export async function listPublishedNews(): Promise<NewsItem[]> { // 取得已發布的新聞（前台用）
  const db = await getDb();
  const docs = await db
    .collection<Omit<NewsItem, "_id">>("news")
    .find({ status: "published" })
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(toNewsItem);
}

export async function createNews(data: NewsInput): Promise<void> { // 新增一篇新聞
  const db = await getDb();
  await db.collection<Omit<NewsItem, "_id">>("news").insertOne({ ...data, createdAt: new Date().toISOString() });
}

export async function updateNews(id: string, data: NewsInput): Promise<void> { // 修改一篇新聞（不更動建立時間）
  const db = await getDb();
  await db.collection<Omit<NewsItem, "_id">>("news").updateOne({ _id: new ObjectId(id) }, { $set: data });
}

export async function deleteNews(id: string): Promise<void> { // 刪除一篇新聞
  const db = await getDb();
  await db.collection("news").deleteOne({ _id: new ObjectId(id) });
}

// ---------- 賽事行事曆 (Schedule) ----------

export interface ScheduleItem { // 賽事，序列化給前端使用的型別
  _id: string;
  date: string;
  event: string;
  place: string;
  order: number;
}

export type ScheduleInput = Omit<ScheduleItem, "_id">; // 新增/修改時使用的欄位

function toScheduleItem(doc: WithId<ScheduleInput>): ScheduleItem { // 把 Mongo 文件轉成前端可用的型別
  const { _id, ...rest } = doc;
  return { _id: _id.toString(), ...rest };
}

export async function listSchedule(): Promise<ScheduleItem[]> { // 依排序取得所有賽事
  const db = await getDb();
  const docs = await db.collection<ScheduleInput>("schedule").find().sort({ order: 1 }).toArray();
  return docs.map(toScheduleItem);
}

export async function nextScheduleOrder(): Promise<number> { // 取得新增時該用的排序值（接在最後）
  const db = await getDb();
  const [last] = await db.collection<ScheduleInput>("schedule").find().sort({ order: -1 }).limit(1).toArray();
  return (last?.order ?? -1) + 1;
}

export async function createSchedule(data: ScheduleInput): Promise<void> { // 新增一場賽事
  const db = await getDb();
  await db.collection<ScheduleInput>("schedule").insertOne(data);
}

export async function updateSchedule(id: string, data: ScheduleInput): Promise<void> { // 修改一場賽事
  const db = await getDb();
  await db.collection<ScheduleInput>("schedule").updateOne({ _id: new ObjectId(id) }, { $set: data });
}

export async function deleteSchedule(id: string): Promise<void> { // 刪除一場賽事
  const db = await getDb();
  await db.collection("schedule").deleteOne({ _id: new ObjectId(id) });
}
