import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { IconView } from "./icon-view";
import {
  type IconSize,
  DEFAULT_ICON_NAME,
  DEFAULT_ICON_SIZE,
} from "../utils/lucide-icon-map";

export interface IconAttributes {
  name: string;
  size: IconSize;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    icon: {
      setIcon: (attrs: Partial<IconAttributes>) => ReturnType;
    };
  }
}

export const IconNode = Node.create({
  name: "icon",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      name: {
        default: DEFAULT_ICON_NAME,
        parseHTML: (element) =>
          element.getAttribute("data-icon-name") || DEFAULT_ICON_NAME,
        renderHTML: (attributes) => ({
          "data-icon-name": attributes.name,
        }),
      },
      size: {
        default: DEFAULT_ICON_SIZE,
        parseHTML: (element) =>
          element.getAttribute("data-icon-size") || DEFAULT_ICON_SIZE,
        renderHTML: (attributes) => ({
          "data-icon-size": attributes.size,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-type='icon']",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", { ...HTMLAttributes, "data-type": "icon" }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(IconView, {
      as: "span",
    });
  },

  addCommands() {
    return {
      setIcon:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              name: attrs?.name || DEFAULT_ICON_NAME,
              size: attrs?.size || DEFAULT_ICON_SIZE,
            },
          });
        },
    };
  },
});
