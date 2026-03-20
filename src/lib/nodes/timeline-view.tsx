
import { NodeViewWrapper, NodeViewProps, NodeViewContent } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  Ellipsis,
  Plus,
  Trash2,
  LayoutGrid,
  LayoutList,
  List,
  ListOrdered,
  GripVertical,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { cn } from "../utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const TimelineView = ({
  node,
  getPos,
  editor,
  selected,
}: NodeViewProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const direction = node.attrs.direction || "vertical";
  const showNumbers = node.attrs.showNumbers;

  const deleteTimeline = () => {
    const pos = getPos();
    editor
      .chain()
      .focus()
      .deleteRange({ from: pos, to: pos + node.nodeSize })
      .run();
  };

  const toggleDirection = () => {
    const pos = getPos();
    editor
      .chain()
      .focus()
      .command(({ tr }) => {
        tr.setNodeAttribute(
          pos,
          "direction",
          direction === "vertical" ? "horizontal" : "vertical"
        );
        return true;
      })
      .run();
  };

  const toggleShowNumbers = () => {
    const pos = getPos();
    editor
      .chain()
      .focus()
      .command(({ tr }) => {
        tr.setNodeAttribute(pos, "showNumbers", !showNumbers);
        return true;
      })
      .run();
  };

  const addTimelineItem = () => {
    const pos = getPos();
    const nodeSize = node.nodeSize;

    const index = node.content.size;

    editor.commands.insertContentAt(pos + nodeSize - 1, {
      type: "timelineItem",
      attrs: {
        index,
        title: "Заголовок",
        content: "Описание",
      },
    });
  };

  return (
    <NodeViewWrapper
      data-type="timeline"
      data-direction={direction}
      data-show-numbers={showNumbers}
      className={cn(
        "relative group/timeline hover:outline outline-1 hover:outline-border rounded-md",
        isFocused || selected
          ? "outline outline-primary outline-2 hover:outline-primary"
          : ""
      )}
    >
      <div
        className={cn(
          "absolute top-[-0.75em] left-[50%] -translate-x-[50%] opacity-0 group-hover/timeline:opacity-100",
          (isFocused || selected) && "opacity-100"
        )}
        contentEditable={false}
      >
        <Popover onOpenChange={(state) => setIsFocused(state)}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "px-2 py-0.5 w-auto h-auto rounded-sm text-primary transition-none flex items-center gap-1.5",
                isFocused || selected
                  ? "bg-muted hover:bg-muted border-primary text-primary hover:text-primary outline-primary outline-2"
                  : ""
              )}
            >
              <Ellipsis className="size-4" strokeWidth={1.5} />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" sideOffset={5} className="w-auto p-0.5">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={addTimelineItem}>
                <Plus className="size-4" strokeWidth={1.5} />
              </Button>

              <Button variant="ghost" size="icon" onClick={toggleDirection}>
                {direction === "vertical" ? (
                  <LayoutGrid className="size-4" strokeWidth={1.5} />
                ) : (
                  <LayoutList className="size-4" strokeWidth={1.5} />
                )}
              </Button>

              <Button variant="ghost" size="icon" onClick={toggleShowNumbers}>
                {node.attrs.showNumbers ? (
                  <ListOrdered className="size-4" strokeWidth={1.5} />
                ) : (
                  <List className="size-4" strokeWidth={1.5} />
                )}
              </Button>

              <Separator orientation="vertical" className="h-4" />

              <Button variant="ghost" size="icon" onClick={deleteTimeline}>
                <Trash2 className="size-4" strokeWidth={1.5} />
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div
        contentEditable={false}
        draggable
        data-drag-handle
        className="absolute top-0 left-0 -translate-x-full opacity-0 group-hover/timeline:opacity-100 bg-background rounded-sm border border-border cursor-grab active:cursor-grabbing px-0.5 py-1.5 -ml-2"
      >
        <GripVertical className="size-4" strokeWidth={1} />
      </div>

      <NodeViewContent
        className={cn(
          "node-timeline-view pt-[1em] px-[1em] [&>*]:w-full",
          direction === "vertical"
            ? "[&>*]:flex [&>*]:flex-col"
            : "[&>*]:flex [&>*]:flex-row"
        )}
      />
    </NodeViewWrapper>
  );
};
