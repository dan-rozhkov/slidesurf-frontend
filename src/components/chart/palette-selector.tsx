import { CHART_PALETTES, detectActivePalette } from "@/lib/constants/chart-palettes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PaletteSelectorProps = {
  colors: string[];
  onColorsChange: (colors: string[]) => void;
  themeColors: string[];
};

function ColorSwatches({ colors }: { colors: string[] }) {
  return (
    <div className="flex gap-1">
      {colors.slice(0, 5).map((color, i) => (
        <div
          key={i}
          className="size-4 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

export const PaletteSelector: React.FC<PaletteSelectorProps> = ({
  colors,
  onColorsChange,
  themeColors,
}) => {
  const activePaletteId = detectActivePalette(colors);
  const value = colors.length === 0 ? "theme" : activePaletteId ?? "theme";

  const handleChange = (id: string) => {
    if (id === "theme") {
      onColorsChange([]);
      return;
    }
    const palette = CHART_PALETTES.find((p) => p.id === id);
    if (palette) {
      onColorsChange(palette.colors);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-medium">Палитра цветов</h3>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="theme">
            <div className="flex items-center gap-2">
              <ColorSwatches colors={themeColors} />
              <span>Цвета темы</span>
            </div>
          </SelectItem>
          {CHART_PALETTES.map((palette) => (
            <SelectItem key={palette.id} value={palette.id}>
              <div className="flex items-center gap-2">
                <ColorSwatches colors={palette.colors} />
                <span>{palette.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
