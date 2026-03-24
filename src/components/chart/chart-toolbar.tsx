
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChartType } from "@/types";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ChartArea,
  ChartBarBig,
  ChartColumnBig,
  ChartLine,
  ChartPie,
  ChartCandlestick,
} from "lucide-react";
import {
  IconChartDonut3,
  IconChartRadar,
  IconRadar2,
} from "@tabler/icons-react";
import { ColorPicker } from "@/components/ui/color-picker";

type ChartToolbarProps = {
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  showValues: boolean;
  onToggleValues: () => void;
  stacked: boolean;
  onToggleStacked: () => void;
  colors: string[];
  onColorsChange: (colors: string[]) => void;
  seriesCount: number;
  themeColors: string[];
};

const chartTypes = [
  { value: "bar", label: "Столбчатая диаграмма", icon: ChartColumnBig },
  { value: "h-bar", label: "Горизонтальная диаграмма", icon: ChartBarBig },
  { value: "line", label: "Линейный график", icon: ChartLine },
  { value: "pie", label: "Круговая диаграмма", icon: ChartPie },
  { value: "donut", label: "Кольцевая диаграмма", icon: IconChartDonut3 },
  { value: "area", label: "Диаграмма с областями", icon: ChartArea },
  { value: "radar", label: "Радар-диаграмма", icon: IconChartRadar },
  { value: "radial-bar", label: "Радиальный график", icon: IconRadar2 },
  { value: "waterfall", label: "Каскадная диаграмма", icon: ChartCandlestick },
] as const;

export const ChartToolbar: React.FC<ChartToolbarProps> = ({
  chartType,
  onChartTypeChange,
  showLabels,
  onToggleLabels,
  showGrid,
  onToggleGrid,
  showValues,
  onToggleValues,
  stacked,
  onToggleStacked,
  colors,
  onColorsChange,
  seriesCount,
  themeColors,
}) => {
  return (
    <div className="flex flex-col gap-4 p-8 bg-accent rounded-xl">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium">Тип графика</h3>
        <ToggleGroup
          type="single"
          value={chartType}
          onValueChange={(value) =>
            value && onChartTypeChange(value as ChartType)
          }
          className="flex flex-wrap gap-1 items-center justify-start"
        >
          {chartTypes.map(({ value, label, icon: Icon }) => (
            <ToggleGroupItem
              key={value}
              variant="outline"
              value={value}
              aria-label={label}
              className="size-12 aspect-square p-0 data-[state=on]:border-primary data-[state=on]:border-2 transition-none"
            >
              <Icon strokeWidth={1.5} className="size-10" />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm flex items-center gap-2">
          <Checkbox
            checked={showLabels}
            onCheckedChange={onToggleLabels}
            className="w-4 h-4"
          />
          Показывать подписи
        </Label>

        <Label className="text-sm flex items-center gap-2">
          <Checkbox
            checked={showGrid}
            onCheckedChange={onToggleGrid}
            className="w-4 h-4"
          />
          Показывать сетку
        </Label>

        <Label className="text-sm flex items-center gap-2">
          <Checkbox
            checked={showValues}
            onCheckedChange={onToggleValues}
            className="w-4 h-4"
          />
          Показывать значения
        </Label>

        {(chartType === "bar" ||
          chartType === "h-bar" ||
          chartType === "area") && (
          <Label className="text-sm flex items-center gap-2">
            <Checkbox
              checked={stacked}
              onCheckedChange={onToggleStacked}
              className="w-4 h-4"
            />
            Стопка (stacked)
          </Label>
        )}
      </div>

      {seriesCount > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium">Цвета серий</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: seriesCount }, (_, i) => (
              <ColorPicker
                key={i}
                value={colors[i] || themeColors[i % themeColors.length] || "#8884d8"}
                onChange={(hex) => {
                  const newColors = [...colors];
                  while (newColors.length < i) {
                    newColors.push(themeColors[newColors.length % themeColors.length] || "#8884d8");
                  }
                  newColors[i] = hex;
                  onColorsChange(newColors);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
