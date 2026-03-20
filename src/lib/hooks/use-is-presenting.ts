
import { atom, useAtom } from "jotai";
export const isPresentingAtom = atom<boolean>(false);

export const useIsPresentingAtom = (): [boolean, (value: boolean) => void] => {
  const [isPresenting, setIsPresenting] = useAtom(isPresentingAtom);

  return [isPresenting, setIsPresenting];
};
