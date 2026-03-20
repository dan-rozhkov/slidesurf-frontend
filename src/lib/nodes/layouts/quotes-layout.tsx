
import { memo } from "react";
import { Quote } from "lucide-react";

export const QuotesLayout = memo(() => {
  return (
    <div contentEditable={false}>
      {/* Top-left quote */}
      <span className="absolute top-[0.4em] left-[0.4em] font-bold text-[var(--slide-accent)] leading-none transform rotate-180">
        <Quote className="size-[1.2em]" />
      </span>

      {/* Bottom-right quote */}
      <span className="absolute bottom-[0.4em] right-[0.4em] font-bold text-[var(--slide-accent)] leading-none">
        <Quote className="size-[1.2em]" />
      </span>
    </div>
  );
});

QuotesLayout.displayName = "QuotesLayout";
