
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { useMemo, useState } from "react";
import { useScopedI18n } from "@/lib/locales/client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useNodeHasFocus } from "@/lib/hooks/use-node-has-focus";
import { WithTooltip } from "@/components/ui/with-tooltip";
import {
  Minus,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  EllipsisVertical,
  ImageIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSheetVisibility } from "@/lib/hooks/use-sheet-visibility";

export const BentoGridItemView = ({
  node,
  getPos,
  editor,
  updateAttributes,
  deleteNode,
  selected,
}: NodeViewProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasFocus = useNodeHasFocus(editor, getPos, node.nodeSize);
  const [, setSheetVisibility] = useSheetVisibility();
  const t = useScopedI18n("actions");
  const tEditor = useScopedI18n("editor");
  const colSpan = node.attrs.colSpan as number;
  const rowSpan = node.attrs.rowSpan as number;
  const colStart = node.attrs.colStart as number | null;
  const rowStart = node.attrs.rowStart as number | null;
  const backgroundImageUrl = node.attrs.backgroundImageUrl as string | null;

  // Get parent grid info
  const { parentCols, parentRows, parentPos } = useMemo(() => {
    const position = getPos();
    if (position !== undefined) {
      const $pos = editor.state.doc.resolve(position);
      const parent = $pos.parent;
      if (parent && parent.type.name === "bentoGrid") {
        // Find parent position
        const parentStart = $pos.start() - 1;
        return {
          parentCols: parent.attrs.cols as number,
          parentRows: parent.attrs.rows as number,
          parentPos: parentStart,
        };
      }
    }
    return { parentCols: 3, parentRows: 4, parentPos: null };
  }, [getPos, editor.state.doc]);

  const updateColSpan = (newColSpan: number) => {
    if (newColSpan >= 1 && newColSpan <= parentCols) {
      updateAttributes({ colSpan: newColSpan });
    }
  };

  const updateRowSpan = (newRowSpan: number) => {
    if (newRowSpan >= 1 && newRowSpan <= parentRows) {
      updateAttributes({ rowSpan: newRowSpan });
    }
  };

  // Find ALL items that overlap with the target area (considering colSpan/rowSpan)
  const findItemsInArea = (
    targetCol: number,
    targetRow: number,
    targetColSpan: number,
    targetRowSpan: number
  ): Array<{
    pos: number;
    attrs: {
      colStart: number | null;
      rowStart: number | null;
      colSpan: number;
      rowSpan: number;
    };
  }> => {
    if (parentPos === null) return [];

    const currentPos = getPos();
    const $parentPos = editor.state.doc.resolve(parentPos + 1);
    const parent = $parentPos.parent;

    if (!parent || parent.type.name !== "bentoGrid") return [];

    const items: Array<{
      pos: number;
      attrs: {
        colStart: number | null;
        rowStart: number | null;
        colSpan: number;
        rowSpan: number;
      };
    }> = [];

    // Target area bounds
    const targetColEnd = targetCol + targetColSpan - 1;
    const targetRowEnd = targetRow + targetRowSpan - 1;

    let childPos = parentPos + 1;
    for (let i = 0; i < parent.childCount; i++) {
      const child = parent.child(i);
      if (child.type.name === "bentoGridItem") {
        const childColStart = child.attrs.colStart as number | null;
        const childRowStart = child.attrs.rowStart as number | null;
        const childColSpan = (child.attrs.colSpan as number) || 1;
        const childRowSpan = (child.attrs.rowSpan as number) || 1;

        // Skip current node
        if (childPos !== currentPos) {
          // Check if this item overlaps with target area
          if (childColStart !== null && childRowStart !== null) {
            const childColEnd = childColStart + childColSpan - 1;
            const childRowEnd = childRowStart + childRowSpan - 1;

            // Check for rectangle overlap
            const overlapsCol =
              targetCol <= childColEnd && targetColEnd >= childColStart;
            const overlapsRow =
              targetRow <= childRowEnd && targetRowEnd >= childRowStart;

            if (overlapsCol && overlapsRow) {
              items.push({
                pos: childPos,
                attrs: {
                  colStart: childColStart,
                  rowStart: childRowStart,
                  colSpan: childColSpan,
                  rowSpan: childRowSpan,
                },
              });
            }
          }
        }
      }
      childPos += child.nodeSize;
    }

    return items;
  };

  // Move with swap functionality (handles multiple items)
  const moveWithSwap = (newCol: number, newRow: number) => {
    const currentCol = colStart ?? 1;
    const currentRow = rowStart ?? 1;

    // Find all items that overlap with our target area
    const targetItems = findItemsInArea(newCol, newRow, colSpan, rowSpan);

    if (targetItems.length > 0) {
      // Swap positions using a transaction
      const currentPos = getPos();
      editor
        .chain()
        .focus()
        .command(({ tr }) => {
          // Calculate offset for displaced items
          const deltaCol = currentCol - newCol;
          const deltaRow = currentRow - newRow;

          // Update all overlapping items - move them by the inverse delta
          for (const targetItem of targetItems) {
            const itemNode = editor.state.doc.nodeAt(targetItem.pos);
            if (itemNode) {
              const newItemCol = (targetItem.attrs.colStart ?? 1) + deltaCol;
              const newItemRow = (targetItem.attrs.rowStart ?? 1) + deltaRow;

              tr.setNodeMarkup(targetItem.pos, null, {
                ...itemNode.attrs,
                colStart: newItemCol,
                rowStart: newItemRow,
              });
            }
          }

          // Update current item with target position
          tr.setNodeMarkup(currentPos, null, {
            ...node.attrs,
            colStart: newCol,
            rowStart: newRow,
          });

          return true;
        })
        .run();
    } else {
      // No items at target, just move
      updateAttributes({ colStart: newCol, rowStart: newRow });
    }
  };

  const moveLeft = () => {
    const currentCol = colStart ?? 1;
    const currentRow = rowStart ?? 1;
    if (currentCol > 1) {
      moveWithSwap(currentCol - 1, currentRow);
    }
  };

  const moveRight = () => {
    const currentCol = colStart ?? 1;
    const currentRow = rowStart ?? 1;
    const maxCol = parentCols - colSpan + 1;
    if (currentCol < maxCol) {
      moveWithSwap(currentCol + 1, currentRow);
    }
  };

  const moveUp = () => {
    const currentCol = colStart ?? 1;
    const currentRow = rowStart ?? 1;
    if (currentRow > 1) {
      moveWithSwap(currentCol, currentRow - 1);
    }
  };

  const moveDown = () => {
    const currentCol = colStart ?? 1;
    const currentRow = rowStart ?? 1;
    const maxRow = parentRows - rowSpan + 1;
    if (currentRow < maxRow) {
      moveWithSwap(currentCol, currentRow + 1);
    }
  };

  const canMoveLeft = (colStart ?? 1) > 1;
  const canMoveRight = (colStart ?? 1) < parentCols - colSpan + 1;
  const canMoveUp = (rowStart ?? 1) > 1;
  const canMoveDown = (rowStart ?? 1) < parentRows - rowSpan + 1;

  const openImageSheet = () => {
    setSheetVisibility(true, {
      mode: "cell",
      imageUrl: backgroundImageUrl,
      onImageChange: (url: string) => {
        updateAttributes({ backgroundImageUrl: url });
      },
      onImageReset: () => {
        updateAttributes({ backgroundImageUrl: null });
      },
    });
  };

  const itemStyle = {
    "--col-span": colSpan,
    "--row-span": rowSpan,
    "--col-start": colStart ?? "auto",
    "--row-start": rowStart ?? "auto",
    "--background-image-url": backgroundImageUrl
      ? `url(${backgroundImageUrl})`
      : "none",
  } as React.CSSProperties;

  return (
    <NodeViewWrapper
      data-type="bento-grid-item"
      data-col-span={colSpan}
      data-row-span={rowSpan}
      data-col-start={colStart}
      data-row-start={rowStart}
      className={cn(
        "bento-grid-item relative group/bento-item",
        (isFocused || selected || hasFocus) && "z-10",
        backgroundImageUrl && "has-background-image"
      )}
      style={itemStyle}
    >
      {/* Resize controls */}
      <div
        className={cn(
          "absolute top-1.5 right-1.5 opacity-0 group-hover/bento-item:opacity-100 z-[3] transition-opacity",
          (isFocused || selected || hasFocus) && "opacity-100"
        )}
        contentEditable={false}
      >
        <Popover onOpenChange={(state) => setIsFocused(state)}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "py-1 px-0.5 w-auto h-auto rounded-sm text-primary transition-none flex items-center gap-1.5",
                isFocused || selected ? "bg-muted border-primary" : ""
              )}
            >
              <EllipsisVertical className="size-3" strokeWidth={1.5} />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="end"
            sideOffset={5}
            className="w-auto p-2"
          >
            <div className="flex items-center gap-3">
              {/* Span controls */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <WithTooltip
                    display="Ширина ячейки"
                    trigger={
                      <span className="text-muted-foreground text-xs w-3">
                        W
                      </span>
                    }
                  />
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      onClick={() => updateColSpan(colSpan - 1)}
                      disabled={colSpan <= 1}
                    >
                      <Minus className="size-3" strokeWidth={1.5} />
                    </Button>
                    <Input
                      type="number"
                      value={colSpan}
                      onChange={(e) =>
                        updateColSpan(parseInt(e.target.value) || 1)
                      }
                      className="w-10 h-6 text-center text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      min={1}
                      max={parentCols}
                      style={{
                        MozAppearance: "textfield",
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      onClick={() => updateColSpan(colSpan + 1)}
                      disabled={colSpan >= parentCols}
                    >
                      <Plus className="size-3" strokeWidth={1.5} />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <WithTooltip
                    display="Высота ячейки"
                    trigger={
                      <span className="text-muted-foreground text-xs w-3">
                        H
                      </span>
                    }
                  />
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      onClick={() => updateRowSpan(rowSpan - 1)}
                      disabled={rowSpan <= 1}
                    >
                      <Minus className="size-3" strokeWidth={1.5} />
                    </Button>
                    <Input
                      type="number"
                      value={rowSpan}
                      onChange={(e) =>
                        updateRowSpan(parseInt(e.target.value) || 1)
                      }
                      className="w-10 h-6 text-center text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      min={1}
                      max={parentRows}
                      style={{
                        MozAppearance: "textfield",
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      onClick={() => updateRowSpan(rowSpan + 1)}
                      disabled={rowSpan >= parentRows}
                    >
                      <Plus className="size-3" strokeWidth={1.5} />
                    </Button>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full h-7 text-xs font-normal"
                  onClick={openImageSheet}
                  tabIndex={-1}
                >
                  <ImageIcon className="size-3.5" strokeWidth={1.5} />
                  {tEditor("backgroundImage")}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full h-7 text-xs font-normal"
                  onClick={deleteNode}
                  tabIndex={-1}
                >
                  <Trash2 className="size-3.5" strokeWidth={1.5} />
                  {t("delete")}
                </Button>
              </div>

              <Separator
                orientation="vertical"
                className="h-auto self-stretch"
              />

              {/* Position controls with arrows */}
              <div className="flex flex-col items-center gap-1">
                <WithTooltip
                  display="Переместить вверх"
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={moveUp}
                      disabled={!canMoveUp}
                    >
                      <ArrowUp className="size-4" strokeWidth={1.5} />
                    </Button>
                  }
                />
                <div className="flex items-center gap-1">
                  <WithTooltip
                    display="Переместить влево"
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={moveLeft}
                        disabled={!canMoveLeft}
                      >
                        <ArrowLeft className="size-4" strokeWidth={1.5} />
                      </Button>
                    }
                  />
                  <div className="size-7 flex items-center justify-center text-xs text-muted-foreground">
                    {colStart ?? "—"}:{rowStart ?? "—"}
                  </div>
                  <WithTooltip
                    display="Переместить вправо"
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={moveRight}
                        disabled={!canMoveRight}
                      >
                        <ArrowRight className="size-4" strokeWidth={1.5} />
                      </Button>
                    }
                  />
                </div>
                <WithTooltip
                  display="Переместить вниз"
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={moveDown}
                      disabled={!canMoveDown}
                    >
                      <ArrowDown className="size-4" strokeWidth={1.5} />
                    </Button>
                  }
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <NodeViewContent className="bento-grid-item-content" />
    </NodeViewWrapper>
  );
};
