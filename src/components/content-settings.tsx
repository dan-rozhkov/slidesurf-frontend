
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AlignJustify, Text, LayoutList, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { useScopedI18n } from "@/lib/locales/client";

type FormData = {
  title: string;
  slidesCount: number;
  lang: "ru" | "en";
  model: string;
  tone?: "formal" | "informal" | "neutral";
  whom?: "all" | "boss" | "colleagues" | "clients";
  contentStyle?: "more" | "less" | "as-is";
};

type ContentSettingsProps = {
  form: UseFormReturn<FormData>;
};

export function ContentSettings({ form }: ContentSettingsProps) {
  const t = useScopedI18n("generate");

  return (
    <div className="flex flex-col gap-4 bg-background rounded-lg p-4 mx-auto max-w-2xl w-full">
      <h4 className="text-sm text-muted-foreground">{t("contentSettings")}</h4>

      <div className="flex flex-col gap-4">
        <ToggleGroup
          type="single"
          variant="outline"
          value={form.watch("contentStyle")}
          onValueChange={(value) => {
            if (value) {
              form.setValue("contentStyle", value as "more" | "less" | "as-is");
            }
          }}
          className="w-full gap-0 -space-x-[1px]"
        >
          <ToggleGroupItem
            value="more"
            className="w-full data-[state=on]:bg-accent rounded-r-none"
          >
            <div className="flex items-center gap-0.5">
              <AlignJustify strokeWidth={1.5} className="size-4" />
              <Text strokeWidth={1.5} className="size-4" />
            </div>
            <span className="ml-2">{t("moreText")}</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="less"
            className="w-full data-[state=on]:bg-accent rounded-none"
          >
            <LayoutList strokeWidth={1.5} className="size-4" />
            <span className="ml-2">{t("lessText")}</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="as-is"
            className="w-full data-[state=on]:bg-accent rounded-l-none"
          >
            <Lock strokeWidth={1.5} className="size-4" />
            <span className="ml-2">{t("asIsText")}</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-2 w-full">
          <Label>{t("tone")}</Label>
          <Select
            onValueChange={(value) =>
              form.setValue("tone", value as "formal" | "informal" | "neutral")
            }
            value={form.watch("tone")}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("tone")} />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="formal">{t("formal")}</SelectItem>
              <SelectItem value="informal">{t("informal")}</SelectItem>
              <SelectItem value="neutral">{t("neutral")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <Label>{t("whom")}</Label>
          <Select
            onValueChange={(value) =>
              form.setValue(
                "whom",
                value as "all" | "boss" | "colleagues" | "clients"
              )
            }
            value={form.watch("whom")}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("whom")} />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              <SelectItem value="boss">{t("boss")}</SelectItem>
              <SelectItem value="colleagues">{t("colleagues")}</SelectItem>
              <SelectItem value="clients">{t("clients")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
