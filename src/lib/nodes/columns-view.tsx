
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Ellipsis,
  Plus,
  Copy,
  GripVertical,
  Undo,
} from "lucide-react";
import { IconColumnInsertRight, IconColumnRemove } from "@tabler/icons-react";
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { WithTooltip } from "@/components/ui/with-tooltip";
import { Node as PmNode } from "@tiptap/pm/model";
import { Transaction } from "@tiptap/pm/state";

const MIN_WIDTH_PCT = 10;

function setColumnWidths(
  tr: Transaction,
  pos: number,
  node: PmNode,
  getWidth: (index: number, child: PmNode) => number | null
) {
  let childPos = pos + 1;
  node.content.forEach((child, _offset, index) => {
    tr.setNodeMarkup(childPos, undefined, {
      ...child.attrs,
      width: getWidth(index, child),
    });
    childPos += child.nodeSize;
  });
}

export const ColumnsView = ({
  deleteNode,
  editor,
  getPos,
  node,
  selected,
}: NodeViewProps) => {
  const isEditable = editor.isEditable;
  const [isFocused, setIsFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [handlePositions, setHandlePositions] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{
    handleIndex: number;
    startX: number;
    containerWidth: number;
    initialWidths: number[];
  } | null>(null);

  const countColumns = node.content.content.length;

  const getColumnWidths = (): number[] => {
    const cols = node.content.content;
    const count = cols.length;
    return cols.map((col) => col.attrs.width ?? 100 / count);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updatePositions = () => {
      const contentEl = container.querySelector(
        "[data-node-view-content-react]"
      );
      if (!contentEl) return;
      const columns = contentEl.querySelectorAll('[data-type="column"]');
      const containerRect = container.getBoundingClientRect();
      const positions: number[] = [];

      for (let i = 0; i < columns.length - 1; i++) {
        const colRect = columns[i].getBoundingClientRect();
        const nextColRect = columns[i + 1].getBoundingClientRect();
        const midpoint =
          (colRect.right + nextColRect.left) / 2 - containerRect.left;
        positions.push(midpoint);
      }
      setHandlePositions((prev) => {
        if (
          prev.length === positions.length &&
          prev.every((v, i) => v === positions[i])
        )
          return prev;
        return positions;
      });
    };

    updatePositions();
    const observer = new ResizeObserver(updatePositions);
    observer.observe(container);
    return () => observer.disconnect();
  }, [node, countColumns]);

  useEffect(() => {
    if (!isDragging) return;

    document.body.style.cursor = "col-resize";

    const onMouseMove = (e: MouseEvent) => {
      const state = dragStateRef.current;
      if (!state) return;

      const deltaX = e.clientX - state.startX;
      const deltaPct = (deltaX / state.containerWidth) * 100;

      const { handleIndex, initialWidths } = state;

      let leftWidth = initialWidths[handleIndex] + deltaPct;
      let rightWidth = initialWidths[handleIndex + 1] - deltaPct;

      if (leftWidth < MIN_WIDTH_PCT) {
        leftWidth = MIN_WIDTH_PCT;
        rightWidth =
          initialWidths[handleIndex] +
          initialWidths[handleIndex + 1] -
          MIN_WIDTH_PCT;
      }
      if (rightWidth < MIN_WIDTH_PCT) {
        rightWidth = MIN_WIDTH_PCT;
        leftWidth =
          initialWidths[handleIndex] +
          initialWidths[handleIndex + 1] -
          MIN_WIDTH_PCT;
      }

      const roundedLeft = Math.round(leftWidth * 10) / 10;
      const roundedRight = Math.round(rightWidth * 10) / 10;

      const pos = getPos();
      const currentNode = editor.state.doc.nodeAt(pos);
      if (!currentNode) return;

      editor
        .chain()
        .command(({ tr }) => {
          tr.setMeta("addToHistory", false);
          setColumnWidths(tr, pos, currentNode, (index) => {
            if (index === handleIndex) return roundedLeft;
            if (index === handleIndex + 1) return roundedRight;
            return initialWidths[index];
          });
          return true;
        })
        .run();
    };

    const onMouseUp = () => {
      const state = dragStateRef.current;
      if (state) {
        // Commit final widths to history as a single undoable step
        const pos = getPos();
        const currentNode = editor.state.doc.nodeAt(pos);
        if (currentNode) {
          editor
            .chain()
            .command(({ tr }) => {
              setColumnWidths(tr, pos, currentNode, (index) =>
                currentNode.content.content[index].attrs.width
              );
              return true;
            })
            .run();
        }
      }
      dragStateRef.current = null;
      setIsDragging(false);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, editor, getPos]);

  const onResizeStart = (e: React.MouseEvent, handleIndex: number) => {
    e.preventDefault();
    e.stopPropagation();

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    dragStateRef.current = {
      handleIndex,
      startX: e.clientX,
      containerWidth: rect.width,
      initialWidths: getColumnWidths(),
    };
    setIsDragging(true);
  };

  const resetColumnWidths = () => {
    const pos = getPos();
    editor
      .chain()
      .command(({ tr }) => {
        setColumnWidths(tr, pos, node, () => null);
        return true;
      })
      .run();
  };

  const addColumn = () => {
    if (countColumns >= 4) return;

    const pos = getPos();
    const nodeSize = node.nodeSize;

    editor
      .chain()
      .command(({ tr }) => {
        setColumnWidths(tr, pos, node, () => null);
        const newCol = editor.schema.nodes.column.createAndFill({
          width: null,
        });
        if (newCol) tr.insert(pos + nodeSize - 1, newCol);
        return true;
      })
      .run();
  };

  const deleteColumn = () => {
    if (countColumns <= 1) return;

    const pos = getPos();
    const lastColumn = node.content.content[countColumns - 1];
    const lastColumnPos = pos + node.nodeSize - lastColumn.nodeSize - 1;

    editor
      .chain()
      .command(({ tr }) => {
        // Reset widths before delete — positions shift after delete
        setColumnWidths(tr, pos, node, (index) =>
          index === countColumns - 1 ? node.content.content[index].attrs.width : null
        );
        tr.delete(lastColumnPos, lastColumnPos + lastColumn.nodeSize);
        return true;
      })
      .run();
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
          : "",
        isDragging && "select-none"
      )}
      ref={containerRef}
    >
      {isEditable && countColumns < 4 && (
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

      {isEditable && <div
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

              <WithTooltip
                side="bottom"
                display="Сбросить ширину"
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={resetColumnWidths}
                    tabIndex={-1}
                  >
                    <Undo className="size-4" strokeWidth={1.5} />
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
      </div>}

      {isEditable && <div
        contentEditable={false}
        draggable
        data-drag-handle
        className="absolute top-0 left-0 -translate-x-full opacity-0 group-hover/columns:opacity-100 bg-background rounded-sm border border-border cursor-grab active:cursor-grabbing px-0.5 py-1.5 -ml-2"
      >
        <GripVertical className="size-4" strokeWidth={1} />
      </div>}

      {isEditable && handlePositions.length > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          contentEditable={false}
        >
          {handlePositions.map((pos, i) => (
            <div
              key={i}
              className="absolute top-0 h-full pointer-events-auto cursor-col-resize"
              style={{
                left: `${pos}px`,
                width: "24px",
                transform: "translateX(-50%)",
              }}
              onMouseDown={(e) => onResizeStart(e, i)}
            >
              <div
                className={cn(
                  "h-full mx-auto rounded-full transition-all",
                  isDragging && dragStateRef.current?.handleIndex === i
                    ? "w-[3px] bg-primary"
                    : "w-px bg-transparent group-hover/columns:bg-border hover:!w-[3px] hover:!bg-primary/50"
                )}
              />
            </div>
          ))}
        </div>
      )}

      <NodeViewContent className="node-columns-view" />
    </NodeViewWrapper>
  );
};
