import PhotoTile from "./PhotoTile"; // 匯入照片方塊元件
import ParallaxImage from "./ParallaxImage"; // 匯入視差捲動圖片元件
import Eyebrow from "./Eyebrow"; // 匯入小標籤元件

export default function FeaturedSpread() { // 定義「精選報導」跨欄元件並預設匯出
  return ( // 回傳這個元件要渲染的畫面
    <section className="border-y-2 border-ink bg-paper-3"> {/* 區塊外框：上下有邊框、底色為 paper-3 */}
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_1.15fr] lg:gap-14"> {/* 置中格線容器，桌機切成左右兩欄 */}
        <div className="aspect-[4/3]"> {/* 左側圖片容器，維持 4:3 比例 */}
          <ParallaxImage speed={0.5}> {/* 視差捲動效果，速度設為 0.5 */}
            <PhotoTile
              src="/images/track-01-sprint-start.jpg" // 圖片來源路徑
              alt="夕陽餘光灑落在田徑跑道的彎道上" // 圖片替代文字，供無障礙閱讀
            />
          </ParallaxImage> {/* 結束視差圖片區塊 */}
        </div> {/* 結束左側圖片容器 */}
        <div> {/* 右側文字內容容器 */}
          <Eyebrow tone="gold">精選報導</Eyebrow> {/* 顯示金色小標籤文字 */}
          <h3 className="mt-4 max-w-[18ch] font-display text-[1.6rem] font-bold italic leading-snug sm:text-[2rem] lg:text-[2.3rem]"> {/* 主標題樣式 */}
            「跑道有多長,青春就有多長」 {/* 報導主標題文字 */}
          </h3>
          <p className="mt-5 max-w-[48ch] text-[1.05rem] leading-relaxed text-ink-soft"> {/* 內文段落樣式 */}
            她說,這是高中生涯的最後一次上場。決賽那天沒有拿到名次,但助跑最後一步、擲出標槍的那個瞬間,我們的快門停在她眼神最專注的
            0.008 秒。有些照片不是為了紀錄名次,而是為了留住一個人曾經那麼用力活過的證據。 {/* 內文描述文字 */}
          </p>
          <p className="mt-5 font-clock text-[0.9rem] tracking-widest text-muted"> {/* 底部資訊列樣式，使用等寬字體 */}
            田徑 / 標槍 / 桃園青埔田徑場 / 2026.03.29 {/* 賽事類別、地點與日期資訊 */}
          </p>
        </div> {/* 結束右側文字內容容器 */}
      </div> {/* 結束格線容器 */}
    </section> // 結束整個精選報導區塊
  );
}
