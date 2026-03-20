/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useScopedI18n } from "@/lib/locales/client";

type Image = {
  id: string;
  url: string;
  thumb: string;
};

const schema = z.object({
  query: z.string().min(1, { message: "Текст не может быть пустым" }),
  provider: z.enum(["unsplash", "freepik"]),
});

export const SearchImages = ({
  onImageSelect,
}: {
  onImageSelect: (url: string) => void;
}) => {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const t = useScopedI18n("editor");

  const { register, handleSubmit, setValue, getValues, watch } = useForm<
    z.infer<typeof schema>
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      query: "",
      provider: "unsplash",
    },
  });

  const provider = watch("provider");

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/search/${data.provider}`, {
        method: "POST",
        body: JSON.stringify({ query: data.query }),
      });

      const responseData = await response.json();
      setImages(responseData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2 py-2">
          <Label htmlFor="provider">{t("provider")}</Label>
          <Select
            onValueChange={(value) =>
              setValue("provider", value as "unsplash" | "freepik")
            }
            defaultValue={getValues("provider")}
          >
            <SelectTrigger>
              <SelectValue>
                <div className="flex items-center gap-2">
                  {provider === "unsplash" ? (
                    <img
                      src="/unsplash-logo.png"
                      alt="Unsplash"
                      width={24}
                      height={24}
                    />
                  ) : provider === "freepik" ? (
                    <img
                      src="/freepik-logo.png"
                      alt="Freepik"
                      width={24}
                      height={24}
                    />
                  ) : (
                    t("selectProvider")
                  )}
                  <span className="capitalize">{provider}</span>
                </div>
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="unsplash">Unsplash</SelectItem>
              <SelectItem value="freepik">Freepik</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 items-end pt-2">
          <div className="flex flex-col gap-2 grow relative">
            <Label htmlFor="query">{t("findImage")}</Label>
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

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {images.map((image) => (
            <img
              key={image.id}
              src={image.thumb}
              alt={image.id}
              className={cn(
                "w-full h-full object-cover rounded-lg cursor-pointer",
                selectedImageId === image.id && "border-2 border-primary"
              )}
              onClick={() => {
                setSelectedImageId(image.id);
                onImageSelect(image.url);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
