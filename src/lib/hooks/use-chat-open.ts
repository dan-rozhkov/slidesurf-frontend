
import { atom, useAtom } from "jotai";

export const isChatOpenAtom = atom<boolean>(false);

type BooleanStateAction = boolean | ((prev: boolean) => boolean);

export const useChatOpenAtom = (): [
  boolean,
  (update: BooleanStateAction) => void
] => {
  const [isChatOpen, setIsChatOpen] = useAtom(isChatOpenAtom);

  return [isChatOpen, setIsChatOpen];
};
