import HeroCarousel from "./HeroCarousel";
import Parallax from "./Parallax";
import { heroSlides } from "@/lib/content";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b-2 border-ink py-10 sm:py-14 lg:py-16">
      <Parallax
        speed={0.15}
        className="pointer-events-none absolute -left-4 -top-6 select-none lg:-top-10"
      >
        <span
          aria-hidden="true"
          className="block font-clock text-[9rem] leading-none text-ink/[0.06] sm:text-[13rem] lg:text-[16rem]"
        >
          0.03
        </span>
      </Parallax>

      <HeroCarousel slides={heroSlides} />
    </section>
  );
}
