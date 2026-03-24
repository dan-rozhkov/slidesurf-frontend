export type ChartPalette = {
  id: string;
  name: string;
  colors: string[];
};

export const DEFAULT_CHART_COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#0088fe",
];

export const CHART_PALETTES: ChartPalette[] = [
  { id: "vibrant", name: "Яркая", colors: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"] },
  { id: "pastel", name: "Пастельная", colors: ["#FFB3BA", "#BAFFC9", "#BAE1FF", "#FFFFBA", "#E8BAFF"] },
  { id: "ocean", name: "Океан", colors: ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"] },
  { id: "forest", name: "Лес", colors: ["#606C38", "#283618", "#DDA15E", "#BC6C25", "#FEFAE0"] },
  { id: "sunset", name: "Закат", colors: ["#F94144", "#F3722C", "#F8961E", "#F9C74F", "#90BE6D"] },
  { id: "corporate", name: "Деловая", colors: ["#003F5C", "#58508D", "#BC5090", "#FF6361", "#FFA600"] },
  { id: "neon", name: "Неоновая", colors: ["#00F5D4", "#00BBF9", "#FEE440", "#F15BB5", "#9B5DE5"] },
  { id: "earth", name: "Земля", colors: ["#8B5E3C", "#D4A373", "#CCD5AE", "#E9EDC9", "#FAEDCD"] },
  { id: "contrast", name: "Контрастная", colors: ["#1B4332", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"] },
  { id: "monochrome", name: "Моно", colors: ["#2B2D42", "#5C6378", "#8D99AE", "#BFC5D3", "#EDF2F4"] },
];

export function detectActivePalette(colors: string[]): string | null {
  if (!colors.length) return null;
  for (const palette of CHART_PALETTES) {
    if (
      colors.length === palette.colors.length &&
      colors.every((c, i) => c === palette.colors[i])
    ) {
      return palette.id;
    }
  }
  return null;
}
