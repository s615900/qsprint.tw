import { heroSlides } from "@/lib/content";
import PhotoTile from "./PhotoTile";
import Eyebrow from "./Eyebrow";
import { IconDrag, IconPencil, IconTrash } from "./AdminIcons";

export default function AdminHeroSlides() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold">首頁焦點</h2>
          <p className="mt-1 text-[12.5px] text-ink-soft">
            拖曳排序卡片以調整首頁輪播出現的順序,順序不需與發布日期一致。
          </p>
        </div>
        <button
          type="button"
          className="rounded-full bg-gold px-4 py-2 text-[13px] font-semibold text-paper hover:bg-gold/90"
        >
          + 新增焦點
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.titleLines.join("")}
            className="grid grid-cols-[auto_5.5rem_1fr_auto] items-center gap-4 rounded-xl border border-line bg-paper-2 p-3.5"
          >
            <span className="cursor-grab text-muted">
              <IconDrag className="h-4 w-4" />
            </span>

            <div className="relative h-14 w-[5.5rem] flex-none overflow-hidden rounded-lg">
              <PhotoTile src={slide.image.src} alt={slide.image.alt} />
              <span className="font-clock absolute left-1 top-1 rounded bg-ink/60 px-1.5 py-0.5 text-[10px] text-paper">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="min-w-0">
              <Eyebrow tone="gold" className="mb-1">
                {slide.tag}
              </Eyebrow>
              <h4 className="truncate text-[13.5px] font-bold">{slide.titleLines.join("")}</h4>
              <p className="truncate text-[12px] text-ink-soft">{slide.description}</p>
            </div>

            <div className="flex items-center gap-2.5">
              <span
                className={`flex-none rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${
                  index === 0 ? "bg-[#e3efe1] text-[#4c8c5a]" : "bg-paper-3 text-ink-soft"
                }`}
              >
                {index === 0 ? "顯示中" : `排序 ${index + 1}`}
              </span>
              <button type="button" className="rounded-md p-1.5 text-ink-soft hover:bg-paper-3 hover:text-ink">
                <IconPencil className="h-3.5 w-3.5" />
              </button>
              <button type="button" className="rounded-md p-1.5 text-ink-soft hover:bg-paper-3 hover:text-ink">
                <IconTrash className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
