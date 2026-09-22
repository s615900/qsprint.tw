import { MongoClient } from "mongodb"; // 匯入 MongoDB 官方客戶端

const uri = process.env.MONGODB_URI; // 從環境變數讀取連線字串
if (!uri) { // 若沒有設定連線字串就直接拋出錯誤，避免後面連線時才發現問題
  throw new Error("Missing MONGODB_URI environment variable");
}

const DB_NAME = "qsprint"; // 固定使用的資料庫名稱

declare global { // 擴充全域型別，讓開發模式下可以把連線快取在 global 上
  var _qsprintMongoClientPromise: Promise<MongoClient> | undefined; // 開發模式下跨熱重載共用的連線 Promise
}

// 開發模式下 Next.js 會因為熱重載重新執行這個檔案，若每次都 new MongoClient 會不斷開新連線，
// 所以把連線 Promise 存在 global 上重複使用；正式環境每次啟動只會執行一次，不需要這個快取。
const clientPromise: Promise<MongoClient> =
  process.env.NODE_ENV === "development"
    ? (globalThis._qsprintMongoClientPromise ??= new MongoClient(uri).connect())
    : new MongoClient(uri).connect();

export async function getDb() { // 匯出取得資料庫實例的函式，供 src/lib/db.ts 使用
  const client = await clientPromise; // 等待連線完成
  return client.db(DB_NAME); // 回傳固定名稱的資料庫
}
