import { IconSearch } from "./AdminIcons";

export default function AdminTopbar({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-paper/90 px-7 py-4 backdrop-blur">
      <div>
        <h1 className="font-display text-xl font-bold">{title}</h1>
        <p className="mt-0.5 text-[12.5px] text-ink-soft">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2.5">
        <label className="hidden items-center gap-2 rounded-full border border-line bg-paper-2 px-3 py-1.5 text-muted sm:flex">
          <IconSearch className="h-3.5 w-3.5 flex-none" />
          <input
            type="text"
            placeholder="搜尋文章、作品或賽事…"
            className="w-44 bg-transparent text-[12.5px] text-ink placeholder:text-muted focus:outline-none"
          />
        </label>
        <button
          type="button"
          className="rounded-full border border-line bg-paper-2 px-3.5 py-1.5 text-[13px] font-semibold hover:bg-paper-3"
        >
          檢視前台
        </button>
      </div>
    </header>
  );
}
