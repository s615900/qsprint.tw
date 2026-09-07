"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/content";
import SocialLinks from "./SocialLinks";

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-[rgba(255,251,244,0.9)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <Image
            src="/images/qsprint-icon-v2.png"
            alt=""
            width={468}
            height={341}
            className="h-10 w-auto flex-none"
            priority
          />
          <span className="leading-tight">
            <span className="block font-display text-[1.05rem] font-bold tracking-wide">
              青春止秒
            </span>
            <span className="mt-0.5 block text-[0.6rem] tracking-[0.16em] text-muted">
              TIME STOPS AT YOUTH
            </span>
          </span>
        </Link>

        <nav aria-label="主導覽" className="hidden gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`border-b-2 pb-0.5 text-[0.86rem] tracking-wide no-underline transition-colors ${
                pathname === link.href
                  ? "border-gold text-ink"
                  : "border-transparent text-ink-soft hover:border-gold hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a
          href="https://lin.ee/wsZVOO7"
          target="_blank"
          rel="noopener"
          className="hidden whitespace-nowrap bg-ink px-[1.1rem] py-[0.6rem] font-clock text-[0.9rem] tracking-[0.1em] text-paper no-underline transition-colors hover:bg-coral lg:inline-block"
        >
          賽事合作洽詢
        </a>

        <button
          type="button"
          aria-label={menuOpen ? "關閉選單" : "開啟選單"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 flex-none flex-col items-center justify-center gap-[5px] border border-ink lg:hidden"
        >
          <span
            className={`h-[2px] w-5 bg-ink transition-transform ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`h-[2px] w-5 bg-ink transition-transform ${menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {menuOpen && (
        <div className="border-t-2 border-ink bg-paper lg:hidden">
          <nav aria-label="行動裝置導覽" className="flex flex-col divide-y divide-line px-5 sm:px-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`py-3.5 text-[0.95rem] tracking-wide no-underline ${
                  pathname === link.href ? "text-coral" : "text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-4 border-t border-line px-5 py-4 sm:px-8">
            <a
              href="https://lin.ee/wsZVOO7"
              target="_blank"
              rel="noopener"
              onClick={() => setMenuOpen(false)}
              className="inline-flex w-fit items-center bg-ink px-[1.1rem] py-[0.6rem] font-clock text-[0.9rem] tracking-[0.1em] text-paper no-underline"
            >
              賽事合作洽詢
            </a>
            <SocialLinks />
          </div>
        </div>
      )}
    </header>
  );
}
