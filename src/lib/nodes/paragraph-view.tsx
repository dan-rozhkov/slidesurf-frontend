
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandGroup,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import { Plus } from "lucide-react";
import { useState, Fragment } from "react";
import { commands } from "../commands";

export const ParagraphView = ({ node, editor }: NodeViewProps) => {
  const [open, setOpen] = useState(false);

  const handleInsertContent = (id: string) => {
    const command = commands.find((command) => command.id === id);

    if (command) {
      editor.chain().focus().insertContent(command.content).run();
    }
  };

  return (
    <NodeViewWrapper className="relative group/paragraph">
      {node.content.size === 0 && (
        <div className="absolute top-0 -left-2 -translate-x-full opacity-0 group-hover/paragraph:opacity-100">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="px-0.5 py-1.5 w-auto h-auto rounded-sm text-primary transition-none"
              >
                <Plus strokeWidth={1.5} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="right"
              sideOffset={5}
              align="start"
              className="w-auto p-0.5"
            >
              <Command>
                <CommandInput placeholder="Искать..." />
                <CommandList>
                  <CommandEmpty>Ничего не найдено.</CommandEmpty>
                  {["text", "image", "layout"].map((group, index) => (
                    <Fragment key={group}>
                      {index > 0 && <CommandSeparator />}
                      <CommandGroup
                        heading={
                          group === "text"
                            ? "Текст"
                            : group === "image"
                            ? "Изображение"
                            : "Макет"
                        }
                      >
                        {commands
                          .filter((command) => command.group === group)
                          .map((command) => (
                            <CommandItem
                              key={command.id}
                              value={command.title}
                              onSelect={() => handleInsertContent(command.id)}
                            >
                              <command.icon
                                className="size-4"
                                strokeWidth={1.5}
                              />
                              <span>{command.title}</span>
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </Fragment>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}

      <NodeViewContent style={{ textAlign: node.attrs.textAlign }} />
    </NodeViewWrapper>
  );
};
