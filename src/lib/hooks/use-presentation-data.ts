
import { atom, useAtom } from "jotai";
import { Section, Attachment, ContentSettings } from "@/types";

export const presentationDataAtom = atom<{
  slidesPlan: Section[] | null;
  attachments: Attachment[] | null;
  model: string | null;
  contentSettings: ContentSettings | null;
  planId: string | null;
}>({ slidesPlan: null, attachments: null, model: null, contentSettings: null, planId: null });

export const usePresentationData = (): [
  {
    slidesPlan: Section[] | null;
    attachments: Attachment[] | null;
    model: string | null;
    contentSettings: ContentSettings | null;
    planId: string | null;
  },
  (value: {
    slidesPlan: Section[] | null;
    attachments: Attachment[] | null;
    model: string | null;
    contentSettings: ContentSettings | null;
    planId: string | null;
  }) => void
] => {
  const [presentationData, setPresentationData] = useAtom(presentationDataAtom);

  return [presentationData, setPresentationData];
};
