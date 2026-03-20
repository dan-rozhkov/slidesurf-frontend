
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Modifier, DragEndEvent } from "@dnd-kit/core";
import DraggableSlideSection from "@/components/draggable-slide-section";
import { Section } from "@/types";
import { useCallback } from "react";
import { useScopedI18n } from "@/lib/locales/client";

type SectionsListProps = {
  sections: Section[];
  onReorder: (oldIndex: number, newIndex: number) => void;
  onUpdate: (index: number, updates: Partial<Section>) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
  getSlideCopy: (num: number) => string;
};

export function SectionsList({
  sections,
  onReorder,
  onUpdate,
  onRemove,
  onAdd,
  getSlideCopy,
}: SectionsListProps) {
  const t = useScopedI18n("generate");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const restrictToVerticalAxis: Modifier = ({ transform }) => ({
    ...transform,
    x: 0,
  });

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(oldIndex, newIndex);
      }
    },
    [sections, onReorder]
  );

  if (sections.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 bg-background rounded-lg p-4 mx-auto max-w-2xl w-full">
      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">{t("plan")}</p>
        <p className="text-sm text-muted-foreground">
          {getSlideCopy(sections.length)}
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {sections.map((section, index) => (
              <DraggableSlideSection
                key={section.id}
                index={index}
                section={section}
                handleDeleteSection={onRemove}
                handleUpdateSection={onUpdate}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={onAdd}
      >
        <Plus className="size-4" strokeWidth={1.5} />
        {t("addSlide")}
      </Button>
    </div>
  );
}
