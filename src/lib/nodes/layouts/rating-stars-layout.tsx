
import { Star } from "lucide-react";
import { memo } from "react";
import { EditableLayoutProps } from "@/types";

type RatingStarsLayoutProps = EditableLayoutProps;

export const RatingStarsLayout = memo(
  ({ value, onClick }: RatingStarsLayoutProps) => {
    return (
      <div
        contentEditable={false}
        className="flex items-center justify-center mb-[1.2em] cursor-pointer hover:opacity-80 transition-opacity relative"
        onClick={onClick}
      >
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              strokeWidth="0.05em"
              className={`size-[1.4em] ${
                star <= (value ? parseInt(value) : 3)
                  ? "text-[var(--slide-accent)] fill-[var(--slide-accent)]"
                  : "text-[var(--slide-foreground)] opacity-50"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }
);

RatingStarsLayout.displayName = "RatingStarsLayout";
