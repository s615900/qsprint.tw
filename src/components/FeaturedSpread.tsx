import PhotoTile from "./PhotoTile";
import ParallaxImage from "./ParallaxImage";
import Eyebrow from "./Eyebrow";

export default function FeaturedSpread() {
  return (
    <section className="border-y-2 border-ink bg-paper-3">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
        <div className="aspect-[4/3]">
          <ParallaxImage speed={0.5}>
            <PhotoTile
              src="/images/track-01-sprint-start.jpg"
              alt="夕陽餘光灑落在田徑跑道的彎道上"
            />
          </ParallaxImage>
        </div>
        <div>
          <Eyebrow tone="gold">精選報導</Eyebrow>
          <h3 className="mt-4 max-w-[18ch] font-display text-[1.6rem] font-bold italic leading-snug sm:text-[2rem] lg:text-[2.3rem]">
            「跑道有多長,青春就有多長」
          </h3>
          <p className="mt-5 max-w-[48ch] text-[1.05rem] leading-relaxed text-ink-soft">
            她說,這是高中生涯的最後一次上場。決賽那天沒有拿到名次,但助跑最後一步、擲出標槍的那個瞬間,我們的快門停在她眼神最專注的
            0.008 秒。有些照片不是為了紀錄名次,而是為了留住一個人曾經那麼用力活過的證據。
          </p>
          <p className="mt-5 font-clock text-[0.9rem] tracking-widest text-muted">
            田徑 / 標槍 / 桃園青埔田徑場 / 2026.03.29
          </p>
        </div>
      </div>
    </section>
  );
}
