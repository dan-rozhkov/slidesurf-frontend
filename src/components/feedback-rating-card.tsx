
import { useState, useEffect } from "react";
import { Frown, Meh, Smile, Laugh } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScopedI18n } from "@/lib/locales/client";
import { toast } from "sonner";

type RatingValue = 1 | 2 | 3 | 4;

type FeedbackRatingCardProps = {
  presentationId: string;
  createdAt?: Date;
};

const ratingIcons = [
  { value: 1 as RatingValue, Icon: Frown, label: "dissatisfied" },
  { value: 2 as RatingValue, Icon: Meh, label: "neutral" },
  { value: 3 as RatingValue, Icon: Smile, label: "satisfied" },
  { value: 4 as RatingValue, Icon: Laugh, label: "very_satisfied" },
];

export function FeedbackRatingCard({
  presentationId,
}: FeedbackRatingCardProps) {
  const t = useScopedI18n("editor.feedback");
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const feedbackData = localStorage.getItem("feedback");
    const feedback = feedbackData ? JSON.parse(feedbackData) : [];

    // Check if feedback already exists for this presentation
    const hasGivenFeedback = feedback.some(
      (item: { presentationId: string; rating: number }) =>
        item.presentationId === presentationId
    );

    if (!hasGivenFeedback) {
      setIsVisible(true);
    }
  }, [presentationId]);

  const handleRatingClick = async (rating: RatingValue) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback/rating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          presentationId,
          rating,
        }),
      });

      if (response.ok) {
        // Save to localStorage feedback array to prevent showing again
        const feedbackData = localStorage.getItem("feedback");
        const feedback = feedbackData ? JSON.parse(feedbackData) : [];

        // Add new feedback entry
        feedback.push({
          presentationId,
          rating,
          timestamp: new Date().toISOString(),
        });

        localStorage.setItem("feedback", JSON.stringify(feedback));

        // Show toast notification
        toast.success(t("thankYou"));

        // Hide card after a short delay
        setTimeout(() => {
          setIsVisible(false);
        }, 1000);
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      setIsSubmitting(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative flex flex-col w-full">
      <div className="flex flex-col items-center justify-center h-full gap-2 pt-4">
        <h3 className="text-xl font-bold text-center tracking-tight">
          {t("title")}
        </h3>
        <p className="text-sm text-muted-foreground text-center">
          {t("description")}
        </p>

        <div className="flex gap-4 pb-8">
          {ratingIcons.map(({ value, Icon, label }) => (
            <button
              key={value}
              onClick={() => handleRatingClick(value)}
              disabled={isSubmitting}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-lg transition-all",
                "hover:bg-accent hover:scale-105",
                "disabled:opacity-100 disabled:cursor-not-allowed disabled:text-primary"
              )}
              aria-label={t(label as keyof typeof t)}
            >
              <Icon className="size-8" strokeWidth={1.5} />
              <span className="text-xs">{t(label as keyof typeof t)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
