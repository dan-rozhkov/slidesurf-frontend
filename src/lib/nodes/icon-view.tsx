import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { DynamicLucideIcon, IconSize } from "../utils/lucide-icon-map";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { IconPicker } from "@/components/icon-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const IconView = ({
  node,
  updateAttributes,
  selected,
  editor,
}: NodeViewProps) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const { name, size } = node.attrs as { name: string; size: IconSize };
  const isEditable = editor.isEditable;

  const iconElement = (
    <span
      className={cn("inline-flex", isEditable && "cursor-pointer")}
      contentEditable={false}
    >
      <DynamicLucideIcon name={name} size={size} />
    </span>
  );

  return (
    <NodeViewWrapper
      as="span"
      className={cn(
        "inline-icon-node",
        selected && "outline outline-primary outline-2 rounded-sm"
      )}
    >
      {isEditable ? (
        <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
          <PopoverTrigger asChild>{iconElement}</PopoverTrigger>
          <PopoverContent
            side="top"
            sideOffset={12}
            className="w-[280px] p-0"
          >
            <IconPicker
              currentIcon={name}
              currentSize={size}
              onIconSelect={(iconName) => {
                updateAttributes({ name: iconName });
                setIsPickerOpen(false);
              }}
              onSizeChange={(iconSize) => {
                updateAttributes({ size: iconSize });
              }}
            />
          </PopoverContent>
        </Popover>
      ) : (
        iconElement
      )}
    </NodeViewWrapper>
  );
};
