
import { Button } from "@/components/ui/button";
import { useScopedI18n } from "@/lib/locales/client";
import {
  Trash2,
  Ellipsis,
  Plus,
  Minus,
  Copy,
  GripVertical,
  Columns2,
  Rows2,
} from "lucide-react";
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import { WithTooltip } from "@/components/ui/with-tooltip";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const BentoGridView = ({
  deleteNode,
  editor,
  getPos,
  node,
  selected,
  updateAttributes,
}: NodeViewProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isGridPickerOpen, setIsGridPickerOpen] = useState(false);
  const [hoverCell, setHoverCell] = useState<{
    col: number;
    row: number;
  } | null>(null);
  const t = useScopedI18n("actions");
  const cols = node.attrs.cols as number;
  const rows = node.attrs.rows as number;
  const countItems = node.content.content.length;

  const GRID_PICKER_COLS = 10;
  const GRID_PICKER_ROWS = 6;

  const handleGridPickerSelect = useCallback(
    (col: number, row: number) => {
      updateAttributes({ cols: col, rows: row });
      setIsGridPickerOpen(false);
    },
    [updateAttributes]
  );

  const findNextFreePosition = (): { colStart: number; rowStart: number } => {
    // Build a map of occupied cells
    const occupiedCells = new Set<string>();

    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (child.type.name === "bentoGridItem") {
        const childColStart = child.attrs.colStart as number | null;
        const childRowStart = child.attrs.rowStart as number | null;
        const childColSpan = (child.attrs.colSpan as number) || 1;
        const childRowSpan = (child.attrs.rowSpan as number) || 1;

        if (childColStart !== null && childRowStart !== null) {
          // Mark all cells occupied by this item
          for (let c = childColStart; c < childColStart + childColSpan; c++) {
            for (let r = childRowStart; r < childRowStart + childRowSpan; r++) {
              occupiedCells.add(`${c}:${r}`);
            }
          }
        }
      }
    }

    // Find first free cell (scanning row by row, left to right)
    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= cols; col++) {
        if (!occupiedCells.has(`${col}:${row}`)) {
          return { colStart: col, rowStart: row };
        }
      }
    }

    // If no free cell found, return position 1:1 (will overlap, but better than null)
    return { colStart: 1, rowStart: 1 };
  };

  const addItem = () => {
    const pos = getPos();
    const nodeSize = node.nodeSize;
    const { colStart, rowStart } = findNextFreePosition();

    editor.commands.insertContentAt(pos + nodeSize - 1, {
      type: "bentoGridItem",
      attrs: { colSpan: 1, rowSpan: 1, colStart, rowStart },
      content: [{ type: "paragraph" }],
    });
  };

  const deleteItem = () => {
    if (countItems <= 1) {
      return false;
    }

    const pos = getPos();
    const lastItem = node.content.content[countItems - 1];
    const lastItemPos = pos + node.nodeSize - lastItem.nodeSize - 1;

    editor.commands.deleteRange({
      from: lastItemPos,
      to: lastItemPos + lastItem.nodeSize,
    });
  };

  const cloneNode = () => {
    const pos = getPos();
    const nodeSize = node.nodeSize;
    const nodeJSON = node.toJSON();

    editor.commands.insertContentAt(pos + nodeSize, {
      type: "bentoGrid",
      attrs: { cols, rows },
      content: nodeJSON.content,
    });
  };

  const updateCols = (newCols: number) => {
    if (newCols >= 1 && newCols <= 12) {
      updateAttributes({ cols: newCols });
    }
  };

  const updateRows = (newRows: number) => {
    if (newRows >= 1 && newRows <= 12) {
      updateAttributes({ rows: newRows });
    }
  };

  const gridStyle = {
    "--bento-cols": cols,
    "--bento-rows": rows,
  } as React.CSSProperties;

  return (
    <NodeViewWrapper
      className={cn(
        "relative group/bento-grid hover:outline outline-1 hover:outline-border rounded-md",
        isFocused || selected
          ? "outline outline-primary outline-2 hover:outline-primary"
          : ""
      )}
      data-type="bento-grid"
      data-cols={cols}
      data-rows={rows}
      style={gridStyle}
    >
      {/* Add cell button on the right */}
      <div
        className="absolute opacity-0 group-hover/bento-grid:opacity-100 right-0 top-[50%] translate-x-1/2 -translate-y-1/2 z-[2]"
        contentEditable={false}
      >
        <Button
          variant="outline"
          size="icon"
          className="rounded-full p-0 size-7"
          onClick={addItem}
        >
          <Plus className="size-4" strokeWidth={1.5} />
        </Button>
      </div>

      <div
        className={cn(
          "absolute top-[-0.75em] left-[50%] -translate-x-[50%] opacity-0 group-hover/bento-grid:opacity-100 z-[2]",
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
              <span className="text-xs font-normal">
                {cols} × {rows}
              </span>
              <Ellipsis className="size-4" strokeWidth={1.5} />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" sideOffset={5} className="w-auto p-2">
            <div className="flex flex-col gap-3">
              {/* Grid size controls */}
              <div className="flex items-center gap-4">
                {/* Grid preview with picker */}
                <Popover
                  open={isGridPickerOpen}
                  onOpenChange={setIsGridPickerOpen}
                >
                  <PopoverTrigger asChild>
                    <button
                      className="relative w-14 h-8 cursor-pointer hover:outline outline-1 transition-opacity rounded-sm"
                      type="button"
                    >
                      <div
                        className="absolute inset-0 grid gap-px bg-border rounded-sm overflow-hidden border border-border"
                        style={{
                          gridTemplateColumns: `repeat(${cols}, 1fr)`,
                          gridTemplateRows: `repeat(${rows}, 1fr)`,
                        }}
                      >
                        {Array.from({ length: cols * rows }).map((_, i) => (
                          <div key={i} className="bg-background" />
                        ))}
                      </div>
                      <span className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                        {cols} × {rows}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    side="bottom"
                    align="start"
                    sideOffset={12}
                    className="w-auto p-3"
                    onMouseLeave={() => setHoverCell(null)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className="grid gap-1"
                        style={{
                          gridTemplateColumns: `repeat(${GRID_PICKER_COLS}, 1fr)`,
                          gridTemplateRows: `repeat(${GRID_PICKER_ROWS}, 1fr)`,
                        }}
                      >
                        {Array.from({
                          length: GRID_PICKER_COLS * GRID_PICKER_ROWS,
                        }).map((_, i) => {
                          const cellCol = (i % GRID_PICKER_COLS) + 1;
                          const cellRow = Math.floor(i / GRID_PICKER_COLS) + 1;
                          const isHighlighted = hoverCell
                            ? cellCol <= hoverCell.col &&
                              cellRow <= hoverCell.row
                            : cellCol <= cols && cellRow <= rows;

                          return (
                            <button
                              key={i}
                              type="button"
                              className={cn(
                                "size-4 rounded-sm border",
                                isHighlighted
                                  ? "bg-primary/20 border-primary"
                                  : "bg-muted/50 border-border hover:border-muted-foreground/30"
                              )}
                              onMouseEnter={() =>
                                setHoverCell({ col: cellCol, row: cellRow })
                              }
                              onClick={() =>
                                handleGridPickerSelect(cellCol, cellRow)
                              }
                            />
                          );
                        })}
                      </div>
                      <div className="bg-foreground text-background text-xs px-1.5 py-0.5 rounded-md">
                        {hoverCell
                          ? `${hoverCell.col} × ${hoverCell.row}`
                          : `${cols} × ${rows}`}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Separator orientation="vertical" className="h-4" />

                <div className="flex items-center gap-1">
                  <Columns2 className="size-4" strokeWidth={1.5} />
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => updateCols(cols - 1)}
                      disabled={cols <= 1}
                    >
                      <Minus className="size-3" strokeWidth={1.5} />
                    </Button>
                    <Input
                      type="number"
                      value={cols}
                      onChange={(e) =>
                        updateCols(parseInt(e.target.value) || 1)
                      }
                      className="w-12 h-7 text-center text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      min={1}
                      max={12}
                      style={{
                        MozAppearance: "textfield",
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => updateCols(cols + 1)}
                      disabled={cols >= 12}
                    >
                      <Plus className="size-3" strokeWidth={1.5} />
                    </Button>
                  </div>
                </div>

                <Separator orientation="vertical" className="h-4" />

                <div className="flex items-center gap-1">
                  <Rows2 className="size-4" strokeWidth={1.5} />
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => updateRows(rows - 1)}
                      disabled={rows <= 1}
                    >
                      <Minus className="size-3" strokeWidth={1.5} />
                    </Button>
                    <Input
                      type="number"
                      value={rows}
                      onChange={(e) =>
                        updateRows(parseInt(e.target.value) || 1)
                      }
                      className="w-12 h-7 text-center text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      min={1}
                      max={12}
                      style={{
                        MozAppearance: "textfield",
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => updateRows(rows + 1)}
                      disabled={rows >= 12}
                    >
                      <Plus className="size-3" strokeWidth={1.5} />
                    </Button>
                  </div>
                </div>

                <Separator orientation="vertical" className="h-4" />

                <WithTooltip
                  side="bottom"
                  display={t("copy")}
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={cloneNode}
                      tabIndex={-1}
                    >
                      <Copy className="size-4" strokeWidth={1.5} />
                    </Button>
                  }
                  delayDuration={1000}
                />

                <WithTooltip
                  side="bottom"
                  display={t("delete")}
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={deleteNode}
                      tabIndex={-1}
                    >
                      <Trash2 className="size-4" strokeWidth={1.5} />
                    </Button>
                  }
                  delayDuration={1000}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div
        contentEditable={false}
        draggable
        data-drag-handle
        className="absolute top-0 left-0 -translate-x-full opacity-0 group-hover/bento-grid:opacity-100 bg-background rounded-sm border border-border cursor-grab active:cursor-grabbing px-0.5 py-1.5 -ml-2"
      >
        <GripVertical className="size-4" strokeWidth={1} />
      </div>

      <NodeViewContent className="bento-grid-content" />
    </NodeViewWrapper>
  );
};
