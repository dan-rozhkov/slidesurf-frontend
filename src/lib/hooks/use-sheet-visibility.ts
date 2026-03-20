
import { atom, useAtom } from "jotai";

export type ImageSheetContext = {
  mode: "slide" | "cell";
  imageUrl?: string | null;
  onImageChange?: (url: string) => void;
  onImageReset?: () => void;
};

type SheetState = {
  isOpen: boolean;
  context: ImageSheetContext;
};

const defaultContext: ImageSheetContext = {
  mode: "slide",
};

export const sheetVisibilityAtom = atom<SheetState>({
  isOpen: false,
  context: defaultContext,
});

export const useSheetVisibility = (): [
  boolean,
  (value: boolean, context?: ImageSheetContext) => void,
  ImageSheetContext
] => {
  const [sheetState, setSheetState] = useAtom(sheetVisibilityAtom);

  const setSheetVisibility = (
    isOpen: boolean,
    context?: ImageSheetContext
  ) => {
    setSheetState({
      isOpen,
      context: context || defaultContext,
    });
  };

  return [sheetState.isOpen, setSheetVisibility, sheetState.context];
};
