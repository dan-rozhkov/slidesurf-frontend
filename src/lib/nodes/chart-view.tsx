
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  Ellipsis,
  Copy,
  Trash2,
  Pencil,
  GripVertical,
  Loader,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { cn, transformDataForChart } from "../utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChartPreview } from "@/components/chart/chart-preview";
import { ChartType } from "@/types";
import {
  SheetContent,
  SheetTitle,
  SheetHeader,
  Sheet,
} from "@/components/ui/sheet";
import { ChartEditor } from "@/components/chart/chart-editor";

export const ChartView = ({
  editor,
  getPos,
  node,
  selected,
}: NodeViewProps) => {
  const isEditable = editor.isEditable;
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isValidChartData =
    Array.isArray(node.attrs.data) &&
    node.attrs.data.length > 1 &&
    node.attrs.data.every((row) => Array.isArray(row));

  const deleteChart = () => {
    const pos = getPos();
    editor
      .chain()
      .focus()
      .deleteRange({ from: pos, to: pos + node.nodeSize })
      .run();
  };

  const cloneChart = () => {
    const pos = getPos();
    const chart = node.toJSON();

    editor.commands.insertContentAt(pos + node.nodeSize, {
      type: "chart",
      attrs: chart.attrs,
      content: chart.content,
    });
  };

  return (
    <NodeViewWrapper
      data-type="chart"
      className={cn(
        "relative group/chart hover:outline outline-1 hover:outline-border rounded-md",
        isEditable && (isFocused || selected)
          ? "outline outline-primary outline-2 hover:outline-primary"
          : ""
      )}
    >
      <div
        contentEditable={false}
        className={cn(
          "absolute top-[-0.75em] left-[50%] -translate-x-[50%] opacity-0 group-hover/chart:opacity-100",
          isEditable && (isFocused || selected) && "opacity-100"
        )}
      >
        <Popover
          onOpenChange={(state) => setIsFocused(state)}
          open={isEditable ? undefined : false}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "px-2 py-0.5 w-auto h-auto rounded-sm text-primary transition-none flex items-center gap-1.5",
                isEditable && (isFocused || selected)
                  ? "bg-muted hover:bg-muted border-primary text-primary hover:text-primary outline-primary outline-2"
                  : ""
              )}
              disabled={!isEditable}
            >
              <Ellipsis className="size-4" strokeWidth={1.5} />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" sideOffset={5} className="w-auto p-0.5">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
              >
                <Pencil className="size-4" strokeWidth={1.5} />
              </Button>

              <Button variant="ghost" size="icon" onClick={cloneChart}>
                <Copy className="size-4" strokeWidth={1.5} />
              </Button>

              <Separator orientation="vertical" className="h-4" />

              <Button variant="ghost" size="icon" onClick={deleteChart}>
                <Trash2 className="size-4" strokeWidth={1.5} />
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Вставить график</SheetTitle>
          </SheetHeader>

          <ChartEditor
            initialState={{
              data: node.attrs.data,
              chartType: node.attrs.chartType,
              showLabels: node.attrs.showLabels,
              showGrid: node.attrs.showGrid,
              showValues: node.attrs.showValues,
              stacked: node.attrs.stacked,
            }}
            onUpdate={(state) => {
              const pos = getPos();
              editor
                .chain()
                .focus()
                .command(({ tr }) => {
                  tr.setNodeMarkup(pos, undefined, state);
                  return true;
                })
                .run();
              setIsOpen(false);
            }}
          />
        </SheetContent>
      </Sheet>

      <div className="w-full h-[16em]">
        {isValidChartData ? (
          <ChartPreview
            data={transformDataForChart(node.attrs.data)}
            chartType={node.attrs.chartType as ChartType}
            showLabels={node.attrs.showLabels}
            showGrid={node.attrs.showGrid}
            showValues={node.attrs.showValues}
            stacked={node.attrs.stacked}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
            <Loader className="size-4 animate-spin" />
          </div>
        )}
      </div>

      <div
        contentEditable={false}
        draggable
        data-drag-handle
        className="absolute top-0 left-0 -translate-x-full opacity-0 group-hover/chart:opacity-100 bg-background rounded-sm border border-border cursor-grab active:cursor-grabbing px-0.5 py-1.5 -ml-2"
      >
        <GripVertical className="size-4" strokeWidth={1} />
      </div>
    </NodeViewWrapper>
  );
};
