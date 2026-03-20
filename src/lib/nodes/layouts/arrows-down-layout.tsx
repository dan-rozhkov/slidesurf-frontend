
import { memo } from "react";
import { BaseLayoutProps } from "@/types";

type ArrowsDownLayoutProps = BaseLayoutProps;

export const ArrowsDownLayout = memo(({ index }: ArrowsDownLayoutProps) => {
  return (
    <div
      contentEditable={false}
      className="flex items-center justify-center w-[5em] min-h-[5em] arrow-down-bg font-semibold text-[var(--slide-card-foreground)] shrink-0 font-[family-name:var(--slide-font-family)]"
      style={{
        background: `var(--slide-smart-layout-color-${index - 1})`,
        border: `1px solid var(--slide-smart-layout-border-color)`,
      }}
    >
      {index}
    </div>
  );
});

ArrowsDownLayout.displayName = "ArrowsDownLayout";
