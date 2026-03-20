
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useScopedI18n } from "@/lib/locales/client";
import type { ThemeFormData } from "../types";
import type { FieldErrors, UseFormRegister, Control } from "react-hook-form";
import { Controller } from "react-hook-form";

type MainSectionProps = {
  register: UseFormRegister<ThemeFormData>;
  errors: FieldErrors<ThemeFormData>;
  control: Control<ThemeFormData>;
};

export function MainSection({ register, errors, control }: MainSectionProps) {
  const t = useScopedI18n("themes.editor");

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">{t("mainSettings")}</h3>

      <div className="space-y-2">
        <Label htmlFor="name">{t("themeName")}</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder={t("themeNamePlaceholder")}
        />
        {errors.name && (
          <p className="text-sm text-red-500">
            {errors.name.message as string}
          </p>
        )}
      </div>

      <div className="pt-2">
        <Label
          htmlFor="isPublic"
          className="text-sm inline-flex items-center gap-3 bg-muted p-3 rounded-md"
        >
          {t("availableToAll")}

          <Controller
            name="isPublic"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Switch
                id="isPublic"
                checked={value}
                onCheckedChange={onChange}
              />
            )}
          />
        </Label>
      </div>
    </div>
  );
}
