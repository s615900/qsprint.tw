import type { ComponentType } from "react";
import { stats, schedule, news, portfolio, heroSlides } from "@/lib/content";
import { daysUntil } from "@/lib/admin";
import type { AdminSection } from "./AdminSidebar";
import { IconDoc, IconUpload, IconLayers, IconCalendar } from "./AdminIcons";

const uploadedCount = portfolio.filter((shot) => shot.photo).length;
const pendingCount = portfolio.length - uploadedCount;
const nextEvent = schedule[0];

export default function AdminOverview({
  onNavigate,
}: {
  onNavigate: (section: AdminSection) => void;
}) {
  const nextEventDays = daysUntil(nextEvent.date);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-paper-2 px-4 py-3.5">
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">{s.label}</p>
            <p className="font-clock mt-1 text-[1.9rem] leading-none text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-xl border border-line bg-paper-2 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gold">待辦事項</p>
          <h3 className="mt-1 text-[14px] font-bold">需要你處理的 4 件事</h3>
          <ul className="mt-3.5 flex flex-col divide-y divide-line">
            <TodoRow
              icon={IconDoc}
              onClick={() => onNavigate("news")}
              title="1 篇消息草稿待發布"
              detail="「新北市中等學校田徑錦標賽・賽前預告」・建議於 09.19 開賽前送出"
              tagLabel="草稿"
              tagTone="muted"
            />
            <TodoRow
              icon={IconUpload}
              onClick={() => onNavigate("portfolio")}
              title={`${pendingCount} 張作品尚未上傳原始檔`}
              detail={`目前以色卡佔位・作品集僅 ${uploadedCount}/${portfolio.length} 已上傳實際照片`}
              tagLabel="待上傳"
              tagTone="muted"
            />
            <TodoRow
              icon={IconLayers}
              onClick={() => onNavigate("hero")}
              title={`首頁輪播共 ${heroSlides.length} 則`}
              detail={`目前顯示第 1 則・「${heroSlides[0].titleLines.join("")}」`}
              tagLabel="顯示中"
              tagTone="live"
            />
            <TodoRow
              icon={IconCalendar}
              onClick={() => onNavigate("schedule")}
              title="最近賽事即將開始"
              detail={`${nextEvent.event}・${nextEvent.date}・${nextEvent.place}`}
              tagLabel={`${nextEventDays} 天後`}
              tagTone="soon"
            />
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-line bg-paper-2 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gold">近期賽事</p>
            <h3 className="mt-1 text-[14px] font-bold">接下來的拍攝行程</h3>
            <div className="mt-3 flex flex-col divide-y divide-line">
              {schedule.slice(0, 3).map((item) => {
                const days = daysUntil(item.date);
                return (
                  <div key={item.event} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                    <span className="font-clock w-16 flex-none rounded-md bg-paper-3 py-1 text-center text-[12px] tabular-nums">
                      {item.date.split("–")[0].trim()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-semibold">{item.event}</p>
                      <p className="truncate text-[11.5px] text-ink-soft">{item.place}</p>
                    </div>
                    <span
                      className={`flex-none rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${
                        days <= 14 ? "bg-coral/10 text-coral" : "bg-paper-3 text-ink-soft"
                      }`}
                    >
                      {days <= 14 ? "即將開始" : "已排定"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-line bg-paper-2 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gold">內容總覽</p>
            <h3 className="mt-1 text-[14px] font-bold">目前站上內容量</h3>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <CountTile value={heroSlides.length} label="首頁焦點" />
              <CountTile value={news.length + 1} label="最新消息(1 草稿)" />
              <CountTile value={portfolio.length} label={`作品(${uploadedCount} 已上傳)`} />
              <CountTile value={schedule.length} label="賽事行程" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TodoRow({
  icon: Icon,
  onClick,
  title,
  detail,
  tagLabel,
  tagTone,
}: {
  icon: ComponentType<{ className?: string }>;
  onClick: () => void;
  title: string;
  detail: string;
  tagLabel: string;
  tagTone: "muted" | "live" | "soon";
}) {
  const tagClass =
    tagTone === "live"
      ? "bg-[#e3efe1] text-[#4c8c5a]"
      : tagTone === "soon"
        ? "bg-coral/10 text-coral"
        : "border border-dashed border-line bg-paper-3 text-muted";

  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-start gap-3 py-3 text-left first:pt-0 last:pb-0"
      >
        <Icon className="mt-0.5 h-4 w-4 flex-none text-gold" />
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-semibold text-ink">{title}</span>
          <span className="mt-0.5 block truncate text-[11.5px] text-ink-soft">{detail}</span>
        </span>
        <span className={`flex-none rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${tagClass}`}>
          {tagLabel}
        </span>
      </button>
    </li>
  );
}

function CountTile({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg bg-paper-3 px-3 py-2.5">
      <p className="font-clock text-[1.4rem] leading-none">{value}</p>
      <p className="mt-0.5 text-[11px] text-ink-soft">{label}</p>
    </div>
  );
}
