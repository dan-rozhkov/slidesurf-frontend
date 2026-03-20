
import { atom, useAtom } from "jotai";

const agentPromptAtom = atom<string | null>(null);

type PromptStateAction =
  | string
  | null
  | ((prev: string | null) => string | null);

export const useAgentPromptAtom = (): [
  string | null,
  (update: PromptStateAction) => void
] => {
  return useAtom(agentPromptAtom);
};

