import sharp from "sharp"; // 匯入影像處理套件，用來把浮水印疊加到照片上
import path from "node:path"; // 匯入路徑工具
import { readFile } from "node:fs/promises"; // 匯入檔案讀取工具

let logoPromise: Promise<Buffer> | null = null; // 快取 logo 檔案內容，避免每次上傳都重新讀取硬碟

function getLogo(): Promise<Buffer> {
  return (logoPromise ??= readFile(path.join(process.cwd(), "public", "images", "qsprint-logo.png")));
}

export type WatermarkFormat = "jpeg" | "png" | "webp"; // applyWatermark 支援輸出的格式

export async function applyWatermark(imageBytes: Buffer, format: WatermarkFormat): Promise<Buffer> { // 在照片右下角疊上品牌 logo 浮水印，回傳處理後的圖片內容
  const base = sharp(imageBytes).rotate(); // rotate() 會依照片的 EXIF 方向自動轉正，避免手機直式照片跑歪
  const { width = 1600, height = 1200 } = await base.metadata();

  const logoWidth = Math.round(Math.min(width, height) * 0.22); // 浮水印寬度約為照片短邊的 22%
  const margin = Math.round(Math.min(width, height) * 0.03); // 浮水印與照片邊緣的留白

  const logo = await sharp(await getLogo()).resize({ width: logoWidth }).toBuffer();
  const { height: logoHeight = logoWidth } = await sharp(logo).metadata();

  const composited = base.composite([
    {
      input: logo,
      left: Math.max(0, width - logoWidth - margin),
      top: Math.max(0, height - logoHeight - margin),
    },
  ]);

  if (format === "png") return composited.png().toBuffer();
  if (format === "webp") return composited.webp({ quality: 90 }).toBuffer();
  return composited.jpeg({ quality: 90 }).toBuffer();
}
