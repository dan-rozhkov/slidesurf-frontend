
import { memo } from "react";
import { BaseLayoutProps } from "@/types";

type ArrowsLayoutProps = BaseLayoutProps;

export const ArrowsLayout = memo(({ index }: ArrowsLayoutProps) => {
  return (
    <div
      contentEditable={false}
      className="flex items-center justify-center flex-grow h-[3em] mb-[0.5em] arrow-bg font-semibold text-[var(--slide-card-foreground)] font-[family-name:var(--slide-font-family)]"
      style={{
        background: `var(--slide-smart-layout-color-${index - 1})`,
        border: `1px solid var(--slide-smart-layout-border-color)`,
      }}
    >
      {index}
    </div>
  );
});

ArrowsLayout.displayName = "ArrowsLayout";
