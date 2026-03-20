import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PresentationForm } from "@/components/presentation-form";
import { SectionsList } from "@/components/sections-list";
import { ContentSettings } from "@/components/content-settings";
import { ThemeSelector } from "@/components/theme-selector";
import { BottomActionBar } from "@/components/bottom-action-bar";
import { SlideControlHint } from "@/components/slide-control-hint";
import { PlanSources } from "@/components/plan-sources";
import { usePresentationGeneration } from "@/lib/hooks/use-presentation-generation";
import { useScopedI18n } from "@/lib/locales/client";
import { useEffect, useState } from "react";
import { useCurrentLocale } from "@/lib/locales/client";
import * as subscriptionApi from "@/api/subscription";
import type { ActiveSubscription } from "@/types";
import { getSubscriptionLimits } from "@/lib/subscription-limits";

export default function CreatePage() {
  const locale = useCurrentLocale();
  const t = useScopedI18n("generate");
  const [subscription, setSubscription] = useState<ActiveSubscription | null>(
    null
  );

  const {
    form,
    sections,
    setSections,
    isGenerating,
    alreadyGenerated,
    attachments,
    setAttachments,
    isUploading,
    presentation,
    setPresentation,
    getSlideCopy,
    onSubmit,
    handleMoveToEditor,
    addPlanSlide,
    removePlanSlide,
    updatePlanSlide,
    reorderPlanSlides,
    planSources,
  } = usePresentationGeneration(locale);

  useEffect(() => {
    subscriptionApi.getUserSubscription().then((sub) => {
      if (sub) {
        setSubscription({
          planType: sub.plan,
          isActive: sub.status === "active",
          expiresAt: null,
          limits: getSubscriptionLimits(sub.plan),
        });
      }
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#FCFCFD] dark:bg-[#1A1A1A]">
      <Link to="/dashboard" className="absolute top-4 left-4">
        <Button variant="outline">
          <ArrowLeft className="size-4" strokeWidth={1.5} />
          <span>{t("back")}</span>
        </Button>
      </Link>

      <div className="flex flex-col items-center gap-4 mx-auto max-w-7xl px-4 pb-24 pt-32">
        <h1 className="text-3xl font-bold tracking-tight text-center">
          {t("title")}
        </h1>
        <p className="text-lg text-center">{t("description")}</p>

        <div className="flex flex-col gap-4 w-full pt-5">
          <PresentationForm
            form={form}
            onSubmit={onSubmit}
            isGenerating={isGenerating}
            alreadyGenerated={alreadyGenerated}
            attachments={attachments}
            setAttachments={setAttachments}
            isUploading={isUploading}
            getSlideCopy={getSlideCopy}
            subscription={subscription}
          />

          <PlanSources sources={planSources} />

          <SectionsList
            sections={sections}
            onReorder={reorderPlanSlides}
            onUpdate={updatePlanSlide}
            onRemove={removePlanSlide}
            onAdd={addPlanSlide}
            getSlideCopy={getSlideCopy}
          />
        </div>

        {alreadyGenerated && (
          <>
            <ContentSettings form={form} />
            <ThemeSelector
              presentation={presentation}
              setPresentation={setPresentation}
            />
          </>
        )}
      </div>

      {alreadyGenerated && (
        <BottomActionBar
          isGenerating={isGenerating}
          sectionsLength={sections.length}
          onMoveToEditor={handleMoveToEditor}
          getSlideCopy={getSlideCopy}
        />
      )}

      {!alreadyGenerated && <SlideControlHint />}
    </main>
  );
}
