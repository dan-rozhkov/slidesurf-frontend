import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { TimelineView } from "./timeline-view";

export type TimelineOptions = {
  HTMLAttributes: {
    class?: string;
    style?: string;
    [key: string]: string | undefined;
  };
  direction?: "horizontal" | "vertical";
  showNumbers?: boolean;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    timeline: {
      setTimeline: (attrs?: {
        direction?: "horizontal" | "vertical";
        showNumbers?: boolean;
      }) => ReturnType;
    };
  }
}

export const Timeline = Node.create<TimelineOptions>({
  name: "timeline",
  group: "block",
  content: "timelineItem*",
  atom: true,
  defining: true,
  isolating: true,
  inline: false,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      direction: {
        default: "vertical",
        parseHTML: (element) =>
          element.getAttribute("data-direction") || "vertical",
        renderHTML: (attributes) => {
          return {
            "data-direction": attributes.direction,
          };
        },
      },
      showNumbers: {
        default: true,
        parseHTML: (element) =>
          element.getAttribute("data-show-numbers") || true,
        renderHTML: (attributes) => {
          return { "data-show-numbers": attributes.showNumbers };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='timeline']",
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      "div",
      {
        ...HTMLAttributes,
        "data-type": "timeline",
        "data-direction": node.attrs.direction,
        "data-show-numbers": node.attrs.showNumbers,
      },
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TimelineView);
  },

  addCommands() {
    return {
      setTimeline:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              direction: attrs?.direction,
              showNumbers: attrs?.showNumbers,
            },
          });
        },
    };
  },
});
