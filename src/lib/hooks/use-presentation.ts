
import { useAtom } from "jotai";
import { atom } from "jotai";
import { Presentation } from "@/types";
import { nanoid } from "@/lib/utils";

export const presentationAtom = atom<Presentation>({
  id: nanoid(),
  title: "Без названия",
  slides: [],
  themeId: "tech-community",
});

export const usePresentationAtom = () => {
  const [presentation, setPresentation] = useAtom(presentationAtom);

  return [presentation, setPresentation] as const;
};
