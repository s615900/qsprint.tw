import { contactInfo, socialLinks, navLinks } from "@/lib/content";
import { IconPencil } from "./AdminIcons";

export default function AdminSettings() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-lg font-bold">網站設定</h2>
        <p className="mt-1 text-[12.5px] text-ink-soft">品牌資訊、社群連結與前台主選單內容。</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-line bg-paper-2 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gold">品牌資訊</p>
          <div className="mt-3.5 flex flex-col gap-3">
            <Field label="網站名稱" value="青春止秒" />
            {contactInfo.map((c) => (
              <Field key={c.label} label={c.label} value={c.value} />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-line bg-paper-2 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gold">社群連結</p>
          <div className="mt-3.5 flex flex-col divide-y divide-line">
            {socialLinks.map((s) => (
              <div key={s.label} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <div
                  className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-[10.5px] font-bold text-white"
                  style={{ background: s.bg }}
                >
                  {s.short}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-semibold">{s.label}</p>
                  <p className="truncate text-[11.5px] text-ink-soft">{s.href.replace(/^https?:\/\//, "")}</p>
                </div>
                <button type="button" className="rounded-md p-1.5 text-ink-soft hover:bg-paper-3 hover:text-ink">
                  <IconPencil className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-line bg-paper-2 p-5 sm:col-span-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gold">主選單</p>
          <h3 className="mt-1 text-[14px] font-bold">前台導覽連結</h3>
          <div className="mt-3 flex flex-col divide-y divide-line">
            {navLinks.map((link) => (
              <div key={link.href} className="flex items-center justify-between py-2.5 text-[13px] first:pt-0 last:pb-0">
                <span>{link.label}</span>
                <code className="rounded bg-paper-3 px-2 py-0.5 text-[11.5px] text-ink-soft">{link.href}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11.5px] font-semibold text-ink-soft">{label}</span>
      <input
        type="text"
        defaultValue={value}
        readOnly
        className="rounded-lg border border-line bg-paper px-3 py-2 text-[13px]"
      />
    </label>
  );
}
