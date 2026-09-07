"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import PhotoTile from "./PhotoTile";
import ParallaxImage from "./ParallaxImage";
import Eyebrow from "./Eyebrow";
import type { HeroSlide } from "@/lib/content";

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = slides[index];

  const go = useCallback(
    (next: number) => setIndex(((next % slides.length) + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  return (
    <div
      className="relative mx-auto grid max-w-6xl items-end gap-8 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div key={index} className="order-2 animate-[fade-in-up_0.5s_ease-out] lg:order-1">
        <Eyebrow>{slide.tag}</Eyebrow>
        <h1 className="mt-4 max-w-[15ch] font-display text-[2.4rem] font-bold leading-[1.05] tracking-tight sm:text-[3rem] lg:text-[3.75rem]">
          {slide.titleLines.map((line, i) => (
            <span key={line}>
              {line}
              {i < slide.titleLines.length - 1 && <br />}
            </span>
          ))}
        </h1>
        <p className="mt-5 max-w-[44ch] border-l-2 border-gold pl-4 text-[1rem] text-ink-soft sm:text-[1.1rem]">
          {slide.description}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3 font-clock text-[0.95rem] tracking-wide text-muted">
          <span>{slide.author}</span>
          <span className="text-gold">/</span>
          <span>{slide.date}</span>
          <span className="text-gold">/</span>
          <span>{slide.readTime}</span>
        </div>
        <Link
          href={slide.ctaHref}
          className="mt-8 inline-flex items-center gap-2 bg-ink px-6 py-3 font-clock text-[1rem] tracking-[0.15em] text-paper transition-colors hover:bg-coral"
        >
          {slide.ctaLabel}
        </Link>
      </div>

      <div className="relative order-1 aspect-[5/4] lg:order-2">
        <div key={index} className="h-full w-full animate-[fade-in-up_0.5s_ease-out]">
          <ParallaxImage speed={0.6}>
            <PhotoTile src={slide.image.src} alt={slide.image.alt} priority={index === 0} />
          </ParallaxImage>
        </div>

        <button
          type="button"
          aria-label="上一則"
          onClick={() => go(index - 1)}
          className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-ink/70 text-paper transition-colors hover:bg-ink"
        >
          ←
        </button>
        <button
          type="button"
          aria-label="下一則"
          onClick={() => go(index + 1)}
          className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-ink/70 text-paper transition-colors hover:bg-ink"
        >
          →
        </button>

        <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.image.src}
              type="button"
              aria-label={`前往第 ${i + 1} 則`}
              aria-current={i === index}
              onClick={() => go(i)}
              className={`h-1.5 w-6 transition-colors ${i === index ? "bg-gold" : "bg-paper/60"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
