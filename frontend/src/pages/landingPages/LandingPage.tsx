import { useState, useRef, useEffect } from "react";
import { LPHero } from "./Hero/landpage-hero";
import { LPGuides } from "./Guides/landpage-guides"
import { LPDiary2 } from "./Diary/landpage-diary";
import { LPMarket } from "./Market/landpage-market";
import { NavBar } from "./landpage-navbar";
import { BottomButton } from "./landpage-bottombutton";

export function LandingPage() {
  const [activeSection, setActiveSection] = useState<"hero" | "guides" | "diary" | "market">("hero");

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
      { threshold: 0.4 }
    );

    sections.forEach(({ ref }) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col">
      <NavBar active={activeSection} />
      <BottomButton activeSection={activeSection} />


      <div ref={heroRef} id="hero" className="min-h-screen"><LPHero /></div>
      <div ref={guidesRef} id="guides" className="min-h-screen"><LPGuides /></div>
      <div ref={diaryRef} id="diary" className="min-h-screen"><LPDiary2 /></div>
      <div ref={marketRef} id="market" className="min-h-screen"><LPMarket /></div>
    </div>
  );
}

export default LandingPage;
