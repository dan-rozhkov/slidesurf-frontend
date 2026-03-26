import { createContext, useContext } from "react";

export const SlidePreviewContext = createContext(false);

export const useIsSlidePreview = () => useContext(SlidePreviewContext);
