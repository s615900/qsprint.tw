// 一次性腳本:清空 schedule collection 的舊示範資料，改匯入使用者提供的 2027(116年)賽事清單。
// 執行方式:node --env-file=.env.local scripts/import-schedule.mjs

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("找不到 MONGODB_URI,請確認有透過 --env-file=.env.local 執行這支腳本。");
  process.exit(1);
}

function formatDate(range) {
  // 把 "2/13-17" 或 "3/21" 這種格式轉成站上既有格式 "02.13 – 02.17" 或 "03.21"
  const pad = (n) => String(n).padStart(2, "0");
  const [startPart, endDay] = range.split("-");
  const [month, day] = startPart.split("/").map(Number);
  const start = `${pad(month)}.${pad(day)}`;
  if (!endDay) return start;
  return `${start} – ${pad(month)}.${pad(Number(endDay))}`;
}

const rows = [
  { date: "2/13-17", place: "臺北市", event: "2027年臺北市春季全國田徑公開賽" },
  { date: "2/21-26", place: "新北市", event: "116年新北市青年盃全國田徑公開賽" },
  { date: "3/8-13", place: "高雄市", event: "2027年港都盃全國田徑錦標賽" },
  { date: "3/21", place: "南投縣", event: "2027年(第3屆)南投日月潭國際撐竿跳高邀請賽" },
  { date: "3/23", place: "南投縣", event: "2027年(第31屆)南投國際室內撐竿跳高邀請賽" },
  { date: "3/26-28", place: "臺中市", event: "116年原住民運動會" },
  { date: "3/26-27", place: "新北市", event: "116年全國大專校院田徑公開賽" },
  { date: "4/18-22", place: "新北市", event: "116年全國中等學校運動會 ★" },
  { date: "5/2-5", place: "臺北市", event: "116年全國大專校院運動會 ★" },
  { date: "5/19-20", place: "基隆市", event: "116年全國小學田徑錦標賽" },
  { date: "6/4-5", place: "臺南市", event: "116年全國田徑錦標賽 ◆" },
  { date: "9/15-19", place: "臺北市", event: "2027年臺北市秋季全國田徑公開賽" },
  { date: "9/25-30", place: "新北市", event: "116年新北城市盃全國田徑公開賽" },
  { date: "11/3-6", place: "地點未定", event: "116年全國中等學校田徑錦標賽" },
  { date: "11/13-18", place: "屏東縣", event: "116年全國運動會 ◆" },
  { date: "12/1-4", place: "屏東縣", event: "116年屏東盃全國中小學田徑錦標賽" },
];

const schedule = rows.map((row, index) => ({
  date: formatDate(row.date),
  place: row.place,
  event: row.event,
  order: index,
}));

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db("qsprint");
  const collection = db.collection("schedule");

  const deleted = await collection.deleteMany({});
  console.log(`已刪除舊資料 ${deleted.deletedCount} 筆。`);

  const inserted = await collection.insertMany(schedule);
  console.log(`已匯入新資料 ${inserted.insertedCount} 筆。`);
} finally {
  await client.close();
}
