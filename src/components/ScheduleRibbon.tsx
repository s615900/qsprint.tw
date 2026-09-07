import Link from "next/link";
import { schedule } from "@/lib/content";

export default function ScheduleRibbon() {
  return (
    <div className="border-b-2 border-ink py-6">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="font-clock text-[1.3rem] tracking-wide">
              接下來,我們會出現在這些賽場
            </h2>
            <span className="font-clock text-[0.85rem] tracking-wide text-muted">
              SCHEDULE — 持續更新
            </span>
          </div>
          <Link
            href="/schedule"
            className="border-b-2 border-transparent text-[0.85rem] font-bold text-coral no-underline transition-colors hover:border-coral"
          >
            查看完整賽程 →
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1.5 [scroll-snap-type:x_proximity]">
          {schedule.map((item, index) => (
            <div
              key={item.event}
              className="min-w-[220px] flex-none border-t-4 border-gold bg-white px-4 py-3 [scroll-snap-align:start]"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-clock text-[1.4rem] leading-none tracking-wide text-ink">
                  {item.date}
                </span>
                <span className="font-clock text-[0.85rem] text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <span className="mt-2 block text-[0.9rem] font-semibold">
                {item.event}
              </span>
              <span className="mt-0.5 block text-[0.76rem] text-muted">
                {item.place}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
