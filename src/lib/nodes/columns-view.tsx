
import { Button } from "@/components/ui/button";
import { Trash2, Ellipsis, Plus, Copy, GripVertical } from "lucide-react";
import { IconColumnInsertRight, IconColumnRemove } from "@tabler/icons-react";
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { WithTooltip } from "@/components/ui/with-tooltip";

export const ColumnsView = ({
  deleteNode,
  editor,
  getPos,
  node,
  selected,
}: NodeViewProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const countColumns = node.content.content.length;

  const addColumn = () => {
    const pos = getPos();
    const nodeSize = node.nodeSize;

    if (countColumns === 4) {
      return false;
    }

    editor.commands.insertContentAt(pos + nodeSize - 1, {
      type: "column",
      content: [
        {
          type: "paragraph",
        },
      ],
    });
  };

  const deleteColumn = () => {
    if (countColumns <= 1) {
      return false;
    }

    const pos = getPos();
    const lastColumn = node.content.content[countColumns - 1];
    const lastColumnPos = pos + node.nodeSize - lastColumn.nodeSize - 1;

    editor.commands.deleteRange({
      from: lastColumnPos,
      to: lastColumnPos + lastColumn.nodeSize,
    });
  };

  const cloneNode = () => {
    const pos = getPos();
    const nodeSize = node.nodeSize;
    const nodeJSON = node.toJSON();

    editor.commands.insertContentAt(pos + nodeSize, {
      type: "columns",
      content: nodeJSON.content,
    });
  };

  return (
    <NodeViewWrapper
      className={cn(
        "relative group/columns hover:outline outline-1 hover:outline-border rounded-md",
        isFocused || selected
          ? "outline outline-primary outline-2 hover:outline-primary"
          : ""
      )}
    >
      {countColumns < 4 && (
        <div
          className="absolute opacity-0 group-hover/columns:opacity-100 right-0 top-[50%] translate-x-1/2 -translate-y-1/2 z-[2]"
          contentEditable={false}
        >
          <Button
            variant="outline"
            size="icon"
            className="rounded-full p-0 size-7"
            onClick={addColumn}
          >
            <Plus className="size-4" strokeWidth={1.5} />
          </Button>
        </div>
      )}

      <div
        className={cn(
          "absolute top-[-0.75em] left-[50%] -translate-x-[50%] opacity-0 group-hover/columns:opacity-100 z-[2]",
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
                "px-2 py-0.5 w-auto h-auto rounded-sm text-primary transition-none",
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
              <WithTooltip
                side="bottom"
                display="Добавить колонку"
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={addColumn}
                    tabIndex={-1}
                  >
                    <IconColumnInsertRight
                      className="size-4"
                      strokeWidth={1.5}
                    />
                  </Button>
                }
                delayDuration={1000}
              />

              <WithTooltip
                side="bottom"
                display="Удалить колонку"
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={deleteColumn}
                    tabIndex={-1}
                  >
                    <IconColumnRemove className="size-4" strokeWidth={1.5} />
                  </Button>
                }
                delayDuration={1000}
              />

              <Separator orientation="vertical" className="h-4" />

              <Button variant="ghost" size="icon" onClick={cloneNode}>
                <Copy className="size-4" strokeWidth={1.5} />
              </Button>

              <Button variant="ghost" size="icon" onClick={deleteNode}>
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
        className="absolute top-0 left-0 -translate-x-full opacity-0 group-hover/columns:opacity-100 bg-background rounded-sm border border-border cursor-grab active:cursor-grabbing px-0.5 py-1.5 -ml-2"
      >
        <GripVertical className="size-4" strokeWidth={1} />
      </div>

      <NodeViewContent className="node-columns-view" />
    </NodeViewWrapper>
  );
};
