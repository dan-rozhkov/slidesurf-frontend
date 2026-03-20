import { useState } from "react";
import { useSubscriptionDialog } from "@/lib/hooks/use-subscription-dialog";
import { toast } from "sonner";
import { apiFetch } from "@/api/client";

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [, setSubscriptionDialogOpen] = useSubscriptionDialog();

  const generateImage = async (prompt: string, model?: string) => {
    if (!prompt.trim() || isGenerating) return;

    try {
      setIsGenerating(true);

      const response = await apiFetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          size: "landscape_4_3",
          numImages: 1,
          model,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          if (
            errorData.code === "SUBSCRIPTION_LIMIT_EXCEEDED" ||
            response.status === 403
          ) {
            setSubscriptionDialogOpen(true);
            toast.error(errorData.error || "Subscription limit exceeded");
          } else {
            console.error("Image generation error:", errorData.error);
          }
        } catch {
          if (response.status === 403) {
            setSubscriptionDialogOpen(true);
            toast.error("Subscription limit exceeded");
          }
        }
        return null;
      }

      const data = await response.json();
      return data?.imageUrl;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateImage,
  };
};
