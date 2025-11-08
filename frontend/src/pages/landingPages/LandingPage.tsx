import { useState, useRef, useEffect } from "react";
import { LPHero } from "./Hero/landpage-hero";
import { LPGuides } from "./Guides/landpage-guides"
import { LPDiary2 } from "./Diary/landpage-diary";
import { LPMarket } from "./Market/landpage-market";
import { NavBar } from "./landpage-navbar";
import { BottomButton } from "./landpage-bottombutton";

export function LandingPage() {
  const [activeSection, setActiveSection] = useState<"hero" | "guides" | "diary" | "market">("hero");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const guidesRef = useRef<HTMLDivElement>(null);
  const diaryRef = useRef<HTMLDivElement>(null);
  const marketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = [
      { id: "hero", ref: heroRef },
      { id: "guides", ref: guidesRef },
      { id: "diary", ref: diaryRef },
      { id: "market", ref: marketRef },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as typeof activeSection);
          }
        });
      },
      { threshold: 0.4, root: scrollContainerRef.current ?? undefined }
    );

    sections.forEach(({ ref }) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className="flex flex-col snap-y snap-mandatory h-screen overflow-y-auto"
    >
      <NavBar active={activeSection} />
      <BottomButton
        activeSection={activeSection}
        scrollContainer={scrollContainerRef}
      />

      <div className="snap-center"><div ref={heroRef} id="hero" className="min-h-screen"><LPHero /></div></div>
      <div className="snap-center"><div ref={guidesRef} id="guides" className="min-h-screen"><LPGuides /></div></div>
      <div className="snap-center"><div ref={diaryRef} id="diary" className="min-h-screen"><LPDiary2 /></div></div>
      <div className="snap-center"><div ref={marketRef} id="market" className="min-h-screen"><LPMarket /></div></div>
      
      
      
      
    </div>
  );
}

export default LandingPage;
