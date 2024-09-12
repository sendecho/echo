import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";

export async function AnimatedGradientBadge() {
  return (
    <AnimatedGradientText className="mx-0">
      <span>🎉{" "}</span>
      <span
        className={cn(
          `ml-2 inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
        )}
      >
        Introducing Echo
      </span>
    </AnimatedGradientText>
  );
}
