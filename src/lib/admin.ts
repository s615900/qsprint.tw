export function daysUntil(isoDate: string): number { // 匯出函式：計算距離某個日期(YYYY-MM-DD)還有幾天
  const target = new Date(`${isoDate}T00:00:00`); // 把日期字串轉成當地時區的午夜時間

  const now = new Date(); // 取得目前的完整時間
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 只取年月日，去掉時分秒，得到「今天」

  return Math.round((target.getTime() - today.getTime()) / 86400000); // 回傳目標日期與今天相差的天數（四捨五入）
} // 結束 daysUntil 函式

export function formatScheduleDate(startDate: string, endDate: string): string { // 把起訖日期格式化成畫面上顯示用的文字，例如 "09.19 – 09.21"
  const toMonthDay = (isoDate: string) => isoDate.slice(5).replace("-", "."); // "2027-09-19" -> "09.19"
  const start = toMonthDay(startDate);
  if (startDate === endDate) return start; // 單日賽事只顯示一個日期
  return `${start} – ${toMonthDay(endDate)}`;
}

export function formatDate(isoDate: string): string { // 把 "YYYY-MM-DD" 格式化成畫面顯示用的 "YYYY.MM.DD"
  return isoDate.replaceAll("-", ".");
}
