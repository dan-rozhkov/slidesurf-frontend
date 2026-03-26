
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { TimelineItemAttributes } from "./timeline-item";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ellipsis, Trash2, SquarePen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const TimelineItemView = ({
  node,
  getPos,
  editor,
  deleteNode,
  updateAttributes,
}: NodeViewProps) => {
  const attrs = node.attrs as TimelineItemAttributes;
  const [isFocused, setIsFocused] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [title, setTitle] = useState(attrs.title);
  const [content, setContent] = useState(attrs.content);

  // Получаем родительскую ноду через editor state
  const pos = getPos();
  const parentNode =
    typeof pos === "number" ? editor.state.doc.resolve(pos).parent : null;

  // Определяем порядковый номер текущей timeline item
  let itemIndex = 1;
  if (typeof pos === "number" && parentNode) {
    const resolvedPos = editor.state.doc.resolve(pos);
    const parentPos = resolvedPos.before();
    const parentNode = editor.state.doc.nodeAt(parentPos);

    if (parentNode) {
      // Находим индекс текущей ноды среди дочерних элементов родителя
      let index = 0;
      parentNode.forEach((child) => {
        if (child === node) {
          itemIndex = index + 1;
        }
        index++;
      });
    }
  }

  const handleSave = () => {
    updateAttributes({
      title,
      content,
    });
    setIsEditDialogOpen(false);
  };

  return (
    <NodeViewWrapper
      className={cn(
        "group/timeline-item relative w-full",
        isFocused && "outline outline-primary outline-2 hover:outline-primary"
      )}
    >
      <div
        className={cn(
          "absolute top-[-1rem] left-[50%] -translate-x-[50%] opacity-0 group-hover/timeline-item:opacity-100",
          isFocused && "opacity-100"
        )}
      >
        <Popover onOpenChange={(state) => setIsFocused(state)}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "px-2 py-0.5 w-auto h-auto rounded-sm text-primary transition-none",
                isFocused &&
                  "bg-muted hover:bg-muted border-primary text-primary hover:text-primary outline-primary outline-2"
              )}
            >
              <Ellipsis className="size-4" strokeWidth={1.5} />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" sideOffset={5} className="w-auto p-0.5">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <SquarePen className="size-4" strokeWidth={1.5} />
              </Button>

              <Separator orientation="vertical" className="h-4" />

              <Button variant="ghost" size="icon" onClick={deleteNode}>
                <Trash2 className="size-4" strokeWidth={1.5} />
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div
        className="flex w-full relative group/timeline-item"
        contentEditable={false}
        onClick={() => setIsEditDialogOpen(true)}
      >
        <div
          data-timeline-item
          className={cn("flex w-full relative pb-[0.8em]")}
          style={{
            borderColor: "var(--slide-accent)",
          }}
        >
          <div
            className="relative flex items-start flex-1 gap-[4em]"
            data-timeline-item-wrapper
          >
            <div
              data-timeline-item-connector
              className="absolute top-[0.8em] left-[0.8em] w-[4em] border-t"
              style={{
                borderColor: "var(--slide-accent)",
              }}
            />
            <span
              data-timeline-item-number
              className="relative font-bold tracking-wide leading-none !m-0 inline-flex items-center size-[2em] justify-center rounded-md -left-[1em] shrink-0 font-[family-name:var(--slide-font-family)]"
              style={{
                fontSize: "0.8em",
                backgroundColor: "var(--slide-accent)",
                color: "white",
              }}
            >
              <span>{itemIndex}</span>
            </span>
            <div className="flex flex-col gap-0 pt-[0.2em] w-full">
              <h4 className="font-bold text-lg">{attrs.title}</h4>
              <p
                style={{
                  fontSize: "0.9em",
                  margin: 0,
                }}
              >
                {attrs.content}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать событие</DialogTitle>
            <DialogDescription>
              Измените заголовок и описание события
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Заголовок</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введите заголовок"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Описание</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Введите описание"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button onClick={handleSave}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </NodeViewWrapper>
  );
};
