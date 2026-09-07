import Eyebrow from "./Eyebrow";
import { schedule } from "@/lib/content";

export default function ScheduleSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <Eyebrow>賽事行事曆</Eyebrow>
      <div className="mb-8 mt-4 flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-ink pb-4">
        <h2 className="font-display text-[1.6rem] font-bold sm:text-[2rem] lg:text-[2.3rem]">
          接下來,我們會出現在這些賽場
        </h2>
        <p className="max-w-[40ch] text-[0.85rem] text-muted">
          以下是青春止秒團隊確定進場拍攝的賽事清單,持續更新中,歡迎邀請我們一同紀錄。
        </p>
      </div>

      <div className="divide-y divide-line">
        {schedule.map((item) => (
          <div
            key={item.event}
            className="flex flex-col gap-1.5 py-6 sm:flex-row sm:items-center sm:gap-8"
          >
            <span className="font-clock text-[0.85rem] tracking-widest text-ink/25 sm:w-10">
              {item.date.slice(0, 2)}月
            </span>
            <span className="font-clock text-[1.4rem] leading-none tracking-wide text-gold sm:w-52 sm:flex-none">
              {item.date}
            </span>
            <div>
              <h3 className="text-[1.05rem] font-bold">{item.event}</h3>
              <p className="text-[0.85rem] text-muted">{item.place}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
