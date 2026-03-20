/* eslint-disable @next/next/no-img-element */

import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Search } from "lucide-react";
import { useScopedI18n } from "@/lib/locales/client";
import { usePresentationAtom } from "@/lib/hooks/use-presentation";
import { useTheme } from "@/lib/hooks/use-theme";

type Icon = {
  id: string;
  url: string;
  thumb: string;
};

const schema = z.object({
  query: z.string().min(1, { message: "Текст не может быть пустым" }),
});

export const SearchNounIcons = ({
  onIconSelect,
}: {
  onIconSelect: (url: string) => void;
}) => {
  const t = useScopedI18n("editor");
  const [presentation] = usePresentationAtom();
  const { theme: currentTheme } = useTheme(presentation?.themeId || null);
  const [icons, setIcons] = useState<Icon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Convert hex color to format without # for API
  const iconColor = useMemo(() => {
    return currentTheme?.colors?.accent?.replace("#", "") ?? "000000";
  }, [currentTheme]);

  const fileType = "svg";

  const { register, handleSubmit } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      query: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/search/nounproject`, {
        method: "POST",
        body: JSON.stringify({ query: data.query }),
      });

      const responseData = await response.json();
      setIcons(responseData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIconSelect = async (iconId: string) => {
    setIsDownloading(true);
    setSelectedIconId(iconId);

    try {
      const response = await fetch(`/api/search/nounproject/download`, {
        method: "POST",
        body: JSON.stringify({
          iconId,
          color: iconColor,
          filetype: fileType,
        }),
      });

      const responseData = await response.json();

      if (responseData.success && responseData.imageUrl) {
        onIconSelect(responseData.imageUrl);
      } else {
        console.error("Failed to download icon:", responseData.error);
      }
    } catch (error) {
      console.error("Error downloading icon:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-2 items-end pt-2">
          <div className="flex flex-col gap-2 grow relative">
            <Label htmlFor="query">{t("searchIcons")}</Label>
            <Input {...register("query")} autoFocus autoComplete="off" />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader className="size-4 animate-spin" strokeWidth={1.5} />
            ) : (
              <Search className="size-4" strokeWidth={1.5} />
            )}
          </Button>
        </div>
      </form>

      {icons.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {icons.map((icon) => (
            <div
              key={icon.id}
              className="relative rounded-lg cursor-pointer border p-2 bg-white"
              onClick={() => handleIconSelect(icon.id)}
            >
              <img
                src={icon.thumb}
                alt={icon.id}
                className="w-full h-full object-contain"
              />
              {isDownloading && selectedIconId === icon.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                  <Loader className="size-4 animate-spin" strokeWidth={1.5} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
