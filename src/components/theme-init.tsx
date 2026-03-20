
import { memo, useMemo } from "react";
import { useAtomValue } from "jotai";
import { presentationAtom } from "@/lib/hooks/use-presentation";
import { useTheme } from "@/lib/hooks/use-theme";

const ThemeInit = () => {
  const presentation = useAtomValue(presentationAtom);
  const { theme, isLoading, error } = useTheme(presentation?.themeId || null);
  const fontWeights = useMemo(() => {
    if (!theme?.fontWeights?.normal || !theme?.fontWeights?.bold) return "";

    return `:wght@${theme?.fontWeights?.normal}..${theme?.fontWeights?.bold}`;
  }, [theme]);

  if (isLoading) {
    return (
      <style>{`
        :root {
          /* Fallback styles while theme is loading */
          --slide-background: #ffffff;
          --slide-foreground: #000000;
          --slide-accent: #3b82f6;
          --slide-font-family: "Inter", sans-serif;
          --slide-font-family-header: "Inter", sans-serif;
        }
      `}</style>
    );
  }

  if (error || !theme) {
    return (
      <style>{`
        :root {
          /* Fallback styles for error state */
          --slide-background: #ffffff;
          --slide-foreground: #000000;
          --slide-accent: #3b82f6;
          --slide-font-family: "Inter", sans-serif;
          --slide-font-family-header: "Inter", sans-serif;
        }
      `}</style>
    );
  }

  return (
    <style data-theme={theme.id}>{`
      ${!theme.isCorporate
        ? `@import url("https://fonts.googleapis.com/css2?family=${theme.fontFamily.replaceAll(
            " ",
            "+"
          )}${fontWeights}&display=swap");`
        : ""}

      ${!theme.isCorporate && theme.fontFamilyHeader
        ? `@import url("https://fonts.googleapis.com/css2?family=${theme.fontFamilyHeader.replaceAll(
            " ",
            "+"
          )}${fontWeights}&display=swap");`
        : ""}

      :root {
        --slide-background: ${theme.backgroundImageUrl
          ? `url(${theme.backgroundImageUrl})`
          : theme.colors.background};
        --slide-foreground: ${theme.colors.foreground};
        --slide-accent: ${theme.colors.accent};
        --slide-font-family: ${theme.fontFamily};
        --slide-font-family-header: ${theme.fontFamilyHeader ??
        theme.fontFamily};

        --slide-card-background: ${theme?.colors?.card?.background};
        --slide-card-foreground: ${theme?.colors?.card?.foreground};
        --slide-card-border-color: ${theme?.colors?.card?.borderColor};

        --slide-table-border-color: ${theme?.colors?.table?.borderColor ||
        theme.colors.foreground};
        --slide-table-row-background: ${theme?.colors?.table?.rowBackground ||
        theme.colors.background};
        --slide-table-header-background: ${theme?.colors?.table
          ?.headerBackground || theme.colors.foreground};
        --slide-table-header-font-color: ${theme?.colors?.table
          ?.headerFontColor || theme.colors.background};

        ${theme?.colors?.smartLayout?.items
          ? theme.colors.smartLayout.items
              .map(
                (color, index) =>
                  `--slide-smart-layout-color-${index}: ${color};`
              )
              .join("\n")
          : ""}

        --slide-smart-layout-border-color: ${theme?.colors?.smartLayout
          ?.borderColor};
        --slide-smart-layout-stat-fill: ${theme?.colors?.smartLayout?.statFill};
        --slide-smart-layout-stat-empty: ${theme?.colors?.smartLayout
          ?.statEmpty};

        ${theme?.fontSizes
          ? Object.entries(theme.fontSizes)
              .map(([key, value]) => `--slide-${key}-font-size: ${value}em;`)
              .join("\n")
          : ""}

        --slide-image-mask-url: ${theme?.imageMaskUrl
          ? `url(${theme.imageMaskUrl})`
          : "none"};

        ${theme?.colors?.themeLayouts
          ? Object.entries(theme.colors.themeLayouts)
              .map(([layout, settings]) => {
                const vars = [];

                if (settings.colors?.foreground) {
                  vars.push(
                    `--slide-layout-${layout}-foreground: ${settings.colors.foreground};`
                  );
                }

                if (settings.backgroundImageUrl) {
                  vars.push(
                    `--slide-layout-${layout}-background-image: url(${settings.backgroundImageUrl});`
                  );
                }

                if (settings.padding) {
                  if (settings.padding.top) {
                    vars.push(
                      `--slide-layout-${layout}-padding-top: ${settings.padding.top};`
                    );
                  }
                  if (settings.padding.right) {
                    vars.push(
                      `--slide-layout-${layout}-padding-right: ${settings.padding.right};`
                    );
                  }
                  if (settings.padding.bottom) {
                    vars.push(
                      `--slide-layout-${layout}-padding-bottom: ${settings.padding.bottom};`
                    );
                  }
                  if (settings.padding.left) {
                    vars.push(
                      `--slide-layout-${layout}-padding-left: ${settings.padding.left};`
                    );
                  }
                }

                return vars.join("\n");
              })
              .join("\n")
          : ""}
      }
    `}</style>
  );
};

export default memo(ThemeInit);
