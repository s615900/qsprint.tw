// 一次性種子資料腳本:把原本寫死在 src/lib/content.ts 的首頁焦點、新聞、賽程資料匯入 MongoDB。
// 執行方式(需要 Node 20.6+ 的 --env-file 支援):
//   node --env-file=.env.local scripts/seed.mjs
// 已經有資料的 collection 會直接略過,可以安全地重複執行。

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("找不到 MONGODB_URI,請確認有透過 --env-file=.env.local 執行這支腳本。");
  process.exit(1);
}

const heroSlides = [
  {
    tag: "賽事直擊",
    titleLines: ["終點線前", "0.03 秒", "我們替你按下快門"],
    description: "115學年度全國中等學校運動會落幕,四天賽程、超過六十場徑賽決賽,青春止秒的鏡頭沒有錯過任何一次衝線。",
    author: "青春止秒編輯部",
    date: "2026.04.23",
    readTime: "閱讀 4 分鐘",
    ctaLabel: "閱讀全文 →",
    ctaHref: "/news",
    image: { src: "/images/track-03-hurdles.jpg", alt: "選手在起跑器上握著接力棒,準備起跑" },
    order: 0,
  },
  {
    tag: "賽事直擊",
    titleLines: ["大隊接力最後一棒", "交棒零點幾秒", "決定了名次"],
    description: "接力區裡沒有人在乎誰跑得漂亮,只有誰先把棒子穩穩交出去。這一次,我們蹲在交接區外側,等那零點幾秒。",
    author: "青春止秒編輯部",
    date: "2026.04.20",
    readTime: "閱讀 3 分鐘",
    ctaLabel: "閱讀內文 →",
    ctaHref: "/news",
    image: { src: "/images/track-05-finish-line.jpg", alt: "大隊接力選手在交接區內全力衝刺" },
    order: 1,
  },
  {
    tag: "精選報導",
    titleLines: ["跑道有多長", "青春就有多長"],
    description: "她說,這是高中生涯的最後一次上場。有些照片不是為了紀錄名次,而是為了留住一個人曾經那麼用力活過的證據。",
    author: "青春止秒編輯部",
    date: "2026.03.29",
    readTime: "閱讀 5 分鐘",
    ctaLabel: "閱讀內文 →",
    ctaHref: "/news",
    image: { src: "/images/track-01-sprint-start.jpg", alt: "夕陽餘光灑落在田徑跑道的彎道上" },
    order: 2,
  },
  {
    tag: "賽事公告",
    titleLines: ["115學年度下半年", "賽程總覽", "我們接下來會在哪裡"],
    description: "從新北到高雄,秋季田徑賽季正式開跑,以下是青春止秒團隊確定進場拍攝的賽事清單。",
    author: "青春止秒編輯部",
    date: "2026.09.01",
    readTime: "查看完整賽程",
    ctaLabel: "查看賽事行事曆 →",
    ctaHref: "/schedule",
    image: { src: "/images/track-04-stadium.jpg", alt: "田徑場跑道上的 4x100 與 4x400 接力交接區標線" },
    order: 3,
  },
];

