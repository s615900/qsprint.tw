"use client"; // 標記為客戶端元件，因為要操作 DOM 與監聽捲動事件

import { useEffect, useRef } from "react"; // 匯入 React 的副作用與 ref hook

interface ParallaxProps {
  speed?: number; // 視差移動速度，數值越大位移越明顯
  className?: string; // 自訂樣式 class
  children: React.ReactNode; // 包在裡面的子元素
}

export default function Parallax({ speed = 0.2, className = "", children }: ParallaxProps) {
  // 視差捲動效果元件，speed 預設 0.2，className 預設空字串
  const ref = useRef<HTMLDivElement>(null); // 指向要套用位移效果的 div 元素

  useEffect(() => { // 元件掛載後執行的副作用
    const el = ref.current; // 取得目前的 DOM 節點
    if (!el) return; // 若節點尚未掛載則不執行
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // 使用者若設定「減少動態效果」偏好，則不套用視差效果

    let ticking = false; // 節流旗標，避免捲動事件觸發過多次更新

    const update = () => { // 更新元素位移的函式
      ticking = false; // 重置節流旗標
      el.style.transform = `translate3d(0, ${(window.scrollY * speed).toFixed(2)}px, 0)`;
      // 依目前捲動位置與速度計算並套用垂直位移
    };

    const onScroll = () => { // 捲動事件處理函式
      if (!ticking) { // 若尚未排程更新
        ticking = true; // 標記已排程，避免重複排程
        requestAnimationFrame(update); // 於下一個畫面更新時執行位移更新
      }
    };

    update(); // 初始化時先執行一次，設定初始位移
    window.addEventListener("scroll", onScroll, { passive: true });
    // 監聽視窗捲動事件，passive 提升捲動效能
    return () => window.removeEventListener("scroll", onScroll);
    // 元件卸載或依賴變動時移除監聽，避免記憶體洩漏
  }, [speed]); // 當 speed 改變時重新註冊效果

  return ( // 回傳包住子元素並套用位移樣式的容器
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children} {/* 顯示外部傳入的子元素 */}
    </div>
  );
}
