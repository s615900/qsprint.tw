import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3"; // 匯入 S3 相容用戶端；Cloudflare R2 完全相容 S3 API

type R2Config = NonNullable<ReturnType<typeof r2Config>>;

function r2Config() { // 讀取 R2 連線設定，任何一項沒設定就回傳 null(呼叫端據此判斷要不要改用其他儲存方式)
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) return null;
  return { accountId, accessKeyId, secretAccessKey, bucket, publicUrl: publicUrl.replace(/\/$/, "") };
}

function r2Client(config: R2Config): S3Client { // 依連線設定建立 S3 用戶端，上傳、列出物件共用
  return new S3Client({
    region: "auto", // R2 不分區域，固定填 "auto"
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
  });
}

export function isR2Configured(): boolean { // 供其他地方判斷是否已設定好 R2，不用重複讀一次環境變數
  return r2Config() !== null;
}

export async function uploadToR2(key: string, bytes: Buffer, contentType: string): Promise<string> { // 上傳一個檔案到 R2，回傳公開可存取的網址
  const config = r2Config();
  if (!config) throw new Error("R2 尚未設定完成(缺少 R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET_NAME / R2_PUBLIC_URL 其中一項)。");

  const client = r2Client(config);

  await client.send(
    new PutObjectCommand({ Bucket: config.bucket, Key: key, Body: bytes, ContentType: contentType })
  );

  return `${config.publicUrl}/${key}`;
}

export interface R2Object { // 列出既有物件時，回傳給呼叫端的精簡資訊
  key: string; // 物件在 R2 裡的完整路徑(key)
  src: string; // 公開可存取的網址
  lastModified: string; // ISO 字串，用來排序(新的在前面)
}

export async function listR2Objects(prefix: string): Promise<R2Object[]> { // 列出 R2 裡某個前置字元(資料夾)底下所有的物件，供後台「挑選既有照片」功能使用
  const config = r2Config();
  if (!config) return []; // 沒設定 R2 就回傳空陣列，呼叫端據此顯示「尚未設定」的提示

  const client = r2Client(config);
  const objects: R2Object[] = [];
  let continuationToken: string | undefined;

  do {
    const res = await client.send(
      new ListObjectsV2Command({ Bucket: config.bucket, Prefix: prefix, ContinuationToken: continuationToken })
    );
    for (const obj of res.Contents ?? []) {
      if (!obj.Key || obj.Key.endsWith("/")) continue; // 跳過資料夾本身這種沒有實際檔案的項目
      objects.push({
        key: obj.Key,
        src: `${config.publicUrl}/${obj.Key}`,
        lastModified: obj.LastModified ? obj.LastModified.toISOString() : "",
      });
    }
    continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (continuationToken);

  objects.sort((a, b) => b.lastModified.localeCompare(a.lastModified)); // 新上傳的排前面，方便找到剛拍的照片
  return objects;
}
