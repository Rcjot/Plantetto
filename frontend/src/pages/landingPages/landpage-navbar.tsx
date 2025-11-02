import WebsiteName from "@/assets/LandingPage/Plantetto-logo.svg";
import { Button } from "@/components/ui/button";

type Section = "hero" | "guides" | "diary" | "market";

export function NavBar({ active }: { active: Section }) {
  const themes = {
    hero: { color1: "#FAFE90", color2: "#444E36" },
    guides: { color1: "#444E36", color2: "#9fb891" },
    diary: { color1: "#5A3E2F", color2: "#FFDFB1" },
    market: { color1: "#F4F8CC", color2: "#D25B2C" },
  };

  const { color1, color2 } = themes[active];

  return (
    <div
      className="fixed top-0 left-0 w-full z-50 bg-transparent transition duration-500"
      style={{ 
        // ✅ Only place where styles allowed: setting CSS variables for Tailwind use
        ["--color1" as any]: color1,
        ["--color2" as any]: color2 
      }}
    >
      <div className="flex flex-row justify-between items-center py-[10px]">
        
        <div className="text-[var(--color1)]">
          <img className="px-[60px]" src={WebsiteName}/>
        </div>

        <div className="flex flex-row gap-[20px] mx-[40px]">

          <Button
            variant="link"
            className="text-[24px] text-[var(--color1)] hover:text-[var(--color1)] px-5 py-5 transition"
          >
            About
          </Button>

          <Button
            className="text-[24px] text-[var(--color2)] bg-[var(--color1)] rounded-[10px] border border-[2px] border-[var(--color1)] px-4 py-5 transition 
                       hover:bg-[var(--color2)] hover:text-[var(--color1)] hover:border-[var(--color1)]"
          >
            Log In
          </Button>

          <Button
            className="text-[24px] text-[var(--color1)] bg-[var(--color2)] rounded-[10px] px-4 py-5 transition
                       border border-[2px] border-[var(--color1)]
                       hover:bg-[var(--color1)] hover:text-[var(--color2)]"
          >
            Sign Up
          </Button>

        </div>
      </div>
    </div>
  );
}
