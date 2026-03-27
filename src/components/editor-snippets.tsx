
import { Button } from "./ui/button";
import { commands } from "@/lib/commands";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useState } from "react";
import { GripVertical, MessageCircleIcon } from "lucide-react";
import { useScopedI18n } from "@/lib/locales/client";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useCurrentSlideIdAtom } from "@/lib/hooks/use-current-slide-id";
import { usePresentationAtom } from "@/lib/hooks/use-presentation";
import { useSlideActions } from "@/lib/actions/slide.client";
import { useIsPresentingAtom } from "@/lib/hooks/use-is-presenting";
import { useChatOpenAtom } from "@/lib/hooks/use-chat-open";

type Command = (typeof commands)[number];
type GroupedCommands = Record<string, Command[]>;

export function EditorSnippets() {
  const t = useScopedI18n("editor");
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [currentSlideId] = useCurrentSlideIdAtom();
  const [presentationAtom] = usePresentationAtom();
  const { updateSlideContent } = useSlideActions();
  const [, setIsPresenting] = useIsPresentingAtom();
  const [isChatOpen, setIsChatOpen] = useChatOpenAtom();

  // Group commands by their group property
  const groupedCommands = commands.reduce((acc, command) => {
    if (!acc[command.group]) {
      acc[command.group] = [];
    }
    acc[command.group].push(command);
    return acc;
  }, {} as GroupedCommands);

  const handleInsertContent = (content: string) => {
    // Check if there's an active slide
    if (!currentSlideId) {
      return;
    }

    // Find the active slide
    const activeSlide = presentationAtom.slides.find(
      (slide) => slide.id === currentSlideId
    );

    // If no active slide, do nothing
    if (!activeSlide) {
      return;
    }

    // For Tiptap compatibility, we need to ensure proper structure
    // We'll try to insert the content at the end of the document
    // by wrapping it in a paragraph tag if it's not already wrapped
    let tiptapContent = content;

    // If the content doesn't start with a tag, wrap it in a paragraph
    if (!content.startsWith("<")) {
      tiptapContent = `<p>${content}</p>`;
    }

    // Create new content by inserting the new content at the end
    // We need to ensure proper structure for Tiptap
    const newContent = `${activeSlide.content}${tiptapContent}`;

    // Update the slide with the new content using the slide actions
    updateSlideContent(currentSlideId, newContent);
    setIsPresenting(true);

    setTimeout(() => setIsPresenting(false), 500);
  };

  return (
    <div
      className={cn(
        "fixed top-[50%] right-4 flex flex-col gap-2 -translate-y-1/2 rounded-lg bg-background border border-border p-1 shadow-md",
        isChatOpen && "right-[410px]"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="p-2 w-auto h-auto"
        onClick={() => setIsChatOpen((v) => !v)}
      >
        <MessageCircleIcon className="size-4" strokeWidth={1.5} />
      </Button>

      <Separator />

      {Object.entries(groupedCommands).map(([group, groupCommands]) => {
        const Icon = groupCommands[0]?.icon;
        return (
          <Popover
            key={group}
            open={openPopover === group}
            onOpenChange={(open) => setOpenPopover(open ? group : null)}
          >
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="p-2 w-auto h-auto relative"
                data-command-group={group}
              >
                <Tooltip delayDuration={300}>
                  <TooltipTrigger className="absolute top-0 left-0 w-full h-full"></TooltipTrigger>
                  <TooltipContent side="left" align="center">
                    {t(`group.${group}` as keyof typeof t)}
                  </TooltipContent>
                </Tooltip>
                {Icon && <Icon className="size-4" strokeWidth={1.5} />}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[400px] p-4"
              align="center"
              side="left"
              sideOffset={12}
            >
              <h3 className="text-lg font-semibold tracking-tight">
                {t(`group.${group}` as keyof typeof t)}
              </h3>
              <p className="text-sm text-muted-foreground pb-4">
                {t("dragToSlide")}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {groupCommands.map((command) => (
                  <Button
                    key={command.id}
                    variant="outline"
                    size="icon"
                    className="p-4 w-auto h-auto cursor-grab shadow-sm flex-col items-center justify-start ellipsis overflow-hidden gap-2 relative rounded-lg transition-all hover:shadow-md hover:bg-accent/50"
                    data-command-id={command.id}
                    draggable
                    onDragStart={(event) => {
                      setOpenPopover(null);
                      event.dataTransfer.setData(
                        "application/x-tiptap-node",
                        JSON.stringify({
                          type: command.id,
                          content: command.content,
                        })
                      );
                    }}
                    onClick={() => {
                      setOpenPopover(null);
                      handleInsertContent(command.content);
                    }}
                  >
                    <command.icon className="size-4" strokeWidth={1.5} />
                    <p className="text-xs font-normal w-full truncate">
                      {command.title}
                    </p>
                    <GripVertical
                      className="size-4 text-muted-foreground absolute top-2 right-2"
                      strokeWidth={1.5}
                    />
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        );
      })}
    </div>
  );
}
