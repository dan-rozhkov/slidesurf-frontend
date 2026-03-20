
import { Node, mergeAttributes, CommandProps } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { BentoGridView } from "./bento-grid-view";

export type BentoGridAttributes = {
  cols: number;
  rows: number;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    bentoGrid: {
      setBentoGrid: (options?: { cols?: number; rows?: number }) => ReturnType;
      updateBentoGrid: (attrs: Partial<BentoGridAttributes>) => ReturnType;
    };
  }
}

export const BentoGrid = Node.create({
  name: "bentoGrid",
  content: "bentoGridItem+",
  group: "block",
  draggable: true,
  inline: false,
  selectable: true,

  addAttributes() {
    return {
      cols: {
        default: 3,
        parseHTML: (element) =>
          parseInt(element.getAttribute("data-cols") || "3", 10),
        renderHTML: (attributes) => ({
          "data-cols": attributes.cols,
        }),
      },
      rows: {
        default: 4,
        parseHTML: (element) =>
          parseInt(element.getAttribute("data-rows") || "4", 10),
        renderHTML: (attributes) => ({
          "data-rows": attributes.rows,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="bento-grid"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "bento-grid" }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BentoGridView);
  },

  addCommands() {
    return {
      setBentoGrid:
        (options = {}) =>
        ({ commands }: CommandProps) => {
          const cols = options.cols || 3;
          const rows = options.rows || 4;

          // Generate default items for the grid
          const items = [];
          // Create a few spanning items for the bento effect
          items.push({
            type: "bentoGridItem",
            attrs: { colSpan: 1, rowSpan: 2, colStart: 1, rowStart: 1 },
            content: [{ type: "paragraph" }],
          });
          items.push({
            type: "bentoGridItem",
            attrs: { colSpan: 1, rowSpan: 2, colStart: 2, rowStart: 1 },
            content: [{ type: "paragraph" }],
          });
          items.push({
            type: "bentoGridItem",
            attrs: { colSpan: 1, rowSpan: 2, colStart: 3, rowStart: 1 },
            content: [{ type: "paragraph" }],
          });
          items.push({
            type: "bentoGridItem",
            attrs: { colSpan: 1, rowSpan: 2, colStart: 1, rowStart: 3 },
            content: [{ type: "paragraph" }],
          });
          items.push({
            type: "bentoGridItem",
            attrs: { colSpan: 1, rowSpan: 1, colStart: 2, rowStart: 3 },
            content: [{ type: "paragraph" }],
          });
          items.push({
            type: "bentoGridItem",
            attrs: { colSpan: 1, rowSpan: 2, colStart: 3, rowStart: 3 },
            content: [{ type: "paragraph" }],
          });
          items.push({
            type: "bentoGridItem",
            attrs: { colSpan: 1, rowSpan: 1, colStart: 2, rowStart: 4 },
            content: [{ type: "paragraph" }],
          });

          return commands.insertContent({
            type: this.name,
            attrs: { cols, rows },
            content: items,
          });
        },
      updateBentoGrid:
        (attrs) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, attrs);
        },
    };
  },
});
