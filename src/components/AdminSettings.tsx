import { contactInfo, socialLinks, navLinks } from "@/lib/content"; // 匯入聯絡資訊、社群連結、導覽選單靜態資料
import { IconPencil } from "./AdminIcons"; // 匯入鉛筆（編輯）圖示

export default function AdminSettings() { // 定義後台「網站設定」頁面元件並預設匯出
  return ( // 回傳畫面內容
    <div className="flex flex-col gap-5"> {/* 整頁垂直排列容器 */}
      <div> {/* 頁首標題區塊 */}
        <h2 className="font-display text-lg font-bold">網站設定</h2> {/* 頁面標題 */}
        <p className="mt-1 text-[12.5px] text-ink-soft">品牌資訊、社群連結與前台主選單內容。</p> {/* 頁面說明 */}
      </div>

      <div className="grid gap-4 sm:grid-cols-2"> {/* 卡片格線，平板以上分兩欄 */}
        <div className="rounded-xl border border-line bg-paper-2 p-5"> {/* 品牌資訊卡片 */}
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gold">品牌資訊</p> {/* 卡片小標籤 */}
          <div className="mt-3.5 flex flex-col gap-3"> {/* 欄位垂直排列容器 */}
            <Field label="網站名稱" value="青春止秒" /> {/* 固定顯示網站名稱欄位 */}
            {contactInfo.map((c) => ( // 走訪聯絡資訊陣列
              <Field key={c.label} label={c.label} value={c.value} /> // 逐筆渲染欄位，key 用標籤名稱
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-line bg-paper-2 p-5"> {/* 社群連結卡片 */}
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gold">社群連結</p> {/* 卡片小標籤 */}
          <div className="mt-3.5 flex flex-col divide-y divide-line"> {/* 清單容器，項目間有分隔線 */}
            {socialLinks.map((s) => ( // 走訪社群連結陣列
              <div key={s.label} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"> {/* 單筆社群連結列，key 用標籤名稱 */}
                <div
                  className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-[10.5px] font-bold text-white" // 圓角色塊樣式，固定寬高不縮放
                  style={{ background: s.bg }} // 依資料設定背景色
                >
                  {s.short} {/* 顯示平台縮寫，如 FB、IG */}
                </div>
                <div className="min-w-0 flex-1"> {/* 文字資訊容器，允許被截斷 */}
                  <p className="text-[12.5px] font-semibold">{s.label}</p> {/* 顯示平台全名 */}
                  <p className="truncate text-[11.5px] text-ink-soft">{s.href.replace(/^https?:\/\//, "")}</p> {/* 顯示網址並去掉開頭的 http(s):// */}
                </div>
                <button type="button" className="rounded-md p-1.5 text-ink-soft hover:bg-paper-3 hover:text-ink"> {/* 編輯按鈕 */}
                  <IconPencil className="h-3.5 w-3.5" /> {/* 顯示鉛筆圖示 */}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-line bg-paper-2 p-5 sm:col-span-2"> {/* 主選單卡片，平板以上橫跨兩欄 */}
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gold">主選單</p> {/* 卡片小標籤 */}
          <h3 className="mt-1 text-[14px] font-bold">前台導覽連結</h3> {/* 卡片子標題 */}
          <div className="mt-3 flex flex-col divide-y divide-line"> {/* 清單容器，項目間有分隔線 */}
            {navLinks.map((link) => ( // 走訪導覽連結陣列
              <div key={link.href} className="flex items-center justify-between py-2.5 text-[13px] first:pt-0 last:pb-0"> {/* 單筆導覽連結列，key 用網址 */}
                <span>{link.label}</span> {/* 顯示選單文字 */}
                <code className="rounded bg-paper-3 px-2 py-0.5 text-[11.5px] text-ink-soft">{link.href}</code> {/* 顯示對應網址路徑 */}
              </div>
            ))}
          </div>
        </div>
      </div> {/* 結束卡片格線容器 */}
    </div> // 結束整頁容器
  );
}

function Field({ label, value }: { label: string; value: string }) { // 定義單一唯讀欄位子元件，接收標籤與數值
  return ( // 回傳畫面內容
    <label className="flex flex-col gap-1.5"> {/* 欄位標籤與輸入框垂直排列容器 */}
      <span className="text-[11.5px] font-semibold text-ink-soft">{label}</span> {/* 顯示欄位名稱 */}
      <input
        type="text" // 文字輸入框類型
        defaultValue={value} // 預設值來自傳入的 value
        readOnly // 設為唯讀，使用者無法編輯
        className="rounded-lg border border-line bg-paper px-3 py-2 text-[13px]" // 輸入框樣式
      />
    </label>
  );
}
