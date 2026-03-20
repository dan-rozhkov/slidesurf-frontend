
import { apiFetch } from "@/api/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Loader, Sparkles, Trash2 } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Slide } from "@/types";
import { useState } from "react";
import { useScopedI18n } from "@/lib/locales/client";
import {
  AVAILABLE_IMAGE_MODELS,
  DEFAULT_IMAGE_MODEL,
  getModelById,
} from "@/lib/models";
import { useUserSubscription } from "@/lib/hooks/use-user-subscription";
import { useSubscriptionDialog } from "@/lib/hooks/use-subscription-dialog";

const formSchema = z.object({
  url: z.string().url("Неверный формат URL"),
  prompt: z.string().optional(),
});

type Inputs = z.infer<typeof formSchema>;

type ImageEditFormProps = {
  currentSlide?: Slide;
  onSubmit: (url: string) => void;
  onReset: () => void;
  onGenerate: (prompt: string, model: string) => Promise<void>;
  isGenerating: boolean;
  imageUrl?: string | null;
};

export const EditImageForm = ({
  currentSlide,
  onSubmit,
  onReset,
  onGenerate,
  isGenerating,
  imageUrl: externalImageUrl,
}: ImageEditFormProps) => {
  // Use external imageUrl if provided, otherwise use currentSlide's layoutImageUrl
  const effectiveImageUrl = externalImageUrl ?? currentSlide?.layoutImageUrl ?? "";
  
  const { register, handleSubmit, watch, setValue } = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    values: {
      url: effectiveImageUrl,
      prompt: "",
    },
  });
  const t = useScopedI18n("editor");
  const { data: subscription } = useUserSubscription();
  const [, setSubscriptionDialogOpen] = useSubscriptionDialog();

  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_IMAGE_MODEL);

  const canUseAdvancedImageModels =
    subscription?.limits?.canUseAdvancedImageModels || false;

  const handleModelChange = (modelId: string) => {
    const model = getModelById(modelId);

    // Check if model is advanced and user doesn't have access
    if (model?.advanced && !canUseAdvancedImageModels) {
      setSubscriptionDialogOpen(true);
      return;
    }

    setSelectedModel(modelId);
  };

  const handleFormSubmit: SubmitHandler<Inputs> = (data) => {
    onSubmit(data.url);
  };

  const handleGeneratePrompt = async () => {
    if (!currentSlide?.content) return;
    
    try {
      setIsGeneratingPrompt(true);

      const response = await apiFetch("/api/generate/image/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slideContent: currentSlide.content }),
      });

      const prompt = await response.text();
      setValue("prompt", prompt);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingPrompt(false);
    }
  };
  
  // Hide generate prompt button if no slide content available
  const canGeneratePrompt = !!currentSlide?.content;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="flex gap-2 items-end">
        <div className="space-y-1 w-full">
          <Label htmlFor="url">{t("imageUrl")}</Label>
          <Input
            id="url"
            defaultValue={effectiveImageUrl}
            {...register("url")}
          />
        </div>

        <Button type="submit" variant="outline">
          {t("apply")}
        </Button>

        {effectiveImageUrl && (
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={onReset}
          >
            <Trash2 className="size-4" strokeWidth={1.5} />
          </Button>
        )}
      </div>

      <Separator className="mt-8 mb-6" />

      <div className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="model">{t("model")}</Label>
          <Select value={selectedModel} onValueChange={handleModelChange}>
            <SelectTrigger>
              <SelectValue>
                {AVAILABLE_IMAGE_MODELS.find((m) => m.id === selectedModel)
                  ?.name || "Select model"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_IMAGE_MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center gap-2">
                    <span>
                      {model.provider} {model.name}
                    </span>
                    {model.advanced && (
                      <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                        {t("proBadge")}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="prompt">{t("generateImageWithAI")}</Label>
          <div className="relative">
            {canGeneratePrompt && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-1 bottom-1 p-1 h-auto gap-1.5"
                disabled={isGeneratingPrompt}
                onClick={handleGeneratePrompt}
              >
                {isGeneratingPrompt ? (
                  <Loader className="size-4 animate-spin" />
                ) : (
                  <Sparkles strokeWidth={1.5} />
                )}
                <span className="text-xs">{t("generatePrompt")}</span>
              </Button>
            )}
            <Textarea
              id="prompt"
              placeholder={t("describeImage")}
              {...register("prompt")}
              className={canGeneratePrompt ? "pb-14" : ""}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="button"
          onClick={() => onGenerate(watch("prompt") || "", selectedModel)}
          disabled={isGenerating}
        >
          {isGenerating && <Loader className="size-4 animate-spin" />}
          {t("generate")}
        </Button>
      </div>
    </form>
  );
};
