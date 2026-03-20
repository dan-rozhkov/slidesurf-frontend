
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { BentoGridItemView } from "./bento-grid-item-view";

export type BentoGridItemAttributes = {
  colSpan: number;
  rowSpan: number;
  colStart: number | null;
  rowStart: number | null;
  backgroundImageUrl: string | null;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    bentoGridItem: {
      setBentoGridItem: () => ReturnType;
      updateBentoGridItem: (attrs: Partial<BentoGridItemAttributes>) => ReturnType;
    };
  }
}

export const BentoGridItem = Node.create({
  name: "bentoGridItem",
  group: "block",
  content: "block+",
  inline: false,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      colSpan: {
        default: 1,
        parseHTML: (element) =>
          parseInt(element.getAttribute("data-col-span") || "1", 10),
        renderHTML: (attributes) => ({
          "data-col-span": attributes.colSpan,
        }),
      },
      rowSpan: {
        default: 1,
        parseHTML: (element) =>
          parseInt(element.getAttribute("data-row-span") || "1", 10),
        renderHTML: (attributes) => ({
          "data-row-span": attributes.rowSpan,
        }),
      },
      colStart: {
        default: null,
        parseHTML: (element) => {
          const value = element.getAttribute("data-col-start");
          return value ? parseInt(value, 10) : null;
        },
        renderHTML: (attributes) => {
          if (attributes.colStart === null) return {};
          return { "data-col-start": attributes.colStart };
        },
      },
      rowStart: {
        default: null,
        parseHTML: (element) => {
          const value = element.getAttribute("data-row-start");
          return value ? parseInt(value, 10) : null;
        },
        renderHTML: (attributes) => {
          if (attributes.rowStart === null) return {};
          return { "data-row-start": attributes.rowStart };
        },
      },
      backgroundImageUrl: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-background-image"),
        renderHTML: (attributes) => {
          if (!attributes.backgroundImageUrl) return {};
          return { "data-background-image": attributes.backgroundImageUrl };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="bento-grid-item"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "bento-grid-item",
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BentoGridItemView);
  },

  addCommands() {
    return {
      setBentoGridItem:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            content: [{ type: "paragraph" }],
          });
        },
      updateBentoGridItem:
        (attrs) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, attrs);
        },
    };
  },
});
