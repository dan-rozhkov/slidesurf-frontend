
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Theme } from "@/types";
import { useScopedI18n } from "@/lib/locales/client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LetterText, Loader, Palette, ImageIcon, Settings } from "lucide-react";

import { ThemePreview } from "./theme-preview";
import type { ThemeFormData } from "./types";
import { convertFormDataToTheme, ensureGoogleFontLoaded } from "./utils";
import { ColorsSection } from "./sections/colors-section";
import { FontsSection } from "./sections/fonts-section";
import { MainSection } from "./sections/main-section";
import { AssetsSection } from "./sections/assets-section";
import { DEFAULT_THEME_COLORS } from "./constants";

// Хелпер для получения значения с fallback
const getValueWithFallback = <T,>(
  value: T | undefined | null,
  fallback: T
): T => {
  return value !== undefined && value !== null ? value : fallback;
};

const computeDefaults = (
  incomingTheme: Partial<Theme> | undefined,
  newThemeLabel: string
): ThemeFormData => {
  const themeColors = incomingTheme?.colors;

  return {
    name: getValueWithFallback(incomingTheme?.name, newThemeLabel),
    fontFamily: getValueWithFallback(incomingTheme?.fontFamily, "Inter"),
    fontFamilyHeader: getValueWithFallback(incomingTheme?.fontFamilyHeader, ""),
    isPublic: true, // Default to public
    backgroundColor: getValueWithFallback(
      themeColors?.background,
      DEFAULT_THEME_COLORS.backgroundColor
    ),
    foregroundColor: getValueWithFallback(
      themeColors?.foreground,
      DEFAULT_THEME_COLORS.foregroundColor
    ),
    accentColor: getValueWithFallback(
      themeColors?.accent,
      DEFAULT_THEME_COLORS.accentColor
    ),
    cardBackgroundColor: getValueWithFallback(
      themeColors?.card?.background,
      DEFAULT_THEME_COLORS.cardBackgroundColor
    ),
    cardForegroundColor: getValueWithFallback(
      themeColors?.card?.foreground,
      DEFAULT_THEME_COLORS.cardForegroundColor
    ),
    cardBorderColor: getValueWithFallback(
      themeColors?.card?.borderColor,
      DEFAULT_THEME_COLORS.cardBorderColor
    ),
    // Table defaults
    tableBorderColor: getValueWithFallback(
      themeColors?.table?.borderColor,
      DEFAULT_THEME_COLORS.tableBorderColor
    ),
    tableRowBackground: getValueWithFallback(
      themeColors?.table?.rowBackground,
      DEFAULT_THEME_COLORS.tableRowBackground
    ),
    tableHeaderBackground: getValueWithFallback(
      themeColors?.table?.headerBackground,
      DEFAULT_THEME_COLORS.tableHeaderBackground
    ),
    // Smart layout defaults
    smartLayoutItem1: getValueWithFallback(
      themeColors?.smartLayout?.items?.[0],
      DEFAULT_THEME_COLORS.smartLayoutItem1
    ),
    smartLayoutItem2: getValueWithFallback(
      themeColors?.smartLayout?.items?.[1],
      DEFAULT_THEME_COLORS.smartLayoutItem2
    ),
    smartLayoutItem3: getValueWithFallback(
      themeColors?.smartLayout?.items?.[2],
      DEFAULT_THEME_COLORS.smartLayoutItem3
    ),
    smartLayoutItem4: getValueWithFallback(
      themeColors?.smartLayout?.items?.[3],
      DEFAULT_THEME_COLORS.smartLayoutItem4
    ),
    smartLayoutStatFill: getValueWithFallback(
      themeColors?.smartLayout?.statFill,
      DEFAULT_THEME_COLORS.smartLayoutStatFill
    ),
    smartLayoutStatEmpty: getValueWithFallback(
      themeColors?.smartLayout?.statEmpty,
      DEFAULT_THEME_COLORS.smartLayoutStatEmpty
    ),
    smartLayoutBorderColor: getValueWithFallback(
      themeColors?.smartLayout?.borderColor,
      DEFAULT_THEME_COLORS.smartLayoutBorderColor
    ),
    // Chart defaults
    chartColor1: getValueWithFallback(
      themeColors?.chart?.[0] || themeColors?.accent,
      DEFAULT_THEME_COLORS.chartColor1
    ),
    chartColor2: getValueWithFallback(
      themeColors?.chart?.[1],
      DEFAULT_THEME_COLORS.chartColor2
    ),
    chartColor3: getValueWithFallback(
      themeColors?.chart?.[2],
      DEFAULT_THEME_COLORS.chartColor3
    ),
    chartColor4: getValueWithFallback(
      themeColors?.chart?.[3],
      DEFAULT_THEME_COLORS.chartColor4
    ),
    chartColor5: getValueWithFallback(
      themeColors?.chart?.[4],
      DEFAULT_THEME_COLORS.chartColor5
    ),
    // Assets defaults
    backgroundImageUrls: incomingTheme?.assets?.backgroundImageUrl || [],
    slideImageUrls: incomingTheme?.assets?.imageUrl || [],
  };
};

type ThemeEditorProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  theme?: Partial<Theme>;
  onSave: (theme: Theme) => Promise<void> | void;
};

