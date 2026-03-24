
import { useState, useCallback, useEffect, useRef } from "react";
import { apiFetch } from "@/api/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { nanoid } from "@/lib/utils";
import { Section } from "@/types";
import { Attachment as AttachmentType } from "@/types";
import { usePresentationAtom } from "@/lib/hooks/use-presentation";
import { toast } from "sonner";
import { useScopedI18n } from "@/lib/locales/client";
import { usePresentationData } from "@/lib/hooks/use-presentation-data";
import { useThemes } from "@/lib/hooks/use-themes";
import { parseSectionBlock } from "@/lib/client/parsers/section-parser";
import { useModels } from "@/lib/hooks/use-models";
import { useSubscriptionDialog } from "@/lib/hooks/use-subscription-dialog";

import { arrayMove } from "@dnd-kit/sortable";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Название презентации обязательно",
  }),
  slidesCount: z
    .number()
    .min(-1, {
      message: "Количество слайдов должно быть -1 (Авто) или больше 0",
    })
    .max(60, {
      message: "Количество слайдов должно быть меньше 60",
    }),
  lang: z.enum(["ru", "en"], {
    message: "Язык обязателен",
  }),
  model: z.string(),
  tone: z.enum(["formal", "informal", "neutral"]).optional(),
  whom: z.enum(["all", "boss", "colleagues", "clients"]).optional(),
  contentStyle: z.enum(["more", "less", "as-is"]).optional(),
  useResearch: z.boolean().optional(),
});

type ResearchSource = {
  title?: string;
  url?: string;
  snippet?: string;
};

const parseSourcesFromResearch = (
  research: string | null
): ResearchSource[] => {
  if (!research) return [];
  try {
    const parsed = JSON.parse(research) as { sources?: ResearchSource[] };
    if (Array.isArray(parsed.sources)) {
      return parsed.sources.filter(
        (source) =>
          Boolean(source?.url) ||
          Boolean(source?.title) ||
          Boolean(source?.snippet)
      );
    }
  } catch {
    // ignore parse errors
  }

  const urlMatches = research.match(/https?:\/\/[^\s)]+/g) || [];
  return urlMatches.map((url) => ({ url }));
};

