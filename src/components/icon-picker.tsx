import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  getIconNames,
  DynamicLucideIcon,
  type IconSize,
  type IconName,
} from "@/lib/utils/lucide-icon-map";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useScopedI18n } from "@/lib/locales/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const POPULAR_ICONS: IconName[] = [
  "star",
  "heart",
  "rocket",
  "zap",
  "target",
  "trophy",
  "lightbulb",
  "shield",
  "check-circle",
  "trending-up",
  "users",
  "globe",
  "lock",
  "clock",
  "bar-chart",
  "settings",
  "code",
  "layers",
  "cpu",
  "database",
  "cloud",
  "wifi",
  "smartphone",
  "mail",
  "calendar",
  "bookmark",
  "flag",
  "award",
  "box",
  "briefcase",
  "compass",
  "eye",
  "gift",
  "map-pin",
  "music",
  "palette",
  "pen-tool",
  "pie-chart",
  "puzzle",
  "refresh-cw",
];

const SIZE_OPTIONS: { value: IconSize; label: string }[] = [
  { value: "sm", label: "S" },
  { value: "md", label: "M" },
  { value: "lg", label: "L" },
  { value: "xl", label: "XL" },
];

const MAX_RESULTS = 60;

export function IconPicker({
  currentIcon,
  currentSize,
  onIconSelect,
  onSizeChange,
}: {
  currentIcon: string;
  currentSize: IconSize;
  onIconSelect: (name: string) => void;
  onSizeChange: (size: IconSize) => void;
}) {
  const [query, setQuery] = useState("");
  const allIcons = getIconNames();
  const t = useScopedI18n("iconPicker");

  const filteredIcons = useMemo(() => {
    if (!query.trim()) return POPULAR_ICONS;
    const q = query.toLowerCase().trim();
    return allIcons.filter((name) => name.includes(q)).slice(0, MAX_RESULTS);
  }, [query, allIcons]);

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex gap-1 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-8 pl-7 text-sm"
            autoFocus
          />
        </div>
        <Select
          value={currentSize}
          onValueChange={(value) => onSizeChange(value as IconSize)}
        >
          <SelectTrigger className="w-[70px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SIZE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-6 gap-1 max-h-[200px] overflow-y-auto">
        {filteredIcons.map((name) => (
          <button
            key={name}
            className={cn(
              "flex items-center justify-center aspect-square rounded hover:bg-muted transition-colors",
              currentIcon === name && "bg-muted"
            )}
            onClick={() => onIconSelect(name)}
            title={name}
          >
            <DynamicLucideIcon name={name} size="md" />
          </button>
        ))}
        {filteredIcons.length === 0 && (
          <p className="col-span-6 text-sm text-muted-foreground text-center py-4">
            {t("noResults")}
          </p>
        )}
      </div>
    </div>
  );
}
