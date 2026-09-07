import ArtTile from "./ArtTile";
import PhotoTile from "./PhotoTile";
import ParallaxImage from "./ParallaxImage";
import Eyebrow from "./Eyebrow";
import { news } from "@/lib/content";

export default function NewsSection() {
  const [lead, ...rest] = news;

  return (
    <section id="news" className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-ink pb-4">
        <h2 className="font-display text-[1.6rem] font-bold sm:text-[2rem] lg:text-[2.3rem]">
          最新消息
        </h2>
        <p className="max-w-[40ch] text-[0.85rem] text-muted">
          賽場邊的第一手記錄,從起跑到頒獎台,每一篇都是一場比賽的側寫。
        </p>
      </div>

      {/* Lead story */}
      <article className="group grid gap-6 border-b border-line pb-10 sm:grid-cols-[0.9fr_1.1fr] sm:gap-10">
        <div className="aspect-[4/3] sm:aspect-auto">
          <ParallaxImage speed={0.5}>
            <PhotoTile
              src="/images/track-05-finish-line.jpg"
              alt="大隊接力選手在交接區內全力衝刺"
            />
          </ParallaxImage>
        </div>
        <div className="flex flex-col justify-center gap-3">
          <span className="font-clock text-[0.85rem] tracking-widest text-muted">01</span>
          <Eyebrow>{lead.tag}</Eyebrow>
          <h3 className="font-display text-[1.5rem] font-bold leading-snug sm:text-[1.9rem]">
            <a href="#" className="no-underline transition-colors group-hover:text-coral">
              {lead.title}
            </a>
          </h3>
          <p className="max-w-[52ch] text-ink-soft">{lead.excerpt}</p>
          <p className="font-clock text-[0.85rem] tracking-wide text-muted">{lead.meta}</p>
        </div>
      </article>

      {/* Remaining dispatches */}
      <div className="divide-y divide-line">
        {rest.map((item, index) => (
          <article
            key={item.title}
            className="group grid grid-cols-[auto_1fr] items-start gap-5 py-7 sm:grid-cols-[3.5rem_10rem_1fr]"
          >
            <span className="font-clock text-[1.6rem] leading-none text-ink/25">
              {String(index + 2).padStart(2, "0")}
            </span>
            <div className="col-span-2 aspect-[16/10] sm:col-span-1">
              <ArtTile toneA={item.tone.a} toneB={item.tone.b} icon={item.tone.icon} />
            </div>
            <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
              <Eyebrow>{item.tag}</Eyebrow>
              <h3 className="text-[1.1rem] font-bold leading-snug">
                <a href="#" className="no-underline transition-colors group-hover:text-coral">
                  {item.title}
                </a>
              </h3>
              <p className="text-[0.86rem] text-ink-soft">{item.excerpt}</p>
              <p className="font-clock text-[0.8rem] tracking-wide text-muted">{item.meta}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
