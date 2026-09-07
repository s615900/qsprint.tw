import PhotoTile from "./PhotoTile";
import ParallaxImage from "./ParallaxImage";
import { stats } from "@/lib/content";

export default function AboutSection() {
  return (
    <section>
      <div
        id="about"
        className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14"
      >
        <div className="aspect-[4/5]">
          <ParallaxImage speed={0.5}>
            <PhotoTile
              src="/images/track-04-stadium.jpg"
              alt="田徑場跑道上的 4x100 與 4x400 接力交接區標線"
            />
          </ParallaxImage>
        </div>
        <div>
          <h2 className="font-display text-[1.8rem] font-bold sm:text-[2.1rem] lg:text-[2.4rem]">
            關於青春止秒
          </h2>
          <p className="my-4 max-w-[30ch] font-display text-[1.15rem] font-semibold italic text-gold">
            如果青春會老,那就讓它在跑道上「止秒」。
          </p>
          <p className="mb-3.5 max-w-[58ch] text-ink-soft">
            青春止秒成立於 2019
            年,是一支專注在校園與業餘田徑賽事的紀錄團隊。我們相信,比賽場上的青春只有一次,但影像可以讓那一秒鐘停下來——不管是起跑、交棒、跨欄,還是終點線前用盡全力的表情。
          </p>
          <p className="max-w-[58ch] text-ink-soft">
            我們的鏡頭跟著選手跑遍全台的田徑場,從縣市運動會到全國賽,從清晨的暖身到深夜的成績公告,我們在場邊蹲點,只為了不錯過那決定性的
            0.01 秒。
          </p>
        </div>
      </div>

      <div className="border-y-2 border-ink bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-paper/15 px-5 sm:px-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="px-4 py-8 text-center first:pl-0 sm:text-left">
              <b className="block font-clock text-[2.4rem] leading-none tracking-wide sm:text-[3rem]">
                {stat.value}
              </b>
              <span className="mt-2 block text-[0.72rem] tracking-[0.15em] text-paper/60">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
