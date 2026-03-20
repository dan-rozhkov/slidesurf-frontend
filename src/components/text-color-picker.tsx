
import { useState, useMemo } from "react";
import { Editor } from "@tiptap/core";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePresentationAtom } from "@/lib/hooks/use-presentation";
import { useTheme } from "@/lib/hooks/use-theme";
import { useScopedI18n } from "@/lib/locales/client";

type TextColorPickerProps = {
  editor: Editor;
};

export function TextColorPicker({ editor }: TextColorPickerProps) {
  const t = useScopedI18n("editor");
  const [open, setOpen] = useState(false);
  const [presentationAtom] = usePresentationAtom();
  const { theme } = useTheme(presentationAtom?.themeId || null);

  const getCurrentColor = () => {
    const { color } = editor.getAttributes("textStyle");
    return color || null;
  };

  const setTextColor = (color: string | null) => {
    if (color) {
      editor.chain().focus().setMark("textStyle", { color }).run();
    } else {
      editor.chain().focus().unsetMark("textStyle").run();
    }
    setOpen(false);
  };

  const uniqueColors = useMemo(() => {
    if (!theme) {
      return [];
    }

    const themeColors = [
      { name: "Foreground", value: theme.colors.foreground },
      { name: "Accent", value: theme.colors.accent },
      { name: "Background", value: theme.colors.background },
    ];

    if (theme.colors.card) {
      themeColors.push({
        name: "Card Foreground",
        value: theme.colors.card.foreground,
      });
    }

    if (
      theme.colors.smartLayout?.items &&
      theme.colors.smartLayout.items.length > 0
    ) {
      theme.colors.smartLayout.items.forEach((color, index) => {
        themeColors.push({
          name: `Smart Layout ${index + 1}`,
          value: color,
        });
      });
    }

    if (theme.colors.chart && theme.colors.chart.length > 0) {
      theme.colors.chart.forEach((color, index) => {
        themeColors.push({
          name: `Chart ${index + 1}`,
          value: color,
        });
      });
    }

    // Filter unique colors by value
    return themeColors.filter(
      (color, index, self) =>
        index === self.findIndex((c) => c.value === color.value)
    );
  }, [theme]);

  if (!theme) {
    return null;
  }

  const currentColor = getCurrentColor();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn({
            "p-0 size-8 relative": true,
            "bg-gray-100 hover:bg-gray-100 dark:bg-neutral-700 dark:hover:bg-neutral-700":
              currentColor,
          })}
        >
          <Palette className="size-3" strokeWidth={1.5} />
          {currentColor && (
            <div
              className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-1 rounded-full"
              style={{ backgroundColor: currentColor }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start" sideOffset={8}>
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium text-muted-foreground px-1">
            {t("themeColors")}
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            <button
              onClick={() => setTextColor(null)}
              className={cn(
                "size-7 rounded-md border flex items-center justify-center",
                !currentColor
                  ? "border-primary"
                  : "border-border hover:border-muted-foreground"
              )}
              title={t("defaultColor")}
            >
              <div className="size-5 rounded-sm bg-gradient-to-br from-transparent via-transparent to-transparent relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-px h-5 bg-red-500 rotate-45" />
                </div>
              </div>
            </button>
            {uniqueColors.map((color, index) => (
              <button
                key={index}
                onClick={() => setTextColor(color.value)}
                className={cn(
                  "size-7 rounded-md border",
                  currentColor === color.value
                    ? "border-primary"
                    : "border-border hover:border-muted-foreground"
                )}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
