import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { FeaturesListView } from "./features-list-view";

export interface FeaturesListOptions {
  HTMLAttributes: {
    class?: string;
    style?: string;
    [key: string]: string | undefined;
  };
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    featuresList: {
      setFeaturesList: () => ReturnType;
    };
  }
}

export const FeaturesList = Node.create<FeaturesListOptions>({
  name: "featuresList",
  group: "block",
  content: "feature*",
  atom: true,
  defining: true,
  isolating: true,
  inline: false,
  draggable: true,
  selectable: true,

  parseHTML() {
    return [
      {
        tag: "div[data-type='features-list']",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { ...HTMLAttributes, "data-type": "features-list" }, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FeaturesListView);
  },

  addCommands() {
    return {
      setFeaturesList:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
          });
        },
    };
  },
});
