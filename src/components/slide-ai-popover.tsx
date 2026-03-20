
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandItem,
  CommandList,
  CommandGroup,
} from "@/components/ui/command";
import { Button } from "./ui/button";
import {
  Sparkles,
  PencilLine,
  SpellCheck2,
  Languages,
  ListRestart,
  List,
  ListCollapse,
} from "lucide-react";
import { useState, useRef } from "react";
import { Slide } from "@/types";
import { SlideAction } from "@/types";
import { useScopedI18n } from "@/lib/locales/client";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useChatOpenAtom } from "@/lib/hooks/use-chat-open";
import { useAgentPromptAtom } from "@/lib/hooks/use-agent-prompt";

export default function SlideAIPopover({ slide }: { slide: Slide }) {
  const t = useScopedI18n("editor");
  const COMMANDS = [
    {
      id: SlideAction.IMPROVE_TEXT,
      icon: PencilLine,
      label: t("improveText"),
      group: t("group.text"),
    },
    {
      id: SlideAction.SPELL_CHECK,
      icon: SpellCheck2,
      label: t("spellCheck"),
      group: t("group.text"),
    },
    {
      id: SlideAction.TRANSLATE_TO_RUSSIAN,
      icon: Languages,
      label: t("translateToRussian"),
      group: t("group.text"),
    },
    {
      id: SlideAction.WRITE_MORE_DETAILED,
      icon: ListRestart,
      label: t("writeMoreDetailed"),
      group: t("group.text"),
    },
    {
      id: SlideAction.SHORTEN_TEXT,
      icon: ListRestart,
      label: t("shortenText"),
      group: t("group.text"),
    },
    {
      id: SlideAction.SPLIT_INTO_ITEMS,
      icon: List,
      label: t("splitIntoItems"),
      group: t("group.text"),
    },
    {
      id: SlideAction.SPLIT_INTO_SECTIONS,
      icon: ListCollapse,
      label: t("splitIntoSections"),
      group: t("group.text"),
    },
  ];
  const [open, setOpen] = useState(false);
  const [, setIsChatOpen] = useChatOpenAtom();
  const [, setAgentPrompt] = useAgentPromptAtom();
  const commandRef = useRef<HTMLDivElement>(null);
  const commandsGroups = COMMANDS.reduce((acc, command) => {
    acc[command.group] = [...(acc[command.group] || []), command];
    return acc;
  }, {} as Record<string, typeof COMMANDS>);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);

    if (open) {
      setTimeout(() => {
        commandRef.current?.focus();
      }, 0);
    }
  };

  const handleCommand = (actionId: string, label: string) => {
    const prompt = [label, `(${actionId})`].filter(Boolean).join(" ");

    setAgentPrompt(prompt);
    setIsChatOpen(true);
    setOpen(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="p-2 w-auto h-auto gap-0.5 relative"
          >
            <Tooltip delayDuration={300}>
              <TooltipTrigger className="absolute top-0 left-0 w-full h-full"></TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                {t("changeWithAI")}
              </TooltipContent>
            </Tooltip>

            <Sparkles className="size-4" strokeWidth={1.5} />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          sideOffset={12}
          align="center"
          className="w-[360px] p-0.5"
        >
          <Command ref={commandRef} className="focus:outline-none">
            <CommandList>
              {Object.entries(commandsGroups).map(([group, commands]) => (
                <CommandGroup key={group} heading={group}>
                  {commands
                    .filter((cmd) => cmd.group === group)
                    .map((cmd) => (
                      <CommandItem
                        key={cmd.id}
                        className="gap-4 px-3 py-2.5 rounded-lg"
                        onSelect={() => {
                          handleCommand(cmd.id as string, cmd.label);
                        }}
                      >
                        <cmd.icon className="size-4" strokeWidth={1.5} />
                        <span>{cmd.label}</span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