export function usePresentationGeneration(locale: string) {
  const { textModels } = useModels();
  const [presentation, setPresentation] = usePresentationAtom();
  const [sections, setSections] = useState<Section[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [alreadyGenerated, setAlreadyGenerated] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentType[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [planId, setPlanId] = useState<string | null>(null);
  const [planResearch, setPlanResearch] = useState<string | null>(null);
  const [planSources, setPlanSources] = useState<ResearchSource[]>([]);
  const navigate = useNavigate();
  const t = useScopedI18n("generate");
  const [, setPresentationData] = usePresentationData();
  const [, setSubscriptionDialogOpen] = useSubscriptionDialog();
  const { themes } = useThemes();
  const hasRandomizedTheme = useRef(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slidesCount: -1, // Auto by default
      lang: locale === "ru" ? "ru" : "en",
      model: textModels[0]?.id ?? "",
      tone: "neutral",
      whom: "all",
      contentStyle: "as-is",
      useResearch: false,
    },
  });

  useEffect(() => {
    if (textModels.length > 0 && !form.getValues("model")) {
      form.setValue("model", textModels[0].id);
    }
  }, [textModels, form]);

  useEffect(() => {
    setPresentation({
      id: nanoid(),
      title: "Без названия",
      slides: [],
      themeId: "tech-community",
    });
  }, [setPresentation]);

  useEffect(() => {
    if (themes.length > 0 && !hasRandomizedTheme.current) {
      const randomTheme = themes[Math.floor(Math.random() * themes.length)];
      setPresentation((prev) => ({
        ...prev,
        themeId: randomTheme.id,
      }));
      hasRandomizedTheme.current = true;
    }
  }, [themes, setPresentation]);

  const getSlideCopy = useCallback(
    (num: number) => {
      if (num === 1) return t("oneSlide");
      return `${num} ${num < 5 ? t("less5slides") : t("slides")}`;
    },
    [t]
  );

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    try {
      setIsGenerating(true);
      setPlanResearch(null);
      setPlanSources([]);

      // For auto mode (-1), don't pre-create sections - they will be created as they come from the stream
      if (formData.slidesCount !== -1) {
        const initialSections: Section[] = new Array(formData.slidesCount)
          .fill(null)
          .map((_, index) => ({
            id: nanoid(),
            title: "",
            index,
          }));
        setSections(initialSections);
      } else {
        setSections([]);
      }

      const response = await apiFetch("/api/generate/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          attachments: attachments,
        }),
      });

      const responsePlanId = response.headers.get("X-Plan-Id");
      if (responsePlanId) {
        setPlanId(responsePlanId);
      }

      // Check for HTTP errors
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
            toast.error(
              errorData.error || errorText || "Failed to generate plan"
            );
          }
        } catch {
          if (response.status === 403) {
            setSubscriptionDialogOpen(true);
            toast.error("Subscription limit exceeded");
          } else {
            toast.error(errorText || "Failed to generate plan");
          }
        }
        setSections([]);
        setIsGenerating(false);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        setIsGenerating(false);
        return;
      }
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);

        try {
          const errorData = JSON.parse(chunk);
          if (errorData.error) {
            toast.error(t(errorData.message) || t(errorData.error));
            setSections([]);
            setTimeout(() => {
              setAlreadyGenerated(false);
            }, 100);
            return;
          } else {
            buffer += chunk;
          }
        } catch {
          buffer += chunk;
        }

        const blocks = buffer.split("-----");
        const completeBlocks = blocks.slice(0, -1);
        buffer = blocks[blocks.length - 1];

        completeBlocks.forEach((block) => {
          const sectionPartial = parseSectionBlock(block);
          if (sectionPartial && sectionPartial.index !== undefined) {
            setSections((prevSections) => {
              const updatedSections = [...prevSections];
              const index = sectionPartial.index as number;
              // Auto mode: extend array if needed
              while (updatedSections.length <= index) {
                updatedSections.push({
                  id: nanoid(),
                  title: "",
                  index: updatedSections.length,
                });
              }
              updatedSections[index] = {
                ...updatedSections[index],
                ...sectionPartial,
              };
              return updatedSections;
            });
          }
        });
      }

      if (buffer.trim()) {
        const sectionPartial = parseSectionBlock(buffer);
        if (sectionPartial && sectionPartial.index !== undefined) {
          setSections((prevSections) => {
            const updatedSections = [...prevSections];
            const index = sectionPartial.index as number;
            // Auto mode: extend array if needed
            while (updatedSections.length <= index) {
              updatedSections.push({
                id: nanoid(),
                title: "",
                index: updatedSections.length,
              });
            }
            updatedSections[index] = {
              ...updatedSections[index],
              ...sectionPartial,
            };
            return updatedSections;
          });
        }
      }

      if (formData.useResearch && responsePlanId) {
        const attempts = 3;
        for (let attempt = 0; attempt < attempts; attempt += 1) {
          try {
            const researchResponse = await apiFetch(`/api/plans/${responsePlanId}`);
            if (researchResponse.ok) {
              const data = (await researchResponse.json()) as {
                research?: string | null;
              };
              setPlanResearch(data.research ?? null);
              setPlanSources(parseSourcesFromResearch(data.research ?? null));
              break;
            }
          } catch (error) {
            console.error("Failed to load plan research:", error);
          }
          await new Promise((resolve) => setTimeout(resolve, 400));
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
      setAlreadyGenerated(true);
    }
  };

  const handleMoveToEditor = () => {
    const formValues = form.getValues();
    setPresentationData({
      slidesPlan: sections,
      attachments: attachments,
      model: formValues.model,
      contentSettings: {
        tone: formValues.tone,
        whom: formValues.whom,
        contentStyle: formValues.contentStyle,
      },
      planId: planId,
    });

    navigate("/editor");
  };

  const savePlan = useCallback(
    async (currentSections: Section[]) => {
      if (!planId) return;

      try {
        await apiFetch(`/api/plans/${planId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slides: currentSections,
            slidesCount: currentSections.length,
          }),
        });
      } catch (error) {
        console.error("Failed to save plan updates:", error);
      }
    },
    [planId]
  );

  const addPlanSlide = useCallback(() => {
    const newSlide = { id: nanoid(), title: t("newSlide"), index: sections.length };
    const newSections = [...sections, newSlide];
    setSections(newSections);
    savePlan(newSections);
  }, [sections, savePlan, t]);

  const removePlanSlide = useCallback(
    (index: number) => {
      const newSections = [...sections];
      newSections.splice(index, 1);
      setSections(newSections);
      savePlan(newSections);
    },
    [sections, savePlan]
  );

  const updatePlanSlide = useCallback(
    (index: number, updates: Partial<Section>) => {
      const newSections = [...sections];
      newSections[index] = { ...newSections[index], ...updates };
      setSections(newSections);
      savePlan(newSections);
    },
    [sections, savePlan]
  );

  const reorderPlanSlides = useCallback(
    (oldIndex: number, newIndex: number) => {
      const newSections = arrayMove(sections, oldIndex, newIndex);
      setSections(newSections);
      savePlan(newSections);
    },
    [sections, savePlan]
  );

  return {
    form,
    sections,
    setSections,
    isGenerating,
    alreadyGenerated,
    attachments,
    setAttachments,
    isUploading,
    setIsUploading,
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
    planResearch,
  };
}
