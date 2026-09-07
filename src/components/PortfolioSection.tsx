import ArtTile from "./ArtTile";
import PhotoTile from "./PhotoTile";
import { portfolio } from "@/lib/content";

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-ink pb-4">
        <h2 className="font-display text-[1.6rem] font-bold sm:text-[2rem] lg:text-[2.3rem]">
          作品集精選
        </h2>
        <p className="max-w-[40ch] text-[0.85rem] text-muted">
          以新聞現場的節奏整理每一場比賽的關鍵瞬間——起跑、交棒、衝線、頒獎。
        </p>
      </div>

      <div className="grid grid-cols-2 gap-px bg-ink sm:grid-cols-3 lg:grid-cols-4">
        {portfolio.map((shot, index) => (
          <figure key={shot.caption + shot.date} className="relative aspect-[4/5] overflow-hidden bg-paper">
            {shot.photo ? (
              <PhotoTile src={shot.photo} alt={shot.caption} />
            ) : (
              <ArtTile toneA={shot.tone.a} toneB={shot.tone.b} icon={shot.tone.icon} />
            )}
            <span className="absolute left-0 top-0 bg-ink px-2 py-1 font-clock text-[0.75rem] tracking-widest text-paper">
              道 {(index % 8) + 1}
            </span>
            <figcaption className="absolute inset-x-0 bottom-0 bg-ink/85 px-3 py-2.5 text-[0.72rem] leading-relaxed text-paper">
              <b className="block text-[0.78rem] font-bold">{shot.caption}</b>
              {shot.place} · {shot.date}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
