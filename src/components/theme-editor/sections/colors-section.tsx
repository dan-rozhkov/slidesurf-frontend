
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { InputColor } from "@/components/ui/input-color";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScopedI18n } from "@/lib/locales/client";
import type { ThemeFormData } from "../types";
import type { FieldErrors } from "react-hook-form";
import { DEFAULT_THEME_COLORS } from "../constants";

type ColorsSectionProps = {
  currentValues: ThemeFormData;
  errors: FieldErrors<ThemeFormData>;
  onChange: (fieldName: keyof ThemeFormData, value: string) => void;
};

export function ColorsSection({
  currentValues,
  errors,
  onChange,
}: ColorsSectionProps) {
  const t = useScopedI18n("themes.editor");

  return (
    <Accordion type="single" collapsible defaultValue="palette">
      <AccordionItem value="palette">
        <AccordionTrigger>{t("colorPalette")}</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="backgroundColor">{t("backgroundColor")}</Label>
              <div className="flex items-center gap-2">
                <InputColor
                  id="backgroundColor"
                  className="shrink-0 grow-0"
                  value={currentValues.backgroundColor}
                  onChange={(e) => onChange("backgroundColor", e.target.value)}
                />
                <Input
                  value={currentValues.backgroundColor}
                  onChange={(e) => onChange("backgroundColor", e.target.value)}
                  placeholder={DEFAULT_THEME_COLORS.backgroundColor}
                />
              </div>
              {errors.backgroundColor && (
                <p className="text-sm text-red-500">
                  {errors.backgroundColor.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="foregroundColor">{t("textColor")}</Label>
              <div className="flex items-center gap-2">
                <InputColor
                  id="foregroundColor"
                  className="shrink-0 grow-0"
                  value={currentValues.foregroundColor}
                  onChange={(e) => onChange("foregroundColor", e.target.value)}
                />
                <Input
                  value={currentValues.foregroundColor}
                  onChange={(e) => onChange("foregroundColor", e.target.value)}
                  placeholder={DEFAULT_THEME_COLORS.foregroundColor}
                />
              </div>
              {errors.foregroundColor && (
                <p className="text-sm text-red-500">
                  {errors.foregroundColor.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="accentColor">{t("accentColor")}</Label>
              <div className="flex items-center gap-2">
                <InputColor
                  id="accentColor"
                  className="shrink-0 grow-0"
                  value={currentValues.accentColor}
                  onChange={(e) => onChange("accentColor", e.target.value)}
                />
                <Input
                  value={currentValues.accentColor}
                  onChange={(e) => onChange("accentColor", e.target.value)}
                  placeholder={DEFAULT_THEME_COLORS.accentColor}
                />
              </div>
              {errors.accentColor && (
                <p className="text-sm text-red-500">
                  {errors.accentColor.message as string}
                </p>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="cards">
        <AccordionTrigger>{t("cards")}</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="cardBackgroundColor">{t("cardBackground")}</Label>
              <div className="flex items-center gap-2">
                <InputColor
                  id="cardBackgroundColor"
                  className="shrink-0 grow-0"
                  value={
                    currentValues.cardBackgroundColor ||
                    DEFAULT_THEME_COLORS.cardBackgroundColor
                  }
                  onChange={(e) =>
                    onChange("cardBackgroundColor", e.target.value)
                  }
                />
                <Input
                  value={
                    currentValues.cardBackgroundColor ||
                    DEFAULT_THEME_COLORS.cardBackgroundColor
                  }
                  onChange={(e) =>
                    onChange("cardBackgroundColor", e.target.value)
                  }
                  placeholder={DEFAULT_THEME_COLORS.cardBackgroundColor}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardForegroundColor">{t("cardTextColor")}</Label>
              <div className="flex items-center gap-2">
                <InputColor
                  id="cardForegroundColor"
                  value={
                    currentValues.cardForegroundColor ||
                    DEFAULT_THEME_COLORS.cardForegroundColor
                  }
                  onChange={(e) =>
                    onChange("cardForegroundColor", e.target.value)
                  }
                />
                <Input
                  value={
                    currentValues.cardForegroundColor ||
                    DEFAULT_THEME_COLORS.cardForegroundColor
                  }
                  onChange={(e) =>
                    onChange("cardForegroundColor", e.target.value)
                  }
                  placeholder={DEFAULT_THEME_COLORS.cardForegroundColor}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardBorderColor">{t("cardBorder")}</Label>
              <div className="flex items-center gap-2">
                <InputColor
                  id="cardBorderColor"
                  className="shrink-0 grow-0"
                  value={
                    currentValues.cardBorderColor ||
                    DEFAULT_THEME_COLORS.cardBorderColor
                  }
                  onChange={(e) => onChange("cardBorderColor", e.target.value)}
                />
                <Input
                  value={
                    currentValues.cardBorderColor ||
                    DEFAULT_THEME_COLORS.cardBorderColor
                  }
                  onChange={(e) => onChange("cardBorderColor", e.target.value)}
                  placeholder={DEFAULT_THEME_COLORS.cardBorderColor}
                />
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="tables">
        <AccordionTrigger>{t("tables")}</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="tableHeaderBackground">
                {t("tableHeaderBackground")}
              </Label>
              <div className="flex items-center gap-2">
                <InputColor
                  id="tableHeaderBackground"
                  className="shrink-0 grow-0"
                  value={
                    currentValues.tableHeaderBackground ||
                    DEFAULT_THEME_COLORS.tableHeaderBackground
                  }
                  onChange={(e) =>
                    onChange("tableHeaderBackground", e.target.value)
                  }
                />
                <Input
                  value={
                    currentValues.tableHeaderBackground ||
                    DEFAULT_THEME_COLORS.tableHeaderBackground
                  }
                  onChange={(e) =>
                    onChange("tableHeaderBackground", e.target.value)
                  }
                  placeholder={DEFAULT_THEME_COLORS.tableHeaderBackground}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tableRowBackground">
                {t("tableRowBackground")}
              </Label>
              <div className="flex items-center gap-2">
                <InputColor
                  id="tableRowBackground"
                  value={
                    currentValues.tableRowBackground ||
                    DEFAULT_THEME_COLORS.tableRowBackground
                  }
                  onChange={(e) =>
                    onChange("tableRowBackground", e.target.value)
                  }
                />
                <Input
                  value={
                    currentValues.tableRowBackground ||
                    DEFAULT_THEME_COLORS.tableRowBackground
                  }
                  onChange={(e) =>
                    onChange("tableRowBackground", e.target.value)
                  }
                  placeholder={DEFAULT_THEME_COLORS.tableRowBackground}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tableBorderColor">{t("tableBorder")}</Label>
              <div className="flex items-center gap-2">
                <InputColor
                  id="tableBorderColor"
                  value={
                    currentValues.tableBorderColor ||
                    DEFAULT_THEME_COLORS.tableBorderColor
                  }
                  onChange={(e) => onChange("tableBorderColor", e.target.value)}
                />
                <Input
                  value={
                    currentValues.tableBorderColor ||
                    DEFAULT_THEME_COLORS.tableBorderColor
                  }
                  onChange={(e) => onChange("tableBorderColor", e.target.value)}
                  placeholder={DEFAULT_THEME_COLORS.tableBorderColor}
                />
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="smartLayout">
        <AccordionTrigger>{t("smartLayout")}</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="smartLayoutItem1">{t("smartLayoutItem1")}</Label>
              <div className="flex items-center gap-2">
                <InputColor
                  id="smartLayoutItem1"
                  value={
                    currentValues.smartLayoutItem1 ||
                    currentValues.accentColor ||
                    DEFAULT_THEME_COLORS.smartLayoutItem1
                  }
                  onChange={(e) => onChange("smartLayoutItem1", e.target.value)}
                />
                <Input
                  value={
                    currentValues.smartLayoutItem1 ||
                    currentValues.accentColor ||
                    DEFAULT_THEME_COLORS.smartLayoutItem1
                  }
                  onChange={(e) => onChange("smartLayoutItem1", e.target.value)}
                  placeholder={DEFAULT_THEME_COLORS.smartLayoutItem1}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smartLayoutItem2">{t("smartLayoutItem2")}</Label>
              <div className="flex items-center gap-2">
                <InputColor
                  id="smartLayoutItem2"
                  value={
                    currentValues.smartLayoutItem2 ||
                    DEFAULT_THEME_COLORS.smartLayoutItem2
                  }
                  onChange={(e) => onChange("smartLayoutItem2", e.target.value)}
                />
                <Input
                  value={
                    currentValues.smartLayoutItem2 ||
                    DEFAULT_THEME_COLORS.smartLayoutItem2
                  }
                  onChange={(e) => onChange("smartLayoutItem2", e.target.value)}
                  placeholder={DEFAULT_THEME_COLORS.smartLayoutItem2}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smartLayoutItem3">{t("smartLayoutItem3")}</Label>
              <div className="flex items-center gap-2">
                <InputColor
                  id="smartLayoutItem3"
                  value={
                    currentValues.smartLayoutItem3 ||
                    DEFAULT_THEME_COLORS.smartLayoutItem3
                  }
                  onChange={(e) => onChange("smartLayoutItem3", e.target.value)}
                />
                <Input
                  value={
                    currentValues.smartLayoutItem3 ||
                    DEFAULT_THEME_COLORS.smartLayoutItem3
                  }
                  onChange={(e) => onChange("smartLayoutItem3", e.target.value)}
                  placeholder={DEFAULT_THEME_COLORS.smartLayoutItem3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smartLayoutItem4">{t("smartLayoutItem4")}</Label>
              <div className="flex items-center gap-2">
                <InputColor
                  id="smartLayoutItem4"
                  value={
                    currentValues.smartLayoutItem4 ||
                    DEFAULT_THEME_COLORS.smartLayoutItem4
                  }
                  onChange={(e) => onChange("smartLayoutItem4", e.target.value)}
                />
                <Input
                  value={
                    currentValues.smartLayoutItem4 ||
                    DEFAULT_THEME_COLORS.smartLayoutItem4
                  }
                  onChange={(e) => onChange("smartLayoutItem4", e.target.value)}
                  placeholder={DEFAULT_THEME_COLORS.smartLayoutItem4}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smartLayoutStatFill">
                {t("smartLayoutStatFill")}
              </Label>
              <div className="flex items-center gap-2">
                <InputColor
                  id="smartLayoutStatFill"
                  value={
                    currentValues.smartLayoutStatFill ||
                    currentValues.accentColor ||
                    DEFAULT_THEME_COLORS.smartLayoutStatFill
                  }
                  onChange={(e) =>
                    onChange("smartLayoutStatFill", e.target.value)
                  }
                />
                <Input
                  value={
                    currentValues.smartLayoutStatFill ||
                    currentValues.accentColor ||
                    DEFAULT_THEME_COLORS.smartLayoutStatFill
                  }
                  onChange={(e) =>
                    onChange("smartLayoutStatFill", e.target.value)
                  }
                  placeholder={DEFAULT_THEME_COLORS.smartLayoutStatFill}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smartLayoutStatEmpty">
                {t("smartLayoutStatEmpty")}
              </Label>
              <div className="flex items-center gap-2">
                <InputColor
                  id="smartLayoutStatEmpty"
                  value={
                    currentValues.smartLayoutStatEmpty ||
                    DEFAULT_THEME_COLORS.smartLayoutStatEmpty
                  }
                  onChange={(e) =>
                    onChange("smartLayoutStatEmpty", e.target.value)
                  }
                />
                <Input
                  value={
                    currentValues.smartLayoutStatEmpty ||
                    DEFAULT_THEME_COLORS.smartLayoutStatEmpty
                  }
                  onChange={(e) =>
                    onChange("smartLayoutStatEmpty", e.target.value)
                  }
                  placeholder={DEFAULT_THEME_COLORS.smartLayoutStatEmpty}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smartLayoutBorderColor">
                {t("smartLayoutBorderColor")}
              </Label>
              <div className="flex items-center gap-2">
                <InputColor
                  id="smartLayoutBorderColor"
                  value={
                    currentValues.smartLayoutBorderColor ||
                    DEFAULT_THEME_COLORS.smartLayoutBorderColor
                  }
                  onChange={(e) =>
                    onChange("smartLayoutBorderColor", e.target.value)
                  }
                />
                <Input
                  value={
                    currentValues.smartLayoutBorderColor ||
                    DEFAULT_THEME_COLORS.smartLayoutBorderColor
                  }
                  onChange={(e) =>
                    onChange("smartLayoutBorderColor", e.target.value)
                  }
                  placeholder={DEFAULT_THEME_COLORS.smartLayoutBorderColor}
                />
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="chartPalette">
        <AccordionTrigger>{t("chartPalette")}</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="chartColor1">{t("chartColor1")}</Label>
              <div className="flex items-center gap-2">
                <InputColor
                  id="chartColor1"
                  value={
                    currentValues.chartColor1 ||
                    currentValues.accentColor ||
                    DEFAULT_THEME_COLORS.chartColor1
                  }
                  onChange={(e) => onChange("chartColor1", e.target.value)}
                />
                <Input
                  value={
                    currentValues.chartColor1 ||
                    currentValues.accentColor ||
                    DEFAULT_THEME_COLORS.chartColor1
                  }
                  onChange={(e) => onChange("chartColor1", e.target.value)}
                  placeholder={DEFAULT_THEME_COLORS.chartColor1}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chartColor2">{t("chartColor2")}</Label>
              <div className="flex items-center gap-2">
                <InputColor
                  id="chartColor2"
                  value={
                    currentValues.chartColor2 ||
                    DEFAULT_THEME_COLORS.chartColor2
                  }
                  onChange={(e) => onChange("chartColor2", e.target.value)}
                />
                <Input
                  value={
                    currentValues.chartColor2 ||
                    DEFAULT_THEME_COLORS.chartColor2
                  }
                  onChange={(e) => onChange("chartColor2", e.target.value)}
                  placeholder={DEFAULT_THEME_COLORS.chartColor2}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chartColor3">{t("chartColor3")}</Label>
              <div className="flex items-center gap-2">
                <InputColor
                  id="chartColor3"
                  value={
                    currentValues.chartColor3 ||
                    DEFAULT_THEME_COLORS.chartColor3
                  }
                  onChange={(e) => onChange("chartColor3", e.target.value)}
                />
                <Input
                  value={
                    currentValues.chartColor3 ||
                    DEFAULT_THEME_COLORS.chartColor3
                  }
                  onChange={(e) => onChange("chartColor3", e.target.value)}
                  placeholder={DEFAULT_THEME_COLORS.chartColor3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chartColor4">{t("chartColor4")}</Label>
              <div className="flex items-center gap-2">
                <InputColor
                  id="chartColor4"
                  value={
                    currentValues.chartColor4 ||
                    DEFAULT_THEME_COLORS.chartColor4
                  }
                  onChange={(e) => onChange("chartColor4", e.target.value)}
                />
                <Input
                  value={
                    currentValues.chartColor4 ||
                    DEFAULT_THEME_COLORS.chartColor4
                  }
                  onChange={(e) => onChange("chartColor4", e.target.value)}
                  placeholder={DEFAULT_THEME_COLORS.chartColor4}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chartColor5">{t("chartColor5")}</Label>
              <div className="flex items-center gap-2">
                <InputColor
                  id="chartColor5"
                  value={
                    currentValues.chartColor5 ||
                    DEFAULT_THEME_COLORS.chartColor5
                  }
                  onChange={(e) => onChange("chartColor5", e.target.value)}
                />
                <Input
                  value={
                    currentValues.chartColor5 ||
                    DEFAULT_THEME_COLORS.chartColor5
                  }
                  onChange={(e) => onChange("chartColor5", e.target.value)}
                  placeholder={DEFAULT_THEME_COLORS.chartColor5}
                />
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
