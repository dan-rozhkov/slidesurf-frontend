import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import { cn } from "../utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Ellipsis, Copy, Trash2, Plus, GripVertical } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useNodeHasFocus } from "@/lib/hooks/use-node-has-focus";

export const TableView = ({ editor, getPos, node }: NodeViewProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasFocus = useNodeHasFocus(editor, getPos, node.nodeSize);

  const addColumnAtRight = () => {
    editor.chain().focus().setNodeSelection(getPos()).run();
    editor.chain().focus().addColumnAfter().run();
  };

  const addRowAtBottom = () => {
    editor.chain().focus().setNodeSelection(getPos()).run();
    editor.chain().focus().addRowAfter().run();
  };

  const deleteTable = () => {
    const pos = getPos();
    editor
      .chain()
      .focus()
      .deleteRange({ from: pos, to: pos + node.nodeSize })
      .run();
  };

  const cloneTable = () => {
    const pos = getPos();
    const table = node.toJSON();

    editor.commands.insertContentAt(pos + node.nodeSize, {
      type: "table",
      content: table.content,
    });
  };

  return (
    <NodeViewWrapper
      data-type="table"
      className={cn(
        "relative group/table",
        hasFocus && "outline outline-border",
        isFocused && "outline outline-primary outline-2 hover:outline-primary"
      )}
    >
      <div className={cn("absolute opacity-0 group-hover/table:opacity-100 right-0 top-0 bottom-0 translate-x-full z-[2]", hasFocus && "opacity-100")}>
        <Button
          variant="outline"
          size="icon"
          className="rounded-sm p-0 w-7 h-full shadow-sm ml-0.5"
          onClick={addColumnAtRight}
        >
          <Plus className="size-4" strokeWidth={1.5} />
        </Button>
      </div>

      <div className={cn("absolute opacity-0 group-hover/table:opacity-100 left-0 bottom-0 right-0 translate-y-full z-[2]", hasFocus && "opacity-100")}>
        <Button
          variant="outline"
          size="icon"
          className="rounded-sm p-0 w-full h-7 shadow-sm"
          onClick={addRowAtBottom}
        >
          <Plus className="size-4" strokeWidth={1.5} />
        </Button>
      </div>

      <div
        className={cn(
          "absolute top-[-0.75em] left-[50%] -translate-x-[50%] opacity-0 group-hover/table:opacity-100",
          (isFocused || hasFocus) && "opacity-100"
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
              <Button variant="ghost" size="icon" onClick={cloneTable}>
                <Copy className="size-4" strokeWidth={1.5} />
              </Button>

              <Separator orientation="vertical" className="h-4" />

              <Button variant="ghost" size="icon" onClick={deleteTable}>
                <Trash2 className="size-4" strokeWidth={1.5} />
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <NodeViewContent as="table" />

      <div
        contentEditable={false}
        draggable
        data-drag-handle
        className={cn("absolute top-0 left-0 -translate-x-full opacity-0 group-hover/table:opacity-100 bg-background rounded-sm border border-border cursor-grab active:cursor-grabbing px-0.5 py-1.5 -ml-2", hasFocus && "opacity-100")}
      >
        <GripVertical className="size-4" strokeWidth={1} />
      </div>
    </NodeViewWrapper>
  );
};
