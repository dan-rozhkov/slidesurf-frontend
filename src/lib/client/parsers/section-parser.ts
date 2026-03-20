import { Section } from "@/types";
import {
  parseSectionBlock,
  parseSectionsFromBlocks,
} from "@/lib/shared/section-parser";

export { parseSectionBlock };

export function parseSectionsFromStream(content: string): Section[] {
  return parseSectionsFromBlocks(content, { includeKeyPoints: false });
}
