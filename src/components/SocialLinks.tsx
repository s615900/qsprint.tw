import { socialLinks } from "@/lib/content"; // 匯入社群連結的靜態資料

interface SocialLinksProps { // 定義本元件接受的 props 型別
  className?: string; // 額外的自訂 CSS class(選填)
  size?: "sm" | "md"; // 圖示尺寸，預設為中(md)，可選小(sm)
}

export default function SocialLinks({ className = "", size = "md" }: SocialLinksProps) { // 匯出社群連結元件，解構並給予預設值
  const sizeClasses = // 依 size 決定實際使用的樣式字串
    size === "sm" ? "h-6 w-6 text-[0.58rem]" : "h-8 w-8 text-[0.68rem]"; // sm 用較小尺寸，其餘(md)用較大尺寸

  return ( // 回傳畫面結構
    <div className={`flex gap-2 ${className}`}> {/* 社群圖示的橫向排列容器，附加外部傳入的 className */}
      {socialLinks.map((social) => ( // 走訪社群連結陣列，為每一筆資料渲染一個圖示連結
        <a
          key={social.label} // 以社群名稱作為 key
          href={social.href} // 連結網址
          target={social.href.startsWith("http") ? "_blank" : undefined} // 若為外部網址則在新分頁開啟
          rel={social.href.startsWith("http") ? "noopener" : undefined} // 外部連結加上 noopener 提升安全性
          aria-label={social.label} // 提供無障礙標籤，說明連結用途
          title={social.label} // 滑鼠懸停時顯示的提示文字
          className={`flex items-center justify-center rounded-full font-bold text-white no-underline transition-opacity hover:opacity-80 ${sizeClasses}`} // 圓形圖示樣式，含 hover 透明度效果與動態尺寸
          style={{ backgroundColor: social.bg }} // 依資料設定圖示的背景顏色
        >
          {social.short} {/* 顯示社群簡稱文字(如 FB、IG) */}
        </a>
      ))}
    </div>
  );
}