export function ThemeEditor({
  isOpen,
  onOpenChange,
  theme,
  onSave,
}: ThemeEditorProps) {
  const t = useScopedI18n("themes.editor");
  const [isSaving, setIsSaving] = useState(false);

  const colorValidation = z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, t("invalidColorFormat"));

  const themeFormSchema = z.object({
    name: z.string().min(1, t("nameRequired")),
    fontFamily: z.string().min(1, t("fontRequired")),
    fontFamilyHeader: z.string().optional(),
    isPublic: z.boolean(),

    backgroundColor: colorValidation,
    foregroundColor: colorValidation,
    accentColor: colorValidation,

    cardBackgroundColor: colorValidation.optional(),
    cardForegroundColor: colorValidation.optional(),
    cardBorderColor: colorValidation.optional(),

    // Table colors
    tableBorderColor: colorValidation.optional(),
    tableRowBackground: colorValidation.optional(),
    tableHeaderBackground: colorValidation.optional(),

    // Smart layout colors
    smartLayoutItem1: colorValidation.optional(),
    smartLayoutItem2: colorValidation.optional(),
    smartLayoutItem3: colorValidation.optional(),
    smartLayoutItem4: colorValidation.optional(),
    smartLayoutStatFill: colorValidation.optional(),
    smartLayoutStatEmpty: colorValidation.optional(),
    smartLayoutBorderColor: colorValidation.optional(),

    // Chart colors
    chartColor1: colorValidation.optional(),
    chartColor2: colorValidation.optional(),
    chartColor3: colorValidation.optional(),
    chartColor4: colorValidation.optional(),
    chartColor5: colorValidation.optional(),

    // Assets
    backgroundImageUrls: z.array(z.string()).optional(),
    slideImageUrls: z.array(z.string()).optional(),
  });

  const initialDefaultsRef = useRef<ThemeFormData>(
    computeDefaults(theme, t("newTheme"))
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
    control,
  } = useForm<ThemeFormData>({
    resolver: zodResolver(themeFormSchema),
    defaultValues: initialDefaultsRef.current,
  });

  // Reset form defaults when incoming theme changes (edit/copy)
  useEffect(() => {
    reset(computeDefaults(theme, t("newTheme")));
  }, [theme, reset, t]);

  const currentValues = watch();

  useEffect(() => {
    ensureGoogleFontLoaded(currentValues.fontFamily);
    ensureGoogleFontLoaded(currentValues.fontFamilyHeader);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValues.fontFamily, currentValues.fontFamilyHeader]);

  const handleColorChange = (fieldName: keyof ThemeFormData, value: string) => {
    setValue(fieldName, value);
  };

  const handleBackgroundImagesChange = (urls: string[]) => {
    setValue("backgroundImageUrls", urls, { shouldDirty: true });
  };

  const handleSlideImagesChange = (urls: string[]) => {
    setValue("slideImageUrls", urls, { shouldDirty: true });
  };

  const onSubmit = async (data: ThemeFormData) => {
    setIsSaving(true);

    try {
      const themeData = convertFormDataToTheme(data);
      await onSave(themeData as Theme);

      toast.success(t("themeCreatedSuccess"));
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving theme:", error);
      toast.error(t("themeCreateError"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[90vh] overflow-hidden flex flex-col p-0"
      >
        <SheetHeader className="p-6 pb-0">
          <SheetTitle>{t("title")}</SheetTitle>
        </SheetHeader>

        <div className="grid grid-cols-2 overflow-hidden">
          <div className="col-span-1 h-full overflow-y-auto px-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col h-full"
            >
              <Tabs className="flex-1" defaultValue="colors">
                <TabsList className="w-full h-auto grid-cols-4">
                  <TabsTrigger
                    className="w-full flex-col py-2 gap-1"
                    value="colors"
                  >
                    <Palette className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    <span className="text-xs">{t("colors")}</span>
                  </TabsTrigger>
                  <TabsTrigger
                    className="w-full flex-col py-2 gap-1"
                    value="fonts"
                  >
                    <LetterText className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    <span className="text-xs">{t("fonts")}</span>
                  </TabsTrigger>
                  <TabsTrigger
                    className="w-full flex-col py-2 gap-1"
                    value="assets"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    <span className="text-xs">{t("assets")}</span>
                  </TabsTrigger>
                  <TabsTrigger
                    className="w-full flex-col py-2 gap-1"
                    value="main"
                  >
                    <Settings className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    <span className="text-xs">{t("main")}</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="colors" className="pt-2">
                  <ColorsSection
                    currentValues={currentValues}
                    errors={errors}
                    onChange={handleColorChange}
                  />
                </TabsContent>

                <TabsContent value="fonts" className="pt-2">
                  <FontsSection
                    currentValues={currentValues}
                    errors={errors}
                    setValue={setValue}
                  />
                </TabsContent>

                <TabsContent value="assets" className="pt-2">
                  <AssetsSection
                    currentValues={currentValues}
                    watch={() => watch()}
                    onBackgroundImagesChange={handleBackgroundImagesChange}
                    onSlideImagesChange={handleSlideImagesChange}
                  />
                </TabsContent>

                <TabsContent value="main" className="pt-2">
                  <MainSection
                    register={register}
                    errors={errors}
                    control={control}
                  />
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 py-4 border-t border-border -mx-6 px-6 justify-end sticky bottom-0 bg-background">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSaving}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader className="size-4 animate-spin" />}
                  {isSaving ? t("saving") : t("saveTheme")}
                </Button>
              </div>
            </form>
          </div>

          <div className="bg-muted overflow-y-auto">
            <ThemePreview themeData={currentValues} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
