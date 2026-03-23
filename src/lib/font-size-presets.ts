import type { FontSizePreset } from "@/types";

type FontKeys = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

type PresetConfig = {
  fontScale: number;
  lineHeights: Record<FontKeys, number> | null;
};

export const FONT_SIZE_PRESETS: Record<FontSizePreset, PresetConfig> = {
  S: {
    fontScale: 0.85,
    lineHeights: {
      h1: 1.1,
      h2: 1.1,
      h3: 1.1,
      h4: 1.1,
      h5: 1.1,
      h6: 1.1,
      p: 1.3,
    },
  },
  M: { fontScale: 1.0, lineHeights: null },
  L: { fontScale: 1.15, lineHeights: null },
};

export const DEFAULT_FONT_SIZES: Record<FontKeys, number> = {
  h1: 2,
  h2: 1.5,
  h3: 1.2,
  h4: 1,
  h5: 0.8,
  h6: 0.6,
  p: 1,
};

export const DEFAULT_LINE_HEIGHTS: Record<FontKeys, number> = {
  h1: 1.2,
  h2: 1.2,
  h3: 1.2,
  h4: 1.2,
  h5: 1.2,
  h6: 1.2,
  p: 1.5,
};
