
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useScopedI18n } from "@/lib/locales/client";
import type { ThemeFormData } from "../types";
import type { FieldErrors } from "react-hook-form";
import { ensureGoogleFontLoaded } from "../utils";
import { POPULAR_GOOGLE_FONTS } from "../constants";

type FontsSectionProps = {
  currentValues: ThemeFormData;
  errors: FieldErrors<ThemeFormData>;
  setValue: (name: keyof ThemeFormData, value: string) => void;
};

export function FontsSection({
  currentValues,
  errors,
  setValue,
}: FontsSectionProps) {
  const t = useScopedI18n("themes.editor");

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">{t("fontsTitle")}</h3>

      <div className="space-y-2">
        <Label htmlFor="fontFamily">{t("mainFont")}</Label>
        <Select
          value={currentValues.fontFamily}
          onValueChange={(v) => {
            setValue("fontFamily", v);
            ensureGoogleFontLoaded(v);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Inter" />
          </SelectTrigger>
          <SelectContent>
            {POPULAR_GOOGLE_FONTS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.fontFamily && (
          <p className="text-sm text-red-500">
            {errors.fontFamily.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="fontFamilyHeader">{t("headerFont")}</Label>
        <Select
          value={currentValues.fontFamilyHeader || ""}
          onValueChange={(v) => {
            setValue("fontFamilyHeader", v);
            ensureGoogleFontLoaded(v);
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {POPULAR_GOOGLE_FONTS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
