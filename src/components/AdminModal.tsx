"use client"; // 標記為 Client Component，因為要處理點擊事件

export default function AdminModal({ // 後台新增/編輯表單共用的彈出視窗外框
  title, // 視窗標題
  onClose, // 關閉視窗的回呼函式
  children, // 視窗內容(通常是一個表單)
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return ( // 回傳彈出視窗的 JSX
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4 py-8" // 全螢幕半透明背景
      onClick={onClose} // 點擊背景時關閉視窗
    >
      <div
        className="max-h-full w-full max-w-lg overflow-y-auto rounded-xl bg-paper p-6" // 視窗本體，內容過長時可捲動
        onClick={(e) => e.stopPropagation()} // 阻止點擊內容時觸發背景的關閉事件
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-base font-bold">{title}</h3> {/* 視窗標題 */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-ink-soft hover:bg-paper-3 hover:text-ink"
            aria-label="關閉"
          >
            ✕
          </button>
        </div>
        {children} {/* 視窗內容 */}
      </div>
    </div>
  );
}
