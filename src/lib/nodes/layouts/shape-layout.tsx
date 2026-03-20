
import { CSSProperties } from "react";
import { memo } from "react";
import { ShapeLayoutProps } from "@/types";

export const ShapeLayout = memo(
  ({ index, totalItems, variant }: ShapeLayoutProps) => {
    const getShapeStyle = (): CSSProperties => {
      const funnelTopWidth = variant === "pyramid" ? 30 : 100; // %
      const funnelBottomWidth = variant === "pyramid" ? 100 : 30; // %

      const widthStep = (funnelTopWidth - funnelBottomWidth) / totalItems;

      const topW = funnelTopWidth - (index - 1) * widthStep;
      const bottomW = funnelTopWidth - index * widthStep;

      const topOffset = (100 - topW) / 2;
      const bottomOffset = (100 - bottomW) / 2;

      const clipPath = `polygon(${topOffset}% 0, ${100 - topOffset}% 0, ${
        100 - bottomOffset
      }% 100%, ${bottomOffset}% 100%)`;

      return {
        clipPath,
        background: `var(--slide-smart-layout-color-${index - 1})`,
        border: `1px solid var(--slide-smart-layout-border-color)`,
      };
    };

    return (
      <div
        key={index}
        contentEditable={false}
        className="flex items-center justify-center w-[14em] min-h-[5em] bg-[var(--slide-card-background)] font-semibold text-[var(--slide-card-foreground)] shrink-0 font-[family-name:var(--slide-font-family-header)]"
        style={getShapeStyle()}
      >
        {index}
      </div>
    );
  }
);

ShapeLayout.displayName = "ShapeLayout";
