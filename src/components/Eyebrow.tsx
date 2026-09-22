export default function Eyebrow({
  children, // 標籤內顯示的文字內容
  tone = "coral", // 顏色主題，預設為珊瑚色
  className = "", // 自訂樣式 class，預設空字串
}: {
  children: React.ReactNode;
  tone?: "coral" | "gold" | "paper";
  className?: string;
}) { // 小型「眉標」標籤元件，通常用在標題上方標示分類
  const dotColor = tone === "gold" ? "bg-gold" : tone === "paper" ? "bg-paper" : "bg-coral";
  // 依主題決定小圓點的背景顏色
  const textColor = tone === "gold" ? "text-gold" : tone === "paper" ? "text-paper" : "text-coral";
  // 依主題決定文字顏色

  return ( // 回傳眉標的 JSX
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {/* 小圓點與文字橫向排列的容器 */}
      <span className={`h-2 w-2 flex-none ${dotColor}`} /> {/* 顯示的小圓點裝飾 */}
      <span className={`text-[0.72rem] font-bold tracking-[0.25em] ${textColor}`}>
        {children} {/* 顯示眉標文字內容 */}
      </span>
    </span>
  );
}
