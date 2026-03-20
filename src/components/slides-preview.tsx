
import { memo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { usePresentationAtom } from "@/lib/hooks/use-presentation";
import { DraggableSlidePreview } from "./draggable-slide-preview";
import type { Modifier, DragEndEvent } from "@dnd-kit/core";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

import { useScopedI18n } from "@/lib/locales/client";
import { SlidePlaceholder as SlidePlaceholderType } from "@/types";
import { nanoid } from "@/lib/utils";

type SlidePreviewProps = {
  currentSlideId: string;
  onSlideSelect: (id: string) => void;
  setSlidePlaceholder: (placeholder: SlidePlaceholderType | null) => void;
};

const SlidesPreview = ({
  currentSlideId,
  onSlideSelect,
  setSlidePlaceholder,
}: SlidePreviewProps) => {
  const t = useScopedI18n("editor");
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [presentationAtom, setPresentationAtom] = usePresentationAtom();

  const restrictToVerticalAxis: Modifier = ({ transform }) => {
    return {
      ...transform,
      x: 0,
    };
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = presentationAtom.slides.findIndex(
        (slide) => slide.id === active.id
      );
      const newIndex = presentationAtom.slides.findIndex(
        (slide) => slide.id === over?.id
      );

      setPresentationAtom({
        ...presentationAtom,
        slides: arrayMove(presentationAtom.slides, oldIndex, newIndex),
      });
    }
  }

  return (
    <div className="w-60 overflow-y-auto pt-2 p-4 shrink-0 flex flex-col">
      <Button
        variant="outline"
        size="sm"
        className="w-full shrink-0 mb-3 font-normal max-w-[193px]"
        onClick={() => {
          setSlidePlaceholder({
            id: nanoid(),
            type: "placeholder",
            afterSlideId:
              presentationAtom.slides[presentationAtom.slides.length - 1]?.id ||
              "",
          });
        }}
      >
        <Plus className="size-4" strokeWidth={1.5} />
        {t("addSlide")}
      </Button>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={presentationAtom.slides.map((slide) => slide.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4" style={{ fontSize: "0.2em" }}>
            {presentationAtom.slides.map((slide, index) => (
              <DraggableSlidePreview
                key={slide.id}
                slide={slide}
                index={index}
                onSlideSelect={onSlideSelect}
                currentSlideId={currentSlideId}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default memo(SlidesPreview);
