import Image from "next/image";
import Link from "next/link";
import { navLinks, contactInfo } from "@/lib/content";
import SocialLinks from "./SocialLinks";

export default function SiteFooter() {
  return (
    <footer className="bg-paper-2">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 sm:py-14 md:grid-cols-[1.3fr_0.8fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-3 no-underline">
            <Image
              src="/images/qsprint-icon-v2.png"
              alt=""
              width={468}
              height={341}
              className="h-12 w-auto flex-none"
            />
            <span className="leading-tight">
              <span className="block font-display text-[1.1rem] font-bold tracking-wide">
                青春止秒
              </span>
              <span className="mt-0.5 block text-[0.62rem] tracking-[0.16em] text-muted">
                TIME STOPS AT YOUTH
              </span>
            </span>
          </Link>
          <p className="mt-4 max-w-[36ch] text-[0.86rem] text-ink-soft">
            專注在校園與業餘田徑賽事的紀錄團隊,用鏡頭留住跑道上用盡全力的每一秒。
          </p>
          <SocialLinks className="mt-5" />
        </div>

        <div>
          <h3 className="font-clock text-[0.9rem] tracking-[0.15em] text-muted">
            快速連結
          </h3>
          <ul className="mt-4 space-y-2.5 text-[0.88rem]">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-ink-soft no-underline hover:text-coral">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-clock text-[0.9rem] tracking-[0.15em] text-muted">
            聯絡資訊
          </h3>
          <ul className="mt-4 space-y-2.5 text-[0.88rem]">
            {contactInfo.map((item) => (
              <li key={item.label} className="flex flex-col">
                <span className="text-[0.72rem] text-muted">{item.label}</span>
                {item.href ? (
                  <a href={item.href} className="text-ink-soft no-underline hover:text-coral">
                    {item.value}
                  </a>
                ) : (
                  <span className="text-ink-soft">{item.value}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-5 py-5 text-[0.76rem] text-muted sm:px-8">
          <span>© 2026 青春止秒攝影 TIME STOPS AT YOUTH</span>
          <span>此為網站改版示範・版型可依實際內容替換文字與照片</span>
        </div>
      </div>
    </footer>
  );
}
