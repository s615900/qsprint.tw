import Image from "next/image"; // 匯入 Next.js 最佳化圖片元件

interface PhotoTileProps {
  src: string; // 圖片路徑
  alt: string; // 替代文字
  priority?: boolean; // 是否優先載入，預設非優先
  className?: string; // 自訂樣式 class
}

export default function PhotoTile({ src, alt, priority = false, className = "" }: PhotoTileProps) {
  // 顯示單張填滿容器的照片元件
  return ( // 回傳照片容器的 JSX
    <div className={`relative h-full w-full overflow-hidden bg-paper-3 ${className}`}>
      {/* 相對定位、填滿高寬、超出裁切的外層容器 */}
      <Image
        src={src} // 圖片來源路徑
        alt={alt} // 替代文字
        fill // 讓圖片填滿父層容器
        sizes="(min-width: 1024px) 50vw, 100vw" // 依裝置寬度提供的圖片顯示尺寸提示
        className="object-cover" // 等比例裁切填滿，不變形
        priority={priority} // 是否優先載入此圖片
      />
    </div>
  );
}
