import DOMPurify from "dompurify";

// Inline formatting only — section titles / key points are short rich text,
// never block-level layout or scripts. Used to neutralize XSS in LLM-generated
// content rendered via dangerouslySetInnerHTML / innerHTML.
export function sanitizeInlineHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "s", "br", "span", "mark"],
    ALLOWED_ATTR: ["class"],
  });
}
