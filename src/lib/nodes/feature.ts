import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { FeatureView } from "./feature-view";

export interface FeatureOptions {
  HTMLAttributes: {
    class?: string;
    style?: string;
    [key: string]: string | undefined;
  };
}

export interface FeatureAttributes {
  title: string;
  content: string;
  index: number;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    feature: {
      setFeature: (attrs: FeatureAttributes) => ReturnType;
      updateFeature: (attrs: FeatureAttributes) => ReturnType;
    };
  }
}

export const Feature = Node.create<FeatureOptions>({
  name: "feature",
  group: "block",
  content: "block*",
  atom: true,
  inline: false,
  draggable: false,
  selectable: true,

  addAttributes() {
    return {
      title: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-title"),
        renderHTML: (attributes) => ({
          "data-title": attributes.title,
        }),
      },
      content: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-content"),
        renderHTML: (attributes) => ({
          "data-content": attributes.content,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='feature']",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { ...HTMLAttributes, "data-type": "feature" }, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FeatureView);
  },

  addCommands() {
    return {
      setFeature:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          });
        },
      updateFeature:
        (attrs) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, attrs);
        },
    };
  },
});
