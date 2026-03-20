import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import SlideWrapper from "@/components/slide-wrapper";
import ThemeInit from "@/components/theme-init";
import EditorLoadingScreen from "@/components/editor-loading-screen";
import * as presentationsApi from "@/api/presentations";
import { usePresentationAtom } from "@/lib/hooks/use-presentation";
import { useTheme } from "@/lib/hooks/use-theme";
import { useScopedI18n } from "@/lib/locales/client";
import type { Presentation } from "@/types";

export default function ExportPage() {
  const { id } = useParams<{ id: string }>();
  const t = useScopedI18n("errors");
  const [, setPresentationAtom] = usePresentationAtom();
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
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [presentation, setPresentationAtom]);

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
    return <EditorLoadingScreen />;
  }

  if (!presentation) {
    return <div>{t("presentationAccessDenied")}</div>;
  }

  if (!presentation.slides?.length) {
    return null;
  }

  return (
    <>
      <ThemeInit />
      <style>{`
        @page {
          size: 1600px 900px;
          margin: 0;
        }
        @media print {
          html, body {
            margin: 0;
            padding: 0;
            width: 1600px;
            height: 900px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .slide-container {
            page-break-after: always;
            break-after: always;
            width: 1600px;
            height: 900px;
            break-inside: avoid;
            font-size: calc(1600px / 60) !important;
            -webkit-box-decoration-break: clone;
          }
          .slide-container:last-child {
            page-break-after: avoid;
            break-after: avoid;
          }
          .tsqd-parent-container {
            display: none;
          }
        }
      `}</style>

      <div>
        {presentation.slides.map((slide) => (
          <div
            key={slide.id}
            className="slide-container w-full h-full flex items-center justify-center pointer-events-none"
            style={{ fontSize: `${fontSize}px` }}
          >
            <SlideWrapper
              isActive={false}
              isPresenting={true}
              slide={slide}
              onUpdate={() => {}}
              isEditable={false}
              theme={theme}
            />
          </div>
        ))}
      </div>
    </>
  );
}
