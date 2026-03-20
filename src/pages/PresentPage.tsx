import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react";
import SlideWrapper from "@/components/slide-wrapper";
import ThemeInit from "@/components/theme-init";
import EditorLoadingScreen from "@/components/editor-loading-screen";
import * as presentationsApi from "@/api/presentations";
import { usePresentationAtom } from "@/lib/hooks/use-presentation";
import { useIsPresentingAtom } from "@/lib/hooks/use-is-presenting";
import { useI18n } from "@/lib/locales/client";
import { useTheme } from "@/lib/hooks/use-theme";
import type { Presentation } from "@/types";

export default function PresentPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const t = useI18n();
  const withoutControls = searchParams.get("withoutControls") === "true";
  const [, setIsPresenting] = useIsPresentingAtom();
  const [, setPresentationAtom] = usePresentationAtom();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const { data: presentation, isLoading } = useQuery<Presentation | null>({
    queryKey: ["presentation", id],
    queryFn: () => presentationsApi.getById(id!),
    enabled: !!id,
  });

  const { theme } = useTheme(presentation?.themeId || null);

  useEffect(() => {
    if (presentation) {
      setPresentationAtom(presentation);
      setIsPresenting(true);
    }
  }, [presentation, setPresentationAtom, setIsPresenting]);

  const handlePrevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) =>
      Math.min((presentation?.slides?.length || 1) - 1, prev + 1)
    );
  }, [presentation?.slides?.length]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleExitPresent = useCallback(() => {
    setIsPresenting(false);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    if (presentation) {
      navigate(`/editor/${presentation.id}`);
    }
  }, [navigate, setIsPresenting, presentation]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") handlePrevSlide();
      else if (event.key === "ArrowRight") handleNextSlide();
      else if (event.key === "Escape") handleExitPresent();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevSlide, handleNextSlide, handleExitPresent]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const calculateFontSize = () => {
      const windowWidth = window.innerWidth;
      const calculatedSize = windowWidth / 60;
      setFontSize(calculatedSize);
    };
    calculateFontSize();
    window.addEventListener("resize", calculateFontSize);
    return () => window.removeEventListener("resize", calculateFontSize);
  }, []);

  if (isLoading) {
    return (
      <>
        <ThemeInit />
        <EditorLoadingScreen />
      </>
    );
  }

  if (!presentation) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-foreground text-center">
          <h1 className="text-2xl font-bold mb-4">
            {t("errors.presentationNotFound")}
          </h1>
          <p className="text-muted-foreground">
            {t("errors.presentationNotFoundDescription")}
          </p>
        </div>
      </div>
    );
  }

  if (!presentation.slides?.length) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div
        id="wrapper"
        className="w-full h-full flex items-center justify-center pointer-events-none"
        style={{ fontSize: `${fontSize}px` }}
      >
        <SlideWrapper
          isActive={false}
          slide={presentation.slides[currentSlideIndex]!}
          isEditable={false}
          onUpdate={() => {}}
          isPresenting={true}
          theme={theme}
        />
      </div>

      {!withoutControls && (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center gap-4 z-10">
          <button
            onClick={handlePrevSlide}
            disabled={currentSlideIndex === 0}
            className="p-2 bg-neutral-900/30 rounded-full hover:bg-neutral-900/50 transition-all duration-200 disabled:opacity-50 outline-none"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={handleNextSlide}
            disabled={currentSlideIndex === presentation.slides.length - 1}
            className="p-2 bg-neutral-900/30 rounded-full hover:bg-neutral-900/50 transition-all duration-200 disabled:opacity-50 outline-none"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-neutral-900/30 rounded-full hover:bg-neutral-900/50 transition-all duration-200 outline-none"
          >
            {isFullscreen ? (
              <Minimize className="w-6 h-6 text-white" />
            ) : (
              <Maximize className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
