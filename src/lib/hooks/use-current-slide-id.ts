
import { atom, useAtom } from "jotai";

export const currentSlideIdAtom = atom<string>("");

export const useCurrentSlideIdAtom = (): [string, (value: string) => void] => {
  const [currentSlideId, setCurrentSlideId] = useAtom(currentSlideIdAtom);

  return [currentSlideId, setCurrentSlideId];
};
