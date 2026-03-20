
import { SlideProps } from "@/types";
import { EditorContent } from "@tiptap/react";
import FloatingMenu from "@/components/floating-menu";
import { forwardRef, memo } from "react";
import SlideLayoutImage from "./slide-layout-image";
import { useSlideStyles, IMAGE_LAYOUTS } from "@/lib/hooks/use-slide-styles";

const Slide = forwardRef<HTMLDivElement, SlideProps>(
  ({ slide, isActive, editor, isPresenting = false, theme }, ref) => {
    const {
      containerClasses,
      containerStyle,
      contentWrapperClasses,
      editorClasses,
    } = useSlideStyles({
      slide,
      theme,
      isActive,
      isPresenting,
    });

    return (
      <div
        id={`slide-${isPresenting ? "preview-" : ""}${slide.id}`}
        data-layout={slide.layout}
        ref={ref}
        className={containerClasses}
        style={containerStyle}
      >
        {IMAGE_LAYOUTS.includes(
          slide.layout as (typeof IMAGE_LAYOUTS)[number]
        ) && <SlideLayoutImage slide={slide} isPresenting={isPresenting} />}

        <div className={contentWrapperClasses}>
          <EditorContent editor={editor} className={editorClasses} />
          {editor && <FloatingMenu editor={editor} slideId={slide.id} />}
        </div>
      </div>
    );
  }
);

Slide.displayName = "Slide";

export default memo(Slide);
