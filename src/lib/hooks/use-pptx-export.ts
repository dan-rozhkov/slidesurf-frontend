import { useCallback, useState } from "react";
import { apiFetch } from "@/api/client";
import { toast } from "sonner";
import { extractSlidesData } from "@/lib/utils/pptx-export";
import { usePresentationAtom } from "./use-presentation";
import { useScopedI18n } from "@/lib/locales/client";
import { useTheme } from "./use-theme";

export function usePptxExport() {
  const [presentation] = usePresentationAtom();
  const { theme } = useTheme(presentation?.themeId || null);
  const t = useScopedI18n("editor");
  const [isExporting, setIsExporting] = useState(false);

  // Get fonts from theme
  const themeFonts: string[] = [];
  if (theme?.fontFamily) {
    themeFonts.push(theme.fontFamily);
  }
  if (theme?.fontFamilyHeader && theme.fontFamilyHeader !== theme.fontFamily) {
    themeFonts.push(theme.fontFamilyHeader);
  }

  const exportToPPTX = useCallback(async () => {
    if (!presentation) {
      toast.error(t("noPresentationToExport"));
      return;
    }

    setIsExporting(true);
    const loadingToast = toast.loading(t("exportingPresentationToPPTX"));

    try {
      // Get all slides from DOM
      const slideElements: HTMLElement[] = [];

      presentation.slides.forEach((slide) => {
        const slideElement = document.getElementById(`slide-${slide.id}`);
        if (slideElement) {
          slideElements.push(slideElement);
        }
      });

      if (slideElements.length === 0) {
        toast.dismiss(loadingToast);
        toast.error(t("noSlidesFoundToExport"));
        return;
      }

      // Extract slide data on the client
      const slidesData = await extractSlidesData(slideElements);

      // Send data to the backend for PPTX generation
      const response = await apiFetch("/api/export-pptx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slides: slidesData,
          title: presentation.title || "presentation",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get blob from the response
      const blob = await response.blob();

      // Download the file
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${presentation.title || "presentation"}.pptx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.dismiss(loadingToast);
      toast.success(t("presentationExportedSuccessfully"));
    } catch (error) {
      console.error("Error exporting PPTX:", error);
      toast.dismiss(loadingToast);
      toast.error(t("failedToExportPresentation"));
    } finally {
      setIsExporting(false);
    }
  }, [presentation, t]);

  return { exportToPPTX, isExporting, themeFonts };
}
