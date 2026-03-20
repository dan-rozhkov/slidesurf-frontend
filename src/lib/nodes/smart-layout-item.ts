
import { Node, mergeAttributes } from "@tiptap/core";
import { SmartLayoutItemView } from "./smart-layout-item-view";
import { ReactNodeViewRenderer } from "@tiptap/react";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    smartLayoutItem: {
      setSmartLayoutItem: () => ReturnType;
      updateSmartLayoutItem: (attrs: {
        type?: string;
        value?: string;
      }) => ReturnType;
    };
  }
}

export const SmartLayoutItem = Node.create({
  name: "smartLayoutItem",
  group: "block",
  content: "block+",
  inline: false,
  draggable: true,
  selectable: true,

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
      value: {
        default: "",
        parseHTML: (element) =>
          element.getAttribute("data-smart-layout-value") || "",
        renderHTML: (attributes) => ({
          "data-smart-layout-value": attributes.value,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='smart-layout-item']",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "smart-layout-item",
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(SmartLayoutItemView, {
      as: "div",
    });
  },

  addCommands() {
    return {
      setSmartLayoutItem:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            content: [{ type: "paragraph" }],
          });
        },
      updateSmartLayoutItem:
        (attrs) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, attrs);
        },
    };
  },

  addProseMirrorPlugins() {
    return [];
  },
});