const news = [
  {
    tag: "賽事公告",
    title: "新北市中等學校田徑錦標賽・賽前預告",
    excerpt: "整理選手名單與場地資訊,賽前搶先看。",
    content: "整理選手名單與場地資訊,賽前搶先看。",
    meta: "預計 2026.09.19 開賽前送出",
    tone: { a: "#FFD699", b: "#1E2430", icon: "blocks" },
    status: "draft",
    createdAt: new Date("2026-09-10T00:00:00.000Z").toISOString(),
  },
  {
    tag: "賽事直擊",
    title: "大隊接力最後一棒:交棒零點幾秒,決定了名次",
    excerpt: "接力區裡沒有人在乎誰跑得漂亮,只有誰先把棒子穩穩交出去。這一次,我們蹲在交接區外側,等那零點幾秒。",
    content: "接力區裡沒有人在乎誰跑得漂亮,只有誰先把棒子穩穩交出去。這一次,我們蹲在交接區外側,等那零點幾秒。",
    meta: "2026.04.20 · 田徑場邊記事",
    tone: { a: "#FFB7C5", b: "#D58D3F", icon: "baton" },
    status: "published",
    createdAt: new Date("2026-04-20T00:00:00.000Z").toISOString(),
  },
  {
    tag: "幕後故事",
    title: "起跑槍響前的三秒,選手在想什麼?",
    excerpt: "起跑器卡好、深呼吸、裁判舉旗——我們把鏡頭對準的,是槍響前最安靜的三秒。",
    content: "起跑器卡好、深呼吸、裁判舉旗——我們把鏡頭對準的,是槍響前最安靜的三秒。",
    meta: "2026.04.18 · 幕後故事",
    tone: { a: "#FFD699", b: "#1E2430", icon: "blocks" },
    status: "published",
    createdAt: new Date("2026-04-18T00:00:00.000Z").toISOString(),
  },
  {
    tag: "賽事直擊",
    title: "跨欄選手的節奏課:三步上欄,一步都不能亂",
    excerpt: "110公尺跨欄的勝負,往往在第三欄前就已經決定。我們用連拍記錄下每一步的落地角度。",
    content: "110公尺跨欄的勝負,往往在第三欄前就已經決定。我們用連拍記錄下每一步的落地角度。",
    meta: "2026.04.15 · 田徑場邊記事",
    tone: { a: "#F8EFE2", b: "#D58D3F", icon: "hurdle" },
    status: "published",
    createdAt: new Date("2026-04-15T00:00:00.000Z").toISOString(),
  },
  {
    tag: "頒獎時刻",
    title: "站上頒獎台的三秒鐘,比賽跑還珍貴",
    excerpt: "領獎、敬禮、看著隊旗升起——這是選手們練習了一整個學期才等到的畫面。",
    content: "領獎、敬禮、看著隊旗升起——這是選手們練習了一整個學期才等到的畫面。",
    meta: "2026.04.12 · 頒獎時刻",
    tone: { a: "#FFD699", b: "#766D63", icon: "podium" },
    status: "published",
    createdAt: new Date("2026-04-12T00:00:00.000Z").toISOString(),
  },
  {
    tag: "器材筆記",
    title: "如何選一支追得上百米衝刺的鏡頭",
    excerpt: "我們最常被問的問題:拍田徑到底該用什麼鏡頭?這篇整理了這幾年在跑道邊踩過的坑。",
    content: "我們最常被問的問題:拍田徑到底該用什麼鏡頭?這篇整理了這幾年在跑道邊踩過的坑。",
    meta: "2026.04.08 · 器材筆記",
    tone: { a: "#FDF6EC", b: "#D45757", icon: "stopwatch" },
    status: "published",
    createdAt: new Date("2026-04-08T00:00:00.000Z").toISOString(),
  },
  {
    tag: "賽事公告",
    title: "115學年度下半年賽程總覽:我們接下來會在哪裡",
    excerpt: "從新北到高雄,秋季田徑賽季正式開跑,以下是青春止秒團隊確定進場拍攝的賽事清單。",
    content: "從新北到高雄,秋季田徑賽季正式開跑,以下是青春止秒團隊確定進場拍攝的賽事清單。",
    meta: "2026.09.01 · 賽事公告",
    tone: { a: "#FFB7C5", b: "#1E2430", icon: "flags" },
    status: "published",
    createdAt: new Date("2026-09-01T00:00:00.000Z").toISOString(),
  },
];

const schedule = [
  { date: "09.19 – 09.21", event: "新北市中等學校田徑錦標賽", place: "新北田徑場", order: 0 },
  { date: "10.03 – 10.05", event: "全國大專校院田徑公開賽", place: "高雄國家體育場", order: 1 },
  { date: "10.24", event: "樂活盃校際大隊接力邀請賽", place: "臺北田徑場", order: 2 },
  { date: "11.14 – 11.15", event: "中區聯合運動會", place: "臺中洲際田徑場", order: 3 },
  { date: "12.05", event: "城市青年田徑邀請賽", place: "桃園青埔田徑場", order: 4 },
];

async function seedCollection(db, name, docs) {
  const collection = db.collection(name);
  const existing = await collection.countDocuments();
  if (existing > 0) {
    console.log(`- ${name}: 已經有 ${existing} 筆資料,略過。`);
    return;
  }
  await collection.insertMany(docs);
  console.log(`- ${name}: 已寫入 ${docs.length} 筆資料。`);
}

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db("qsprint");
  await seedCollection(db, "heroSlides", heroSlides);
  await seedCollection(db, "news", news);
  await seedCollection(db, "schedule", schedule);
  console.log("種子資料處理完成。");
} finally {
  await client.close();
}
