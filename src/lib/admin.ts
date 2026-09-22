export function daysUntil(dateStr: string): number { // 匯出函式：計算距離某個賽程日期字串還有幾天
  const startPart = dateStr.split("–")[0].trim(); // 取出日期範圍字串中「–」前的起始日期部分，並去除頭尾空白
  const [month, day] = startPart.split(".").map(Number); // 用「.」切割成月、日兩段，並轉成數字

  const now = new Date(); // 取得目前的完整時間
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 只取年月日，去掉時分秒，得到「今天」
  let target = new Date(today.getFullYear(), month - 1, day); // 用今年年份加上解析出的月、日，組出目標日期（month - 1 是因為 Date 月份從 0 開始）

  // Schedule strings carry no year; roll a stale-looking date into next year
  // rather than reporting it as ~360 days in the past.
  if (target.getTime() < today.getTime() - 30 * 86400000) { // 如果目標日期比今天早超過 30 天，代表這是「過期」的日期字串
    target = new Date(today.getFullYear() + 1, month - 1, day); // 把年份改成明年，避免顯示成快一年前的過去日期
  } // 結束「日期過期則跨年」的判斷區塊

  return Math.round((target.getTime() - today.getTime()) / 86400000); // 回傳目標日期與今天相差的天數（四捨五入）
} // 結束 daysUntil 函式
