import { HeroImages } from "./lndpg-hero-images";
import { HeroText } from "./lndpg-hero-text";

export function LPHero() {
  return (
    <section className="relative bg-[#444E36] min-h-[700px] flex justify-center text-center">
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <HeroImages />
      </div>

      <div className="relative z-10 items-start pt-[175px] text-[#F4F8CC]">
        <HeroText />
      </div>

    </section>
  );
}