
import {
  Languages,
  ListRestart,
  PencilLine,
  Sparkles,
  SpellCheck2,
  ArrowRight,
  Loader,
} from "lucide-react";
import { useScopedI18n } from "@/lib/locales/client";
import { SlideAction } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState, useRef } from "react";

export default function ContentAIPopover({
  selectedText,
  onSelect,
  onCustomPrompt,
}: {
  selectedText?: string;
  onSelect: (action: string) => void;
  onCustomPrompt: (prompt: string, selectedText: string) => void;
}) {
  const t = useScopedI18n("editor");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCustomPromptSubmit = async () => {
    if (!customPrompt.trim() || !selectedText) return;

    setIsLoading(true);
    try {
      await onCustomPrompt(customPrompt.trim(), selectedText);
      setCustomPrompt("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleCustomPromptSubmit();
      return false;
    }
  };

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
  ];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="py-0 px-2 h-8 font-normal">
          <Sparkles className="size-3" strokeWidth={1.5} />
          {t("changeWithAI")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" sideOffset={8}>
        <div className="flex items-center gap-0.5 pb-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Напишите, что нужно сделать..."
            className="border-none bg-muted focus-visible:ring-0 h-9"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-9"
            onClick={handleCustomPromptSubmit}
            disabled={isLoading || !customPrompt.trim() || !selectedText}
          >
            {isLoading ? (
              <Loader className="size-4 animate-spin" strokeWidth={1.5} />
            ) : (
              <ArrowRight className="size-4" strokeWidth={1.5} />
            )}
          </Button>
        </div>
        {COMMANDS.map((command) => (
          <DropdownMenuItem
            key={command.id}
            onFocus={() => {
              inputRef.current?.focus();
            }}
            className="px-2 py-2 rounded-md"
            onClick={(e) => {
              e.preventDefault();
              if (isLoading) return;

              setIsLoading(true);
              onSelect(command.id);
            }}
          >
            <command.icon className="size-4" strokeWidth={1.5} />
            <span>{command.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
