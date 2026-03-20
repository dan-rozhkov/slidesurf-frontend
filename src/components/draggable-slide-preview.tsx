
import { Slide as SlideType } from "@/types";
import SlideWrapper from "@/components/slide-wrapper";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Ellipsis, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePresentationAtom } from "@/lib/hooks/use-presentation";
import { nanoid } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/locales/client";
import { useTheme } from "@/lib/hooks/use-theme";

export const DraggableSlidePreview = ({
  slide,
  onSlideSelect,
  currentSlideId,
  index,
}: {
  slide: SlideType;
  index: number;
  onSlideSelect: (id: string) => void;
  currentSlideId: string;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: slide.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const [presentationAtom, setPresentationAtom] = usePresentationAtom();
  const t = useI18n();
  const { theme } = useTheme(presentationAtom?.themeId || null);

  const handleDeleteSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPresentationAtom({
      ...presentationAtom,
      slides: presentationAtom.slides.filter((s) => s.id !== slide.id),
    });
  };

  const handleDuplicateSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newSlide = {
      ...slide,
      id: nanoid(),
    };
    const slideIndex = presentationAtom.slides.findIndex(
      (s) => s.id === slide.id
    );
    const newSlides = [...presentationAtom.slides];
    newSlides.splice(slideIndex + 1, 0, newSlide);

    setPresentationAtom({
      ...presentationAtom,
      slides: newSlides,
    });
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "relative cursor-pointer rounded-md flex flex-col overflow-hidden group",
        currentSlideId === slide.id
          ? "ring-2 ring-primary"
          : "ring-1 ring-border"
      )}
      style={{
        ...style,
        width: "60em",
        height: "33.75em",
      }}
      onClick={() => onSlideSelect(slide.id)}
    >
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="size-6 rounded"
              onClick={(e) => e.stopPropagation()}
            >
              <Ellipsis className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={handleDuplicateSlide}>
              <Copy className="mr-2 h-4 w-4" />
              <span>{t("editor.copy")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteSlide}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>{t("editor.trash")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="pointer-events-none">
        <SlideWrapper
          slide={slide}
          onUpdate={() => {}}
          isActive={false}
          isEditable={false}
          isPresenting={true}
          ref={null}
          theme={theme}
        />
      </div>
      <div className="absolute bottom-2 right-2 z-10 bg-background/80 backdrop-blur-sm rounded-md px-2 py-1 text-xs font-medium text-foreground/70">
        {index + 1}
      </div>
    </div>
  );
};
