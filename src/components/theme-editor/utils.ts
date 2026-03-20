import type { Theme, ThemeColors } from "@/types";
import type { ThemeFormData } from "./types";
import { DEFAULT_THEME_COLORS } from "./constants";

// Memoization of loaded fonts
const loadedFonts = new Set<string>();
// Memoization of loaded preview fonts (only Aa characters)
const loadedPreviewFonts = new Set<string>();

export const ensureGoogleFontLoaded = (fontFamily?: string) => {
  if (!fontFamily) return;
  const primaryName = fontFamily.split(",")[0]?.trim();
  if (!primaryName) return;

  // Check if font is already loaded
  if (loadedFonts.has(primaryName)) return;

  const id = `gf-${primaryName.replace(/\s+/g, "-").toLowerCase()}`;
  if (typeof document === "undefined") return;
  if (document.getElementById(id)) {
    loadedFonts.add(primaryName);
    return;
  }

  const familyParam = primaryName.replace(/\s+/g, "+");
  const href = `https://fonts.googleapis.com/css2?family=${familyParam}:wght@400;600;700&display=swap&subset=cyrillic`;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  link.onload = () => loadedFonts.add(primaryName);
  document.head.appendChild(link);
};

// Load Google Font with minimal subset (only "Aa" characters) for theme previews
// Uses a unique font-family name to prevent conflicts with main editor fonts
export const ensureGoogleFontPreviewLoaded = (fontFamily?: string) => {
  if (!fontFamily) return;
  const primaryName = fontFamily.split(",")[0]?.trim();
  if (!primaryName) return;

  // Check if preview font is already loaded
  if (loadedPreviewFonts.has(primaryName)) return;

  const id = `gf-preview-${primaryName.replace(/\s+/g, "-").toLowerCase()}`;
  if (typeof document === "undefined") return;
  if (document.getElementById(id)) {
    loadedPreviewFonts.add(primaryName);
    return;
  }

  const familyParam = primaryName.replace(/\s+/g, "+");
  // Use text=AaАа parameter to load only A, a (Latin) and А, а (Cyrillic) characters
  const href = `https://fonts.googleapis.com/css2?family=${familyParam}&text=AaАа&display=swap`;
  
  // Fetch the font CSS and modify it to use a unique font-family name
  fetch(href)
    .then((response) => response.text())
    .then((cssText) => {
      // Create a unique preview font name to avoid conflicts
      const previewFontName = `'${primaryName} Preview'`;
      
      // Modify CSS to use unique font-family name
      const modifiedCss = cssText.replace(
        /font-family:\s*['"]?([^'";]+)['"]?/g,
        () => `font-family: ${previewFontName}`
      );

      // Inject modified CSS
      const style = document.createElement("style");
      style.id = id;
      style.textContent = modifiedCss;
      document.head.appendChild(style);
      loadedPreviewFonts.add(primaryName);
    })
    .catch((error) => {
      console.error("Failed to load preview font:", error);
    });
};

// Helper for getting value with fallback
const getValueWithFallback = <T>(value: T | undefined, fallback: T): T => {
  return value !== undefined ? value : fallback;
};

export const convertFormDataToTheme = (
  data: ThemeFormData
): Omit<Theme, "id"> => {
  const colors: ThemeColors = {
    background: data.backgroundColor,
    foreground: data.foregroundColor,
    accent: data.accentColor,
    card: {
      background: getValueWithFallback(
        data.cardBackgroundColor,
        DEFAULT_THEME_COLORS.cardBackgroundColor
      ),
      foreground: getValueWithFallback(
        data.cardForegroundColor,
        DEFAULT_THEME_COLORS.cardForegroundColor
      ),
      borderColor: getValueWithFallback(
        data.cardBorderColor,
        DEFAULT_THEME_COLORS.cardBorderColor
      ),
    },
    table: {
      borderColor: getValueWithFallback(
        data.tableBorderColor,
        DEFAULT_THEME_COLORS.tableBorderColor
      ),
      rowBackground: getValueWithFallback(
        data.tableRowBackground,
        DEFAULT_THEME_COLORS.tableRowBackground
      ),
      headerBackground: getValueWithFallback(
        data.tableHeaderBackground,
        DEFAULT_THEME_COLORS.tableHeaderBackground
      ),
      headerFontColor:
        data.foregroundColor || DEFAULT_THEME_COLORS.foregroundColor,
    },
    chart: [
      getValueWithFallback(
        data.chartColor1 || data.accentColor,
        DEFAULT_THEME_COLORS.chartColor1
      ),
      getValueWithFallback(data.chartColor2, DEFAULT_THEME_COLORS.chartColor2),
      getValueWithFallback(data.chartColor3, DEFAULT_THEME_COLORS.chartColor3),
      getValueWithFallback(data.chartColor4, DEFAULT_THEME_COLORS.chartColor4),
      getValueWithFallback(data.chartColor5, DEFAULT_THEME_COLORS.chartColor5),
    ],
    smartLayout: {
      items: [
        getValueWithFallback(
          data.smartLayoutItem1 || data.accentColor,
          DEFAULT_THEME_COLORS.smartLayoutItem1
        ),
        getValueWithFallback(
          data.smartLayoutItem2,
          DEFAULT_THEME_COLORS.smartLayoutItem2
        ),
        getValueWithFallback(
          data.smartLayoutItem3,
          DEFAULT_THEME_COLORS.smartLayoutItem3
        ),
        getValueWithFallback(
          data.smartLayoutItem4,
          DEFAULT_THEME_COLORS.smartLayoutItem4
        ),
      ],
      statFill: getValueWithFallback(
        data.smartLayoutStatFill || data.accentColor,
        DEFAULT_THEME_COLORS.smartLayoutStatFill
      ),
      statEmpty: getValueWithFallback(
        data.smartLayoutStatEmpty,
        DEFAULT_THEME_COLORS.smartLayoutStatEmpty
      ),
      borderColor: getValueWithFallback(
        data.smartLayoutBorderColor,
        DEFAULT_THEME_COLORS.smartLayoutBorderColor
      ),
    },
  };

  return {
    name: data.name,
    previewUrl: "/themes/default.jpg",
    colors,
    fontFamily: data.fontFamily,
    fontFamilyHeader: data.fontFamilyHeader || null,
    fontSizes: null,
    fontWeights: null,
    imageMaskUrl: null,
    backgroundImageUrl: null,
    isCorporate: false,
    isPublic: data.isPublic,
    assets: {
      backgroundImageUrl: data.backgroundImageUrls?.length
        ? data.backgroundImageUrls
        : undefined,
      imageUrl: data.slideImageUrls?.length ? data.slideImageUrls : undefined,
    },
  };
};
