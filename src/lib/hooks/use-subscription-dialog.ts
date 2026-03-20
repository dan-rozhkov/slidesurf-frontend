
import { atom, useAtom } from "jotai";

export const subscriptionDialogAtom = atom<boolean>(false);

export const useSubscriptionDialog = (): [
  boolean,
  (value: boolean) => void
] => {
  const [isOpen, setIsOpen] = useAtom(subscriptionDialogAtom);

  return [isOpen, setIsOpen];
};
