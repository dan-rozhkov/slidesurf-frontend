import { useMemo } from "react";
import { Slide, SlideLayout, Theme } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Return type of useSlideStyles hook
 * Contains all prepared classes and styles for slide rendering
 */
export type SlideStyles = {
  /** Classes for the main slide container */
  containerClasses: string;
  /** Inline styles for the main slide container */
  containerStyle: React.CSSProperties;
  /** Classes for the content wrapper (used in layouts with images) */
  contentWrapperClasses: string;
  /** Classes for the editor content (includes vertical alignment) */
  editorClasses: string;
};

interface UseSlideStylesProps {
  /** Slide data with layout, alignment, and background settings */
  slide: Slide;
  /** Theme configuration for colors, fonts, and layout-specific styling */
  theme?: Theme | null;
  /** Whether the slide is currently active/selected */
  isActive?: boolean;
  /** Whether the slide is in presentation mode */
  isPresenting?: boolean;
}

// Constants
const SLIDE_DIMENSIONS = {
  width: "60em",
  height: "33.75em",
} as const;

const DEFAULT_PADDING = "2em";

export const IMAGE_LAYOUTS = [
  SlideLayout.TOP_IMAGE,
  SlideLayout.LEFT_IMAGE,
  SlideLayout.RIGHT_IMAGE,
] as const;

/**
 * Get theme layout-specific settings
 */
const getLayoutSettings = (
  theme: Theme | null | undefined,
  layout?: SlideLayout
) => {
  if (!layout) return undefined;
  return theme?.colors?.themeLayouts?.[layout];
};

/**
 * Check if layout is an image-based layout
 */
const isImageLayout = (layout?: SlideLayout): boolean => {
  if (!layout) return false;
  return (IMAGE_LAYOUTS as readonly SlideLayout[]).includes(layout);
};

/**
 * Calculate slide background with priority system:
 * 1. Slide-specific background image
 * 2. Theme layout-specific background
 * 3. Global theme background image
 * 4. Theme background color
 * 5. CSS variable fallback
 */
const getSlideBackground = (slide: Slide): string | undefined => {
  if (slide?.backgroundImageUrl) {
    return `url(${slide.backgroundImageUrl})`;
  }

  return undefined;
};

/**
 * Build padding string from padding object
 */
const buildPaddingString = (padding: {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}): string | null => {
  const { top, right, bottom, left } = padding;
  const parts = [top, right, bottom, left].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : null;
};

/**
 * Calculate padding based on theme layout settings or layout type
 */
const getSlidePadding = (
  slide: Slide,
  theme: Theme | null | undefined
): string => {
  const layoutSettings = getLayoutSettings(theme, slide.layout);

  // Use theme layout-specific padding if available
  if (layoutSettings?.padding) {
    const paddingString = buildPaddingString(layoutSettings.padding);

    if (paddingString) {
      return paddingString;
    }
  }

  // Image-based layouts have no default padding
  return isImageLayout(slide.layout) ? "0" : DEFAULT_PADDING;
};

/**
 * Get container classes based on slide state and layout
 */
const getContainerClasses = (
  slide: Slide,
  isActive: boolean,
  isPresenting: boolean
): string => {
  return cn(
    "slide flex flex-col",
    isActive && "ring-2 ring-primary",
    isPresenting ? "select-none" : "rounded-lg shadow-lg border border-border",
    {
      "flex-row": slide.layout === SlideLayout.LEFT_IMAGE,
      "flex-row-reverse": slide.layout === SlideLayout.RIGHT_IMAGE,
    }
  );
};

/**
 * Get container inline styles including background, dimensions, and theme colors
 */
const getContainerStyle = (
  slide: Slide,
  theme: Theme | null | undefined
): React.CSSProperties & Record<string, string | number> => {
  const background = getSlideBackground(slide);
  const padding = getSlidePadding(slide, theme);

  const style: React.CSSProperties & Record<string, string | number> = {
    width: SLIDE_DIMENSIONS.width,
    height: SLIDE_DIMENSIONS.height,
    overflow: "hidden",
    padding,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  if (background) {
    style.backgroundImage = background;
  }

  return style;
};

/**
 * Get content wrapper classes (for slides with images)
 */
const getContentWrapperClasses = (slide: Slide): string => {
  return cn("flex h-full w-full", isImageLayout(slide.layout) && "p-[2em]");
};

/**
 * Get editor classes with vertical alignment support
 */
const getEditorClasses = (slide: Slide): string => {
  return cn(
    "flex h-full w-full [&>*]:h-full [&>*]:w-full [&>*]:flex [&>*]:flex-col",
    {
      "[&>*]:justify-start": slide.verticalAlign === "top",
      "[&>*]:justify-center": slide.verticalAlign === "center",
      "[&>*]:justify-end": slide.verticalAlign === "bottom",
    }
  );
};

/**
 * Hook for preparing all styles and classes for slide rendering
 * based on slide settings and theme configuration
 *
 * Features:
 * - Automatic background resolution with priority system
 * - Layout-based styling (padding, flex direction)
 * - Theme integration with layout-specific overrides
 * - Vertical alignment support
 * - State-based styling (active, presenting)
 * - Performance optimized with useMemo
 *
 */
export function useSlideStyles({
  slide,
  theme,
  isActive = false,
  isPresenting = false,
}: UseSlideStylesProps): SlideStyles {
  return useMemo(
    () => ({
      containerClasses: getContainerClasses(slide, isActive, isPresenting),
      containerStyle: getContainerStyle(slide, theme),
      contentWrapperClasses: getContentWrapperClasses(slide),
      editorClasses: getEditorClasses(slide),
    }),
    [slide, theme, isActive, isPresenting]
  );
}
