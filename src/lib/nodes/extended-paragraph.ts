import { Paragraph } from "@tiptap/extension-paragraph";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ParagraphView } from "./paragraph-view";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    extendedParagraph: {
      setParagraph: (options: { alignment?: string }) => ReturnType;
    };
  }
}

export const ExtendedParagraph = Paragraph.extend({
  draggable: false,
  selectable: true,

  addAttributes() {
    return {
      ...this.parent?.(),
      textAlign: {
        default: "left",
        parseHTML: (element) => element.style.textAlign,
        renderHTML: (attributes) => ({
          style: `text-align: ${attributes.textAlign}`,
        }),
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ParagraphView, {
      contentDOMElementTag: "p",
    });
  },
});
