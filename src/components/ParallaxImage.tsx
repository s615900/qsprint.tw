"use client";

import { useEffect, useRef } from "react";

interface ParallaxImageProps {
  speed?: number;
  className?: string;
  children: React.ReactNode;
}

export default function ParallaxImage({
  speed = 0.5,
  className = "",
  children,
}: ParallaxImageProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const maxShiftPercent = 8 * speed;
    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = outer.getBoundingClientRect();
      const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      const clamped = Math.max(-1, Math.min(1, progress));
      inner.style.transform = `translate3d(0, ${(clamped * maxShiftPercent).toFixed(2)}%, 0)`;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return (
    <div ref={outerRef} className={`relative h-full w-full overflow-hidden ${className}`}>
      <div ref={innerRef} className="absolute inset-x-0 -top-[8%] h-[116%] will-change-transform">
        {children}
      </div>
    </div>
  );
}
