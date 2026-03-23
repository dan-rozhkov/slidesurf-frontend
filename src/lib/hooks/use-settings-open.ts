import { atom, useAtom } from "jotai";

export const isSettingsOpenAtom = atom<boolean>(false);

type BooleanStateAction = boolean | ((prev: boolean) => boolean);

export const useSettingsOpenAtom = (): [
  boolean,
  (update: BooleanStateAction) => void
] => {
  const [isSettingsOpen, setIsSettingsOpen] = useAtom(isSettingsOpenAtom);

  return [isSettingsOpen, setIsSettingsOpen];
};
