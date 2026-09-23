import Image from "next/image"; // 匯入 Next.js 最佳化圖片元件

interface PhotoTileProps {
  src: string; // 圖片路徑
  alt: string; // 替代文字
  priority?: boolean; // 是否優先載入，預設非優先
  className?: string; // 自訂樣式 class
  fit?: "cover" | "contain"; // 圖片與容器比例不同時的處理方式：cover 會裁切填滿(預設，適合縮圖/格線)，contain 會完整顯示不裁切(適合文章主圖等不希望內容被切掉的場合)
}

export default function PhotoTile({ src, alt, priority = false, className = "", fit = "cover" }: PhotoTileProps) {
  // 顯示單張填滿容器的照片元件
  return ( // 回傳照片容器的 JSX
    <div className={`relative h-full w-full overflow-hidden bg-paper-3 ${className}`}>
      {/* 相對定位、填滿高寬、超出裁切的外層容器 */}
      <Image
        src={src} // 圖片來源路徑
        alt={alt} // 替代文字
        fill // 讓圖片填滿父層容器
        sizes="(min-width: 1024px) 50vw, 100vw" // 依裝置寬度提供的圖片顯示尺寸提示
        className={fit === "contain" ? "object-contain" : "object-cover"} // cover:等比例裁切填滿；contain:完整顯示、不裁切內容
        priority={priority} // 是否優先載入此圖片
      />
    </div>
  );
}
