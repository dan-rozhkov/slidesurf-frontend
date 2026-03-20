
import Slide from "./slide";
import { memo, forwardRef } from "react";
import { EditorInstance, Theme } from "@/types";
import { useEditorInstance } from "@/lib/hooks/use-editor-instance";

export const SlideWrapper = forwardRef<
  HTMLDivElement,
  EditorInstance & {
    isActive: boolean;
    isPresenting: boolean;
    theme?: Theme | null;
  }
>(({ slide, onUpdate, isEditable, isActive, isPresenting, theme }, ref) => {
  const editor = useEditorInstance({
    slide,
    isEditable,
    onUpdate,
  });

  return (
    <Slide
      slide={slide}
      ref={ref}
      editor={editor}
      isActive={isActive}
      isPresenting={isPresenting}
      theme={theme}
    />
  );
});
SlideWrapper.displayName = "SlideWrapper";

export default memo(SlideWrapper);
