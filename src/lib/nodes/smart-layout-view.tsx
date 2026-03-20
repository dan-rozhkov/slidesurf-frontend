
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Ellipsis,
  Plus,
  Minus,
  Copy,
  GripVertical,
  ArrowRight,
  BarChart3,
  Percent,
  Triangle,
  ArrowDown,
  Filter,
  Star,
  Quote,
} from "lucide-react";
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { WithTooltip } from "@/components/ui/with-tooltip";
import { SmartLayoutType } from "./smart-layout";

export const SmartLayoutView = ({
  deleteNode,
  editor,
  getPos,
  node,
  selected,
}: NodeViewProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const layoutType = node.attrs.type as SmartLayoutType;
  const countItems = node.content.content.length;

  const layoutTypes = [
    { type: "arrows", label: "Стрелки", icon: ArrowRight },
    { type: "arrows-down", label: "Стрелки", icon: ArrowDown },
    { type: "statistics", label: "Статистика", icon: BarChart3 },
    { type: "big-numbers", label: "Большие числа", icon: Percent },
    { type: "raiting-stars", label: "Рейтинг", icon: Star },
    { type: "pyramid", label: "Пирамида", icon: Triangle },
    { type: "funnel", label: "Воронка", icon: Filter },
    { type: "quotes", label: "Цитаты", icon: Quote },
  ] as const;

  const addItem = () => {
    const pos = getPos();
    const nodeSize = node.nodeSize;

    if (countItems >= 6) {
      return false;
    }

    editor.commands.insertContentAt(pos + nodeSize - 1, {
      type: "smartLayoutItem",
      attrs: { type: layoutType },
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: `Элемент ${countItems + 1}` }],
        },
      ],
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

  const changeLayoutType = (newType: SmartLayoutType) => {
    const pos = getPos();

    // Use a single transaction to ensure atomic operation
    editor
      .chain()
      .focus()
      .command(({ tr }) => {
        // Update parent node type
        tr.setNodeMarkup(pos, null, { type: newType });

        // Update all child items with new type
        let childPos = pos + 1;
        node.content.forEach((child) => {
          tr.setNodeMarkup(childPos, null, {
            ...child.attrs,
            type: newType,
          });
          childPos += child.nodeSize;
        });

        return true;
      })
      .run();
  };

  const cloneNode = () => {
    const pos = getPos();
    const nodeSize = node.nodeSize;
    const nodeJSON = node.toJSON();

    editor.commands.insertContentAt(pos + nodeSize, {
      type: "smartLayout",
      attrs: { type: layoutType },
      content: nodeJSON.content,
    });
  };

  const currentLayoutConfig = layoutTypes.find(
    (config) => config.type === layoutType
  );
  const CurrentIcon = currentLayoutConfig?.icon || ArrowRight;

  const getLayoutClassName = (layoutType: SmartLayoutType) => {
    switch (layoutType) {
      case "statistics":
      case "big-numbers":
      case "raiting-stars":
        return "[&>div[data-node-view-content-react]]:grid [&>div[data-node-view-content-react]]:grid-cols-3";
      case "quotes":
        return "[&>div[data-node-view-content-react]]:grid [&>div[data-node-view-content-react]]:grid-cols-3 [&>div[data-node-view-content-react]]:gap-[2em]";
      case "pyramid":
      case "funnel":
        return "[&>div[data-node-view-content-react]]:flex [&>div[data-node-view-content-react]]:flex-col [&>div[data-node-view-content-react]]:items-start [&>div[data-node-view-content-react]]:justify-center [&>div[data-node-view-content-react]]:gap-[0.2em]";
      case "arrows-down":
        return "[&>div[data-node-view-content-react]]:flex [&>div[data-node-view-content-react]]:flex-col [&>div[data-node-view-content-react]]:items-start [&>div[data-node-view-content-react]]:justify-center";
      default:
        return "[&>div[data-node-view-content-react]]:flex [&>div[data-node-view-content-react]>div]:flex-grow [&>div[data-node-view-content-react]>div]:w-full";
    }
  };

  return (
    <NodeViewWrapper
      className={cn(
        "relative group/smart-layout hover:outline outline-1 hover:outline-border rounded-md",
        isFocused || selected
          ? "outline outline-primary outline-2 hover:outline-primary"
          : ""
      )}
      data-type="smart-layout"
      data-smart-layout-type={layoutType}
    >
      {countItems < 6 && (
        <div
          className="absolute opacity-0 group-hover/smart-layout:opacity-100 right-0 top-[50%] translate-x-1/2 -translate-y-1/2 z-[2]"
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
      )}

      <div
        className={cn(
          "absolute top-[-0.75em] left-[50%] -translate-x-[50%] opacity-0 group-hover/smart-layout:opacity-100 z-[2]",
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
              <CurrentIcon className="size-3" strokeWidth={1.5} />
              <Ellipsis className="size-4" strokeWidth={1.5} />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" sideOffset={5} className="w-auto p-0.5">
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1">
                <Select
                  value={layoutType}
                  onValueChange={(value) =>
                    changeLayoutType(value as SmartLayoutType)
                  }
                >
                  <SelectTrigger className="w-auto h-10 focus:ring-0 border-none hover:bg-accent">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <CurrentIcon className="size-4" strokeWidth={1.5} />
                        <span>{currentLayoutConfig?.label}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {layoutTypes.map((config) => {
                      const Icon = config.icon;
                      return (
                        <SelectItem key={config.type} value={config.type}>
                          <div className="flex items-center gap-2">
                            <Icon className="size-4" strokeWidth={1.5} />
                            <span>{config.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <Separator orientation="vertical" className="h-4" />

              <WithTooltip
                side="bottom"
                display="Добавить элемент"
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={addItem}
                    tabIndex={-1}
                    disabled={countItems >= 6}
                  >
                    <Plus className="size-4" strokeWidth={1.5} />
                  </Button>
                }
                delayDuration={1000}
              />

              <WithTooltip
                side="bottom"
                display="Удалить элемент"
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={deleteItem}
                    tabIndex={-1}
                    disabled={countItems <= 1}
                  >
                    <Minus className="size-4" strokeWidth={1.5} />
                  </Button>
                }
                delayDuration={1000}
              />

              <Separator orientation="vertical" className="h-4" />

              <WithTooltip
                side="bottom"
                display="Дублировать"
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
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
                display="Удалить"
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={deleteNode}
                    tabIndex={-1}
                  >
                    <Trash2 className="size-4" strokeWidth={1.5} />
                  </Button>
                }
                delayDuration={1000}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div
        contentEditable={false}
        draggable
        data-drag-handle
        className="absolute top-0 left-0 -translate-x-full opacity-0 group-hover/smart-layout:opacity-100 bg-background rounded-sm border border-border cursor-grab active:cursor-grabbing px-0.5 py-1.5 -ml-2"
      >
        <GripVertical className="size-4" strokeWidth={1} />
      </div>

      <NodeViewContent
        data-smart-layout-type={layoutType}
        className={getLayoutClassName(layoutType)}
      />
    </NodeViewWrapper>
  );
};
