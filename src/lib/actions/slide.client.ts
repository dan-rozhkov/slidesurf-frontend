import { apiFetch } from "@/api/client";
import { usePresentationAtom } from "@/lib/hooks/use-presentation";
import {
  Slide,
  SlideLayout,
  SlidesTemplates,
  SlideVerticalAlign,
} from "@/types";
import {
  empty,
  twoColsWithSubheadings,
  twoCols,
  twoColsWithBarChart,
  threeCols,
  fourCols,
  cards,
  frontSlide,
  imageWithText,
  textWithImage,
  titleWithListOptionsAndImage,
  titleWithListOptions,
  titleWithTable,
  titleWithFeaturesList,
  titleWithTimeline,
  arrowsHorizontal,
  pyramid,
  statistics,
  bigNumbers,
  ratingStars,
  quotes,
  bentoGrid,
} from "@/lib/templates/new-slide-templates";
import { nanoid } from "nanoid";
import { domToPng } from "modern-screenshot";
import { dataURLToBlob } from "../utils";
import { useIsPresentingAtom } from "../hooks/use-is-presenting";

const SLIDE_TEMPLATES = {
  [SlidesTemplates.EMPTY]: empty,
  [SlidesTemplates.TWO_COLS_WITH_SUBHEADINGS]: twoColsWithSubheadings,
  [SlidesTemplates.TWO_COLS]: twoCols,
  [SlidesTemplates.TWO_COLS_WITH_BAR_CHART]: twoColsWithBarChart,
  [SlidesTemplates.THREE_COLS]: threeCols,
  [SlidesTemplates.FOUR_COLS]: fourCols,
  [SlidesTemplates.CARDS]: cards,
  [SlidesTemplates.FRONT_SLIDE]: frontSlide,
  [SlidesTemplates.IMAGE_WITH_TEXT]: imageWithText,
  [SlidesTemplates.TEXT_WITH_IMAGE]: textWithImage,
  [SlidesTemplates.TITLE_WITH_LIST_OPTIONS_AND_IMAGE]:
    titleWithListOptionsAndImage,
  [SlidesTemplates.TITLE_WITH_LIST_OPTIONS]: titleWithListOptions,
  [SlidesTemplates.TITLE_WITH_TABLE]: titleWithTable,
  [SlidesTemplates.TITLE_WITH_FEATURES_LIST]: titleWithFeaturesList,
  [SlidesTemplates.TITLE_WITH_TIMELINE]: titleWithTimeline,
  [SlidesTemplates.ARROWS_HORIZONTAL]: arrowsHorizontal,
  [SlidesTemplates.PYRAMID]: pyramid,
  [SlidesTemplates.STATISTICS]: statistics,
  [SlidesTemplates.BIG_NUMBERS]: bigNumbers,
  [SlidesTemplates.RATING_STARS]: ratingStars,
  [SlidesTemplates.QUOTES]: quotes,
  [SlidesTemplates.BENTO_GRID]: bentoGrid,
};

export const useSlideActions = () => {
  const [presentationAtom, setPresentationAtom] = usePresentationAtom();
  const [, setIsPresentingAtom] = useIsPresentingAtom();

  const deleteSlideImage = (slideId: string) => {
    const updatedSlides = presentationAtom.slides.map((slide) =>
      slide.id === slideId
        ? { ...slide, layoutImageUrl: null, layout: SlideLayout.WITHOUT }
        : slide
    );

    setPresentationAtom({
      ...presentationAtom,
      slides: updatedSlides as Slide[],
    });
  };

  const updateSlideContent = (slideId: string, content: string) => {
    const updatedSlides = presentationAtom.slides.map((slide) =>
      slide.id === slideId ? { ...slide, content } : slide
    );

    setPresentationAtom({
      ...presentationAtom,
      slides: updatedSlides as Slide[],
    });
  };

  const updateSlideContentWithTemplate = (
    slideId: string,
    content: string,
    template: {
      layout: SlideLayout;
      verticalAlign: SlideVerticalAlign;
    }
  ) => {
    const updatedSlides = presentationAtom.slides.map((slide) =>
      slide.id === slideId
        ? {
            ...slide,
            content,
            layoutImageUrl: null,
            layout: template.layout,
            verticalAlign: template.verticalAlign,
          }
        : slide
    );

    setIsPresentingAtom(true);

    setPresentationAtom({
      ...presentationAtom,
      slides: updatedSlides as Slide[],
    });

    setTimeout(() => {
      setIsPresentingAtom(false);
    }, 100);
  };

  const getSlideTemplateContent = (template: SlidesTemplates) => {
    return SLIDE_TEMPLATES[template];
  };

  const addNewSlide = () => {
    const {
      content = "",
      layout,
      verticalAlign,
    } = getSlideTemplateContent(SlidesTemplates.EMPTY);

    setPresentationAtom({
      ...presentationAtom,
      slides: [
        {
          id: nanoid(),
          content,
          layout,
          verticalAlign,
        },
        ...presentationAtom.slides,
      ],
    });
  };

  const screenshotSlide = async (slideId: string) => {
    const slide = presentationAtom.slides.find((slide) => slide.id === slideId);
    if (!slide) return;

    const screenshot = await domToPng(
      document.getElementById(`slide-${slide.id}`) as Node
    );

    const blob = await dataURLToBlob(screenshot);
    const file = new File([blob], "preview.png", { type: blob.type });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("presentationId", presentationAtom.id);

    const response = await apiFetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data.url;
  };

  return {
    deleteSlideImage,
    updateSlideContent,
    updateSlideContentWithTemplate,
    getSlideTemplateContent,
    addNewSlide,
    screenshotSlide,
  };
};
