
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { EditableText } from "./ui/editable-text";
import { Section } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  index: number;
  section: Section;
  handleDeleteSection: (index: number) => void;
  handleUpdateSection: (index: number, updates: Partial<Section>) => void;
};

export default function DraggableSlideSection({
  index,
  section,
  handleDeleteSection,
  handleUpdateSection,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleKeyPointChange = (pointIndex: number, newValue: string) => {
    const newKeyPoints = [...(section.keyPoints || [])];
    newKeyPoints[pointIndex] = newValue;
    handleUpdateSection(index, { keyPoints: newKeyPoints });
  };

  return (
    <div ref={setNodeRef} {...attributes} key={section.id} style={style}>
      <div className="relative bg-background rounded-md border border-border shadow-sm flex items-center gap-4 group">
        <span
          {...listeners}
          className="text-muted-foreground text-sm bg-muted w-16 items-center justify-start px-2 flex shrink-0 cursor-move self-stretch"
        >
          <GripVertical
            className="size-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity"
            strokeWidth={1.5}
          />
          {index + 1}
        </span>
        <div className="flex flex-col w-full py-3 gap-2">
          <EditableText
            value={section.title}
            onChange={(title) => handleUpdateSection(index, { title })}
            className="text-sm font-semibold"
          />
          {section.keyPoints && section.keyPoints.length > 0 && (
            <div className="flex flex-col gap-1">
              {section.keyPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-2 h-px mt-2.5 bg-muted-foreground/40 shrink-0" />
                  <EditableText
                    value={point}
                    onChange={(newValue) => handleKeyPointChange(i, newValue)}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="p-2 size-8 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSection(index);
            }}
          >
            <Trash2 className="size-4" strokeWidth={1.5} />
          </Button>
        </div>
      </div>
    </div>
  );
}
