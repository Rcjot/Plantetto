import { Button } from "@/components/ui/button";
import ButtonImage from "@/assets/LandingPage/chevron-down.svg";

const sections = ["hero", "guides", "diary", "market"];

export function BottomButton({ activeSection }: { activeSection: string }) {
  const scrollToNextSection = () => {
    const currentIndex = sections.indexOf(activeSection);
    const nextIndex = currentIndex + 1;

    if (nextIndex < sections.length) {
      const nextSection = document.getElementById(sections[nextIndex]);
      nextSection?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <Button
        onClick={scrollToNextSection}
        className="w-[60px] h-[60px] bg-black rounded-[16px]
                   flex items-center justify-center
                   p-0 hover:bg-neutral-800 transition"
      >
        <img src={ButtonImage} className="w-[24px] h-[24px]" />
      </Button>
    </div>
  );
}
