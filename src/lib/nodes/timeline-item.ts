import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { TimelineItemView } from "./timeline-item-view";

export type TimelineItemOptions = {
  HTMLAttributes: {
    class?: string;
    style?: string;
    [key: string]: string | undefined;
  };
};

export type TimelineItemAttributes = {
  title: string;
  content: string;
  index: number;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    timelineItem: {
      setTimelineItem: (attrs: TimelineItemAttributes) => ReturnType;
      updateTimelineItem: (attrs: TimelineItemAttributes) => ReturnType;
    };
  }
}

export const TimelineItem = Node.create<TimelineItemOptions>({
  name: "timelineItem",
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
        tag: "div[data-type='timeline-item']",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { ...HTMLAttributes, "data-type": "timeline-item" }, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TimelineItemView);
  },

  addCommands() {
    return {
      setTimelineItem:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          });
        },
      updateTimelineItem:
        (attrs) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, attrs);
        },
    };
  },
});
