
import { Button } from "@/components/ui/button";
import { Trash2, Ellipsis, Copy, GripVertical } from "lucide-react";
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

export const CardView = ({
  deleteNode,
  updateAttributes,
  node,
  editor,
  getPos,
}: NodeViewProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const cloneNode = () => {
    const nodeJSON = node.toJSON();

    // First get to the card's parent (column)
    const pos = getPos();
    const $pos = editor.state.doc.resolve(pos);

    // Find the actual column node by checking each parent until we find type "column"
    let depth = $pos.depth;
    let columnNode = null;
    let columnDepth = 0;

    while (depth > 0) {
      const currentNode = $pos.node(depth);
      if (currentNode.type.name === "column") {
        columnNode = currentNode;
        columnDepth = depth;
        break;
      }
      depth--;
    }

    if (columnNode) {
      // Find the next column node
      const columnPos = $pos.before(columnDepth);
      const nextColumnPos = columnPos + columnNode.nodeSize;

      // Check if next column exists
      if (nextColumnPos < editor.state.doc.content.size) {
        const $nextPos = editor.state.doc.resolve(nextColumnPos);
        const nextNode = $nextPos.nodeAfter;

        if (nextNode?.type.name === "column") {
          // Insert at the start of the next column
          editor.commands.insertContentAt(nextColumnPos + 1, {
            type: "card",
            content: nodeJSON.content,
            attrs: {
              accent: nodeJSON.attrs.accent,
            },
          });
          return;
        }
      }
    }

    // Fallback: insert after current node if not in column or no next column
    editor.commands.insertContentAt(pos + node.nodeSize, {
      type: "card",
      content: nodeJSON.content,
      attrs: {
        accent: nodeJSON.attrs.accent,
      },
    });
  };

  return (
    <NodeViewWrapper
      data-type="card"
      data-accent={node.attrs.accent ? "true" : "false"}
      className={cn(
        "group/node hover:outline outline-1 hover:outline-border",
        isFocused && "outline outline-primary outline-2 hover:outline-primary"
      )}
    >
      <div
        className={cn(
          "absolute top-[-0.75em] left-[50%] -translate-x-[50%] opacity-0 group-hover/node:opacity-100",
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
              <Select
                value={node.attrs.accent ? "true" : "false"}
                onValueChange={(value) =>
                  updateAttributes({ accent: value === "true" })
                }
              >
                <SelectTrigger className="w-[140px] text-left h-8 focus:ring-0 border-none shadow-none ring-offset-0 hover:bg-muted">
                  <SelectValue placeholder="Тип карточки" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Акцентная</SelectItem>
                  <SelectItem value="false">Обычная</SelectItem>
                </SelectContent>
              </Select>

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
        className="absolute top-0 left-0 -translate-x-full opacity-0 group-hover/node:opacity-100 bg-background rounded-sm border border-border cursor-grab active:cursor-grabbing px-0.5 py-1.5 -ml-2"
      >
        <GripVertical className="size-4 text-foreground" strokeWidth={1} />
      </div>
      <NodeViewContent />
    </NodeViewWrapper>
  );
};
