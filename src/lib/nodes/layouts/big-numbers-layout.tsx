
import { memo } from "react";
import { EditableLayoutProps } from "@/types";

type BigNumbersLayoutProps = EditableLayoutProps;

export const BigNumbersLayout = memo(
  ({ value, onClick }: BigNumbersLayoutProps) => {
    return (
      <div
        contentEditable={false}
        className="flex items-center justify-start mb-[0.5em] cursor-pointer hover:opacity-80 transition-opacity relative"
        onClick={onClick}
      >
        <span className="text-[3em] font-bold text-[var(--slide-accent)] font-[family-name:var(--slide-font-family-header)]">
          {value ? value : "100"}
        </span>
      </div>
    );
  }
);

BigNumbersLayout.displayName = "BigNumbersLayout";
