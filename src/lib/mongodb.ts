import { MongoClient } from "mongodb"; // 匯入 MongoDB 官方客戶端

const DB_NAME = "qsprint"; // 固定使用的資料庫名稱

declare global { // 擴充全域型別，讓開發模式下可以把連線快取在 global 上
  var _qsprintMongoClientPromise: Promise<MongoClient> | undefined; // 開發模式下跨熱重載共用的連線 Promise
}

let clientPromise: Promise<MongoClient> | undefined; // 正式環境用的連線快取(模組層級，同一個伺服器程序內重複使用)

function createClientPromise(): Promise<MongoClient> { // 實際建立連線，只有在真的要連線時才會讀取環境變數
  const uri = process.env.MONGODB_URI; // 從環境變數讀取連線字串
  if (!uri) { // 若沒有設定連線字串就直接拋出錯誤
    throw new Error("Missing MONGODB_URI environment variable");
  }
  return new MongoClient(uri).connect();
}

// 注意:這裡刻意不在「模組載入當下」就建立連線或檢查環境變數 —— Next.js 在建置(build)時
// 會為了收集路由資訊而載入這個模組，如果環境變數還沒設定好，模組載入就直接壞掉會讓整個建置失敗。
// 改成只有真正呼叫 getDb() 的時候才連線，環境變數沒設定也只會在實際讀寫資料庫時才報錯。
function getClientPromise(): Promise<MongoClient> {
  if (process.env.NODE_ENV === "development") {
    // 開發模式下 Next.js 會因為熱重載重新執行這個檔案，若每次都 new MongoClient 會不斷開新連線，
    // 所以把連線 Promise 存在 global 上重複使用。
    return (globalThis._qsprintMongoClientPromise ??= createClientPromise());
  }
  return (clientPromise ??= createClientPromise());
}

export async function getDb() { // 匯出取得資料庫實例的函式，供 src/lib/db.ts 使用
  const client = await getClientPromise(); // 等待連線完成
  return client.db(DB_NAME); // 回傳固定名稱的資料庫
}
