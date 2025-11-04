import { Button } from "@/components/ui/button";
import ButtonDown from "@/assets/LandingPage/chevron-down.svg";
import ButtonUp from "@/assets/LandingPage/chevron-up.svg";

const sections = ["hero", "guides", "diary", "market"];

export function BottomButton({ activeSection }: { activeSection: string }) {
  const currentIndex = sections.indexOf(activeSection);
  const isLastSection = currentIndex === sections.length - 1;

  const scrollToNextSection = () => {
    if (!isLastSection) {
      const nextSection = document.getElementById(sections[currentIndex + 1]);
      nextSection?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <Button
        onClick={
          isLastSection
            ? () => window.scrollTo({ top: 0, behavior: "smooth" })
            : scrollToNextSection
        }
        className="w-[60px] h-[60px] bg-black rounded-[16px]
                   flex items-center justify-center
                   p-0 hover:bg-neutral-800 transition"
      >
        <img
          src={isLastSection ? ButtonUp : ButtonDown}
          className="w-[24px] h-[24px]"
        />
      </Button>
    </div>
  );
}
