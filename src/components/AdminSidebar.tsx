import type { ComponentType } from "react";
import { heroSlides, news, portfolio, schedule } from "@/lib/content";
import {
  IconGrid,
  IconLayers,
  IconDoc,
  IconImage,
  IconCalendar,
  IconGear,
} from "./AdminIcons";

export type AdminSection =
  | "dashboard"
  | "hero"
  | "news"
  | "portfolio"
  | "schedule"
  | "settings";

interface NavItem {
  id: AdminSection;
  label: string;
  icon: ComponentType<{ className?: string }>;
  count?: number;
}

const overviewNav: NavItem[] = [{ id: "dashboard", label: "總覽", icon: IconGrid }];

const contentNav: NavItem[] = [
  { id: "hero", label: "首頁焦點", icon: IconLayers, count: heroSlides.length },
  { id: "news", label: "最新消息", icon: IconDoc, count: news.length + 1 },
  { id: "portfolio", label: "作品集", icon: IconImage, count: portfolio.length },
  { id: "schedule", label: "賽事行事曆", icon: IconCalendar, count: schedule.length },
];

const siteNav: NavItem[] = [{ id: "settings", label: "網站設定", icon: IconGear }];

export default function AdminSidebar({
  active,
  onSelect,
}: {
  active: AdminSection;
  onSelect: (section: AdminSection) => void;
}) {
  return (
    <aside className="sticky top-0 flex h-screen w-56 flex-none flex-col gap-6 overflow-y-auto bg-ink px-3.5 py-5 text-paper">
      <div className="flex flex-col gap-3.5 px-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br from-peach to-coral text-ink">
            <svg viewBox="0 0 400 300" className="h-5 w-5">
              <use href="#s-stopwatch" />
            </svg>
          </div>
          <div className="leading-tight">
            <p className="font-display text-base font-bold">青春止秒</p>
            <p className="text-[10.5px] tracking-wide text-paper/60">Qsprint Backstage</p>
          </div>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-2.5 py-1 text-[10px] tracking-wide text-peach">
          介面預覽・尚未串接資料
        </span>
      </div>

      <nav className="flex flex-col gap-4">
        <NavGroup label="總覽" items={overviewNav} active={active} onSelect={onSelect} />
        <NavGroup label="內容管理" items={contentNav} active={active} onSelect={onSelect} />
        <NavGroup label="網站" items={siteNav} active={active} onSelect={onSelect} />
      </nav>

      <div className="mt-auto flex items-center gap-2.5 border-t border-paper/10 pt-3.5">
        <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-gold text-[11px] font-bold text-ink">
          WT
        </div>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[12.5px] font-semibold">吳蔚德</p>
          <p className="text-[11px] text-paper/55">內容編輯</p>
        </div>
      </div>
    </aside>
  );
}

function NavGroup({
  label,
  items,
  active,
  onSelect,
}: {
  label: string;
  items: NavItem[];
  active: AdminSection;
  onSelect: (section: AdminSection) => void;
}) {
  return (
    <div>
      <p className="mb-1 px-2.5 text-[10px] tracking-[0.15em] text-paper/45">{label}</p>
      <div className="flex flex-col gap-0.5">
        {items.map((item) => {
          const isActive = item.id === active;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium transition-colors ${
                isActive ? "bg-gold/15 text-peach" : "text-paper/65 hover:bg-paper/5 hover:text-paper"
              }`}
            >
              <Icon className="h-4 w-4 flex-none" />
              <span>{item.label}</span>
              {typeof item.count === "number" && (
                <span
                  className={`ml-auto rounded-full px-1.5 py-px text-[10.5px] ${
                    isActive ? "bg-gold/25 text-peach" : "bg-paper/10 text-paper/55"
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
