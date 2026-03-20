
import { Node, mergeAttributes } from "@tiptap/core";
import { CardView } from "./card-view";
import { ReactNodeViewRenderer } from "@tiptap/react";

export const Card = Node.create({
  name: "card",
  group: "block",
  content: "block+",
  inline: false,
  // selectable: true,
  draggable: true,

  addAttributes() {
    return {
      accent: {
        default: false,
        parseHTML: (element) => element.getAttribute("data-accent") === "true",
        renderHTML: (attributes) => {
          return {
            "data-type": "card",
            "data-accent": attributes.accent ? "true" : "false",
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='card']",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "card",
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CardView, {
      as: "div",
    });
  },
});
