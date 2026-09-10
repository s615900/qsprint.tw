import { schedule } from "@/lib/content";
import { daysUntil } from "@/lib/admin";
import { IconPencil, IconTrash } from "./AdminIcons";

export default function AdminSchedule() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold">賽事行事曆</h2>
          <p className="mt-1 text-[12.5px] text-ink-soft">確定進場拍攝的賽事清單,倒數以今日日期計算。</p>
        </div>
        <button
          type="button"
          className="rounded-full bg-gold px-4 py-2 text-[13px] font-semibold text-paper hover:bg-gold/90"
        >
          + 新增賽事
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line bg-paper-2">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted">
              <th className="border-b border-line px-4 py-2.5">日期</th>
              <th className="border-b border-line px-4 py-2.5">賽事名稱</th>
              <th className="border-b border-line px-4 py-2.5">地點</th>
              <th className="border-b border-line px-4 py-2.5">倒數</th>
              <th className="border-b border-line px-4 py-2.5">狀態</th>
              <th className="border-b border-line px-4 py-2.5 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item) => {
              const days = daysUntil(item.date);
              const isPast = days < 0;
              const isSoon = !isPast && days <= 14;
              return (
                <tr key={item.event} className="text-[13px] hover:bg-paper-3">
                  <td className="font-clock border-b border-line px-4 py-3.5 text-[15px] tabular-nums">
                    {item.date}
                  </td>
                  <td className="border-b border-line px-4 py-3.5 font-semibold">{item.event}</td>
                  <td className="border-b border-line px-4 py-3.5 text-ink-soft">{item.place}</td>
                  <td className="border-b border-line px-4 py-3.5 tabular-nums">
                    {isPast ? "已結束" : `${days} 天`}
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${
                        isPast
                          ? "bg-paper-3 text-muted"
                          : isSoon
                            ? "bg-coral/10 text-coral"
                            : "bg-paper-3 text-ink-soft"
                      }`}
                    >
                      {isPast ? "已結束" : isSoon ? "即將開始" : "已排定"}
                    </span>
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    <div className="flex justify-end gap-1">
                      <button type="button" className="rounded-md p-1.5 text-ink-soft hover:bg-paper-3 hover:text-ink">
                        <IconPencil className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" className="rounded-md p-1.5 text-ink-soft hover:bg-paper-3 hover:text-ink">
                        <IconTrash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
