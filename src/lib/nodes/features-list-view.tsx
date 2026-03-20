
import { NodeViewWrapper, NodeViewProps, NodeViewContent } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Ellipsis, Plus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { cn } from "../utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const FeaturesListView = ({
  node,
  getPos,
  editor,
  selected,
}: NodeViewProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const deleteFeaturesList = () => {
    const pos = getPos();
    editor
      .chain()
      .focus()
      .deleteRange({ from: pos, to: pos + node.nodeSize })
      .run();
  };

  const addFeature = () => {
    const pos = getPos();
    const nodeSize = node.nodeSize;

    const index = node.content.size;

    editor.commands.insertContentAt(pos + nodeSize - 1, {
      type: "feature",
      attrs: {
        index,
        title: "Заголовок",
        content: "Описание",
      },
    });
  };

  return (
    <NodeViewWrapper
      data-type="features-list"
      className={cn(
        "relative group/features-list",
        isFocused || selected
          ? "outline outline-primary outline-2 hover:outline-primary"
          : ""
      )}
    >
      <div
        className={cn(
          "absolute top-[-0.75em] left-[50%] -translate-x-[50%] opacity-0 group-hover/features-list:opacity-100",
          isFocused || (selected && "opacity-100")
        )}
      >
        <Popover onOpenChange={(state) => setIsFocused(state)}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "px-2 py-0.5 w-auto h-auto rounded-sm text-primary transition-none",
                isFocused ||
                  (selected &&
                    "bg-muted hover:bg-muted border-primary text-primary hover:text-primary outline-primary outline-2")
              )}
            >
              <Ellipsis className="size-4" strokeWidth={1.5} />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" sideOffset={5} className="w-auto p-0.5">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={addFeature}>
                <Plus className="size-4" strokeWidth={1.5} />
              </Button>

              <Separator orientation="vertical" className="h-4" />

              <Button variant="ghost" size="icon" onClick={deleteFeaturesList}>
                <Trash2 className="size-4" strokeWidth={1.5} />
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <NodeViewContent className="node-features-list-view [&>*]:grid [&>*]:grid-cols-2 [&>*]:gap-[2em] [&>*]:user-select-none [&>*]:p-[1em]" />
    </NodeViewWrapper>
  );
};
