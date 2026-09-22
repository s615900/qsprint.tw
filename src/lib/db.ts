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
  content: string; // 文章全文(內文)，段落之間用空行分隔；文章詳情頁會顯示這欄
  meta: string;
  tone: { a: string; b: string; icon: IconId };
  image: { src: string; alt: string } | null; // 上傳的實際照片；沒有照片時前台會改用 tone 色塊+圖示呈現
  featured: boolean; // 是否為首頁「精選報導」區塊要顯示的那一篇；同時間只會有一篇是 true
  status: NewsStatus;
  createdAt: string; // ISO 字串，用來排序與顯示
}

export type NewsInput = Omit<NewsItem, "_id" | "createdAt">; // 新增/修改時由使用者填寫的欄位

function toNewsItem(doc: WithId<Omit<NewsItem, "_id">>): NewsItem { // 把 Mongo 文件轉成前端可用的型別
  const { _id, content, featured, ...rest } = doc;
  // 舊資料(接上內文/精選欄位之前建立的文章)沒有這兩個欄位，分別用空字串、false 墊底。
  return { content: content ?? "", featured: featured ?? false, ...rest, _id: _id.toString() };
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

export async function getPublishedNewsById(id: string): Promise<NewsItem | null> { // 取得單篇已發布的新聞(文章詳情頁用)；id 格式不對或找不到就回傳 null
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<Omit<NewsItem, "_id">>("news")
    .findOne({ _id: new ObjectId(id), status: "published" });
  return doc ? toNewsItem(doc) : null;
}

export async function getFeaturedNews(): Promise<NewsItem | null> { // 取得首頁「精選報導」要顯示的那篇已發布文章
  const db = await getDb();
  const doc = await db
    .collection<Omit<NewsItem, "_id">>("news")
    .findOne({ featured: true, status: "published" });
  return doc ? toNewsItem(doc) : null;
}

export async function createNews(data: NewsInput): Promise<void> { // 新增一篇新聞
  const db = await getDb();
  const collection = db.collection<Omit<NewsItem, "_id">>("news");
  if (data.featured) await collection.updateMany({ featured: true }, { $set: { featured: false } }); // 同時間只能有一篇精選
  await collection.insertOne({ ...data, createdAt: new Date().toISOString() });
}

export async function updateNews(id: string, data: NewsInput): Promise<void> { // 修改一篇新聞（不更動建立時間）
  const db = await getDb();
  const collection = db.collection<Omit<NewsItem, "_id">>("news");
  if (data.featured) { // 同時間只能有一篇精選，先把「其他」文章的精選狀態取消
    await collection.updateMany({ featured: true, _id: { $ne: new ObjectId(id) } }, { $set: { featured: false } });
  }
  await collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
}

export async function deleteNews(id: string): Promise<void> { // 刪除一篇新聞
  const db = await getDb();
  await db.collection("news").deleteOne({ _id: new ObjectId(id) });
}

// ---------- 賽事行事曆 (Schedule) ----------

export interface ScheduleItem { // 賽事，序列化給前端使用的型別
  _id: string;
  startDate: string; // 開始日期，格式 "YYYY-MM-DD"
  endDate: string; // 結束日期，格式 "YYYY-MM-DD"；單日賽事跟 startDate 相同
  event: string;
  place: string;
}

export type ScheduleInput = Omit<ScheduleItem, "_id">; // 新增/修改時使用的欄位

function toScheduleItem(doc: WithId<ScheduleInput>): ScheduleItem { // 把 Mongo 文件轉成前端可用的型別
  const { _id, ...rest } = doc;
  return { _id: _id.toString(), ...rest };
}

export async function listSchedule(): Promise<ScheduleItem[]> { // 依開始日期由近到遠取得所有賽事
  const db = await getDb();
  const docs = await db.collection<ScheduleInput>("schedule").find().sort({ startDate: 1 }).toArray();
  return docs.map(toScheduleItem);
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
