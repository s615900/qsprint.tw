import Image from "next/image"; // 匯入 Next.js 優化過的圖片元件
import Link from "next/link"; // 匯入 Next.js 的客戶端導覽連結元件
import { navLinks, contactInfo } from "@/lib/content"; // 匯入導覽連結與聯絡資訊的靜態資料
import SocialLinks from "./SocialLinks"; // 匯入社群連結元件

export default function SiteFooter() { // 匯出網站頁尾元件
  return ( // 回傳頁尾的畫面結構
    <footer className="bg-paper-2"> {/* 頁尾最外層容器，套用背景色 */}
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 sm:py-14 md:grid-cols-[1.3fr_0.8fr_1fr]"> {/* 三欄格線排版容器 */}
        <div> {/* 第一欄：品牌識別、簡介與社群連結 */}
          <Link href="/" className="flex items-center gap-3 no-underline"> {/* 點擊回首頁的連結，包住 logo 與站名 */}
            <Image
              src="/images/qsprint-icon-v2.png" // 圖片來源路徑
              alt="" // 裝飾性圖片，不需要替代文字
              width={468} // 原始圖片寬度(用於計算比例)
              height={341} // 原始圖片高度(用於計算比例)
              className="h-12 w-auto flex-none" // 顯示樣式，固定高度、寬度依比例縮放
            />
            <span className="leading-tight"> {/* 站名文字容器 */}
              <span className="block font-display text-[1.1rem] font-bold tracking-wide"> {/* 中文站名樣式 */}
                青春止秒 {/* 中文站名 */}
              </span>
              <span className="mt-0.5 block text-[0.62rem] tracking-[0.16em] text-muted"> {/* 英文標語樣式 */}
                TIME STOPS AT YOUTH {/* 英文標語文字 */}
              </span>
            </span>
          </Link>
          <p className="mt-4 max-w-[36ch] text-[0.86rem] text-ink-soft"> {/* 品牌簡介文字樣式 */}
            專注在校園與業餘田徑賽事的紀錄團隊,用鏡頭留住跑道上用盡全力的每一秒。 {/* 品牌簡介內容 */}
          </p>
          <SocialLinks className="mt-5" /> {/* 渲染社群連結列表 */}
        </div>

        <div> {/* 第二欄：快速連結 */}
          <h3 className="font-clock text-[0.9rem] tracking-[0.15em] text-muted"> {/* 欄位標題樣式 */}
            快速連結 {/* 欄位標題文字 */}
          </h3>
          <ul className="mt-4 space-y-2.5 text-[0.88rem]"> {/* 連結清單容器 */}
            {navLinks.map((link) => ( // 走訪導覽連結陣列，為每個連結渲染一個項目
              <li key={link.href}> {/* 以連結網址作為 key */}
                <Link href={link.href} className="text-ink-soft no-underline hover:text-coral"> {/* 導覽連結，含 hover 顏色變化 */}
                  {link.label} {/* 連結顯示文字 */}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div> {/* 第三欄：聯絡資訊 */}
          <h3 className="font-clock text-[0.9rem] tracking-[0.15em] text-muted"> {/* 欄位標題樣式 */}
            聯絡資訊 {/* 欄位標題文字 */}
          </h3>
          <ul className="mt-4 space-y-2.5 text-[0.88rem]"> {/* 聯絡資訊清單容器 */}
            {contactInfo.map((item) => ( // 走訪聯絡資訊陣列，為每一項渲染一列
              <li key={item.label} className="flex flex-col"> {/* 以標籤文字作為 key，直排顯示 */}
                <span className="text-[0.72rem] text-muted">{item.label}</span> {/* 顯示欄位名稱(如 Email) */}
                {item.href ? ( // 若此項目有提供連結網址
                  <a href={item.href} className="text-ink-soft no-underline hover:text-coral"> {/* 可點擊的聯絡方式連結 */}
                    {item.value} {/* 顯示聯絡方式的值 */}
                  </a>
                ) : ( // 若沒有提供連結網址
                  <span className="text-ink-soft">{item.value}</span> // 純文字顯示聯絡方式的值
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line"> {/* 版權列容器，上方加一條分隔線 */}
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-5 py-5 text-[0.76rem] text-muted sm:px-8"> {/* 版權文字排版容器 */}
          <span>© 2026 青春止秒攝影 TIME STOPS AT YOUTH</span> {/* 版權聲明文字 */}
          <span>此為網站改版示範・版型可依實際內容替換文字與照片</span> {/* 免責/說明文字 */}
        </div>
      </div>
    </footer>
  );
}
