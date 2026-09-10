export function daysUntil(dateStr: string): number {
  const startPart = dateStr.split("–")[0].trim();
  const [month, day] = startPart.split(".").map(Number);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let target = new Date(today.getFullYear(), month - 1, day);

  // Schedule strings carry no year; roll a stale-looking date into next year
  // rather than reporting it as ~360 days in the past.
  if (target.getTime() < today.getTime() - 30 * 86400000) {
    target = new Date(today.getFullYear() + 1, month - 1, day);
  }

  return Math.round((target.getTime() - today.getTime()) / 86400000);
}
