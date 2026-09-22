import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // 匯入 S3 相容用戶端；Cloudflare R2 完全相容 S3 API

function r2Config() { // 讀取 R2 連線設定，任何一項沒設定就回傳 null(呼叫端據此判斷要不要改用其他儲存方式)
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) return null;
  return { accountId, accessKeyId, secretAccessKey, bucket, publicUrl: publicUrl.replace(/\/$/, "") };
}

export function isR2Configured(): boolean { // 供其他地方判斷是否已設定好 R2，不用重複讀一次環境變數
  return r2Config() !== null;
}

export async function uploadToR2(key: string, bytes: Buffer, contentType: string): Promise<string> { // 上傳一個檔案到 R2，回傳公開可存取的網址
  const config = r2Config();
  if (!config) throw new Error("R2 尚未設定完成(缺少 R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET_NAME / R2_PUBLIC_URL 其中一項)。");

  const client = new S3Client({
    region: "auto", // R2 不分區域，固定填 "auto"
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
  });

  await client.send(
    new PutObjectCommand({ Bucket: config.bucket, Key: key, Body: bytes, ContentType: contentType })
  );

  return `${config.publicUrl}/${key}`;
}
