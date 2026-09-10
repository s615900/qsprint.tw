import { portfolio } from "@/lib/content";
import ArtTile from "./ArtTile";
import PhotoTile from "./PhotoTile";
import { IconCheck } from "./AdminIcons";

const uploadedCount = portfolio.filter((shot) => shot.photo).length;

export default function AdminPortfolio() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold">作品集</h2>
          <p className="mt-1 text-[12.5px] text-ink-soft">
            {portfolio.length} 張作品,其中 {uploadedCount} 張已上傳實際照片,其餘暫以色卡佔位。
          </p>
        </div>
        <button
          type="button"
          className="rounded-full bg-gold px-4 py-2 text-[13px] font-semibold text-paper hover:bg-gold/90"
        >
          + 新增作品
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {portfolio.map((shot) => (
          <div key={shot.caption + shot.date} className="overflow-hidden rounded-xl border border-line bg-paper-2">
            <div className="relative aspect-[4/3]">
              {shot.photo ? (
                <PhotoTile src={shot.photo} alt={shot.caption} />
              ) : (
                <ArtTile toneA={shot.tone.a} toneB={shot.tone.b} icon={shot.tone.icon} />
              )}
              <span
                className={`absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold text-paper ${
                  shot.photo ? "bg-[#4c8c5a]" : "bg-ink/70"
                }`}
              >
                {shot.photo ? (
                  <>
                    <IconCheck className="h-2.5 w-2.5" />
                    已上傳
                  </>
                ) : (
                  "色卡佔位"
                )}
              </span>
            </div>
            <div className="px-3.5 py-3">
              <p className="text-[13px] font-semibold">{shot.caption}</p>
              <div className="mt-0.5 flex items-center justify-between gap-2 text-[11.5px] text-ink-soft">
                <span className="truncate">{shot.place}</span>
                <span className="tabular-nums">{shot.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
