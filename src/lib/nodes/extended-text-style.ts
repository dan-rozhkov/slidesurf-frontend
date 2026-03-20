import { TextStyle } from "@tiptap/extension-text-style";
import { Attribute } from "@tiptap/core";

const ExtendedTextStyle = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.fontSize || null,
        renderHTML: (attributes: Record<string, string | number>) => {
          if (!attributes.fontSize) return {};
          return { style: `font-size: ${attributes.fontSize}` };
        },
      } as Attribute,
      fontWeight: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.fontWeight || null,
        renderHTML: (attributes: Record<string, string | number>) => {
          if (!attributes.fontWeight) return {};
          return { style: `font-weight: ${attributes.fontWeight}` };
        },
      } as Attribute,
      letterSpacing: {
        default: null,
        parseHTML: (element: HTMLElement) =>
          element.style.letterSpacing || null,
        renderHTML: (attributes: Record<string, string | number>) => {
          if (!attributes.letterSpacing) return {};
          return { style: `letter-spacing: ${attributes.letterSpacing}` };
        },
      } as Attribute,
      lineHeight: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.lineHeight || null,
        renderHTML: (attributes: Record<string, string | number>) => {
          if (!attributes.lineHeight) return {};
          return { style: `line-height: ${attributes.lineHeight}` };
        },
      } as Attribute,
      color: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.color || null,
        renderHTML: (attributes: Record<string, string | number>) => {
          if (!attributes.color) return {};
          return { style: `color: ${attributes.color}` };
        },
      } as Attribute,
    };
  },
});

export default ExtendedTextStyle;
