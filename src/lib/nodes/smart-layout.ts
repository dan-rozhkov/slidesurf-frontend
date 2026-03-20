
import { Node, mergeAttributes } from "@tiptap/core";
import { SmartLayoutView } from "./smart-layout-view";
import { ReactNodeViewRenderer } from "@tiptap/react";

export type SmartLayoutType =
  | "arrows"
  | "arrows-down"
  | "statistics"
  | "big-numbers"
  | "raiting-stars"
  | "pyramid"
  | "funnel"
  | "quotes";

export type SmartLayoutAttributes = {
  type: SmartLayoutType;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    smartLayout: {
      setSmartLayout: (options: { type: SmartLayoutType }) => ReturnType;
    };
  }
}

export const SmartLayout = Node.create({
  name: "smartLayout",
  group: "block",
  content: "smartLayoutItem{0,6}",
  inline: false,
  draggable: true,
  selectable: true,
  // isolating: true,
  // atom: true,

  addAttributes() {
    return {
      type: {
        default: "arrows",
        parseHTML: (element) =>
          element.getAttribute("data-smart-layout-type") || "arrows",
        renderHTML: (attributes) => ({
          "data-smart-layout-type": attributes.type,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='smart-layout']",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "smart-layout",
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(SmartLayoutView, {
      as: "div",
    });
  },

  addCommands() {
    return {
      setSmartLayout:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { type: options.type },
            content: [
              {
                type: "smartLayoutItem",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Item 1" }],
                  },
                ],
              },
              {
                type: "smartLayoutItem",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Item 2" }],
                  },
                ],
              },
            ],
          });
        },
    };
  },
});
