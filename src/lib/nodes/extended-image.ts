import { Image } from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ImageNodeView from "./image-view";

const parsePercentageStyle = (style: string | null, property: string) => {
  if (!style) return null;

  const match = style.match(
    new RegExp(`${property}:\\s*(\\d+(?:\\.\\d+)?)%`)
  );

  return match ? match[1] : null;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    extendedImage: {
      setImage: (options: {
        src: string;
        alt?: string;
        width?: string;
        height?: string;
      }) => ReturnType;
    };
  }
}

export const ExtendedImage = Image.extend({
  name: "extendedImage",
  draggable: true,
  inline: false,
  selectable: true,

  addAttributes() {
    return {
      ...this.parent?.(),
      alignment: {
        default: "center",
        parseHTML: (element) => element.getAttribute("data-alignment"),
        renderHTML: (attributes) => ({
          "data-alignment": attributes.alignment,
        }),
      },
      width: {
        default: null,
        parseHTML: (element) => {
          return parsePercentageStyle(element.getAttribute("style"), "width");
        },
        renderHTML: (attributes) => ({
          style: attributes.width ? `width: ${attributes.width}%` : null,
        }),
      },
      height: {
        default: null,
        parseHTML: (element) => {
          return parsePercentageStyle(element.getAttribute("style"), "height");
        },
        renderHTML: (attributes) => ({
          style: attributes.height ? `height: ${attributes.height}%` : null,
        }),
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },

  addCommands() {
    return {
      setImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
