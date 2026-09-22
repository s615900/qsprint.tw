"use client"; // 標記為 Client Component，因為使用了 DOM 操作與滾動事件

import { useEffect, useRef } from "react"; // 匯入副作用與 ref 兩個 hook

interface ParallaxImageProps { // 定義視差圖片容器的 props 型別
  speed?: number; // 視差移動速度倍率，選填
  className?: string; // 額外的 CSS class，選填
  children: React.ReactNode; // 內部要顯示的子元素(通常是圖片)
}

export default function ParallaxImage({ // 定義並匯出視差圖片容器元件
  speed = 0.5, // 解構速度，預設 0.5
  className = "", // 解構額外 class，預設空字串
  children, // 解構子元素
}: ParallaxImageProps) {
  const outerRef = useRef<HTMLDivElement>(null); // 外層容器的 DOM 參照，用來量測位置
  const innerRef = useRef<HTMLDivElement>(null); // 內層元素的 DOM 參照，用來套用位移效果

  useEffect(() => { // 監聽捲動事件並計算視差位移
    const outer = outerRef.current; // 取得外層 DOM 節點
    const inner = innerRef.current; // 取得內層 DOM 節點
    if (!outer || !inner) return; // 若任一節點尚未掛載，直接結束
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // 使用者偏好減少動態效果時不套用視差

    const maxShiftPercent = 8 * speed; // 依速度倍率計算最大位移百分比
    let ticking = false; // 節流旗標，避免同一幀重複排程

    const update = () => { // 計算並套用目前的視差位移
      ticking = false; // 重設節流旗標
      const rect = outer.getBoundingClientRect(); // 取得外層容器目前的位置與尺寸
      const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight; // 計算元素中心相對於視窗中心的位移比例
      const clamped = Math.max(-1, Math.min(1, progress)); // 將比例限制在 -1 到 1 之間
      inner.style.transform = `translate3d(0, ${(clamped * maxShiftPercent).toFixed(2)}%, 0)`; // 套用垂直位移，取兩位小數
    };

    const onScroll = () => { // 捲動事件處理函式，透過 requestAnimationFrame 節流
      if (!ticking) { // 若尚未排程更新
        ticking = true; // 標記為已排程
        requestAnimationFrame(update); // 排到下一個影格再更新，避免過度計算
      }
    };

    update(); // 初次掛載時先計算一次位置
    window.addEventListener("scroll", onScroll, { passive: true }); // 監聽捲動事件(passive 提升捲動效能)
    window.addEventListener("resize", onScroll); // 監聽視窗大小改變事件
    return () => { // 清除函式：元件卸載或 speed 改變時移除監聽
      window.removeEventListener("scroll", onScroll); // 移除捲動事件監聽
      window.removeEventListener("resize", onScroll); // 移除大小改變事件監聽
    };
  }, [speed]); // 依賴 speed，改變時重新註冊監聽

  return ( // 回傳外層與內層容器的 JSX 結構
    <div ref={outerRef} className={`relative h-full w-full overflow-hidden ${className}`}>
      <div ref={innerRef} className="absolute inset-x-0 -top-[8%] h-[116%] will-change-transform">
        {children} {/* 顯示外部傳入的子元素(通常是實際圖片) */}
      </div>
    </div>
  );
}
